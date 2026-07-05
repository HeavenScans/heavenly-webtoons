## HeavenBot v1 — Workflow chapitres automatisé

Objectif : pipeline semi-automatique depuis un upload jusqu'à la publication programmée, avec tableau de bord et validation admin. Détection auto de sources RSS/API arrive en v2.

### Ce qui existe déjà (pas à refaire)
- Table `chapters` avec `scheduled_at`, `published`, `pages`
- Cron `publish-scheduled-chapters` qui publie automatiquement à l'heure prévue
- Bucket `chapter-pages` (public)
- Rôles `admin` / `super_admin` + guards

### Nouveautés v1

**1. Base de données (migration)**
- Ajout colonnes `chapters` : `status` (`draft` | `pending_review` | `scheduled` | `published` | `cancelled`), `source` (texte libre : d'où vient le chapitre), `watermarked` (bool), `thumbnail_url` (text)
- Nouvelle table `chapter_audit_log` : `id, chapter_id, actor_id, action, details jsonb, created_at` — journal des actions (upload, watermark, validation, publication, annulation)
- Nouvelle table `bot_sources` : `id, name, url, kind (rss|json|manual), enabled, notes, created_at` — pour préparer la v2 mais déjà utilisable pour tracer la provenance

**2. Traitement images (server function)**
- `processChapterImages` : prend une liste d'URLs de pages fraîchement uploadées + slug série + numéro chapitre
  - Télécharge chaque image côté serveur
  - Applique un watermark **texte "HeavenScans"** en bas-droite (canvas côté worker via `@napi-rs/canvas` OU approche pure : compose via `sharp`-alternative compatible Workers → on utilisera `photon-wasm` qui tourne sur Cloudflare Workers)
  - Génère une miniature (première page redimensionnée 400px large)
  - Ré-uploade dans `chapter-pages/{series}/{chapter}/watermarked/`
  - Retourne les nouvelles URLs + thumbnail
- Écrit une entrée dans `chapter_audit_log`

**3. UI Admin — Nouvelle page `/admin/bot`**
Tableau de bord HeavenBot avec 4 colonnes/onglets :
- **Détectés / Brouillons** (`draft`) — chapitres uploadés, watermark pas encore appliqué
- **En attente de validation** (`pending_review`) — traités, attendent un OK admin
- **Programmés** (`scheduled`) — validés + date future
- **Publiés** (`published`) — historique

Chaque carte chapitre : série, numéro, source, miniature, actions selon statut :
- `draft` → bouton "Lancer traitement" (watermark + miniature)
- `pending_review` → boutons "Valider & programmer" (avec date/heure) / "Annuler"
- `scheduled` → bouton "Annuler la publication" (repasse en `pending_review`)

**4. Flux upload amélioré (`/admin`)**
Sur la page admin existante de gestion des chapitres, à la fin de l'upload des pages :
- Statut = `draft`, `source` = "manual" (ou choix parmi `bot_sources`)
- Bouton "Envoyer vers HeavenBot" → route vers `/admin/bot`

**5. Journal (`/admin/bot/logs`)**
Table simple listant les 100 dernières entrées d'`chapter_audit_log`, filtrable par chapitre.

### Ce qui N'EST PAS dans la v1 (dit par toi)
- Détection auto RSS/API (v2 — mais on prépare `bot_sources`)
- Notifications aux lecteurs (v2)
- Vérification qualité images (v2 — pour l'instant, on affiche juste les dimensions)

### Points techniques
- Le watermark tourne dans une `createServerFn` protégée par `requireSupabaseAuth` + check `has_role('admin')`
- Photon-wasm est compatible Cloudflare Workers (contrairement à sharp/canvas). Si tu préfères, on peut aussi générer un simple overlay SVG converti en PNG.
- Le cron auto-publish existant continue de fonctionner : il ne publie que les chapitres `scheduled` avec `scheduled_at <= now()` (petit ajustement pour respecter le nouveau `status`)

### Livraison
Un seul commit avec migration + server functions + page `/admin/bot`. Tu testes en uploadant un chapitre → le fais passer par le pipeline → tu valides → il se publie tout seul à l'heure choisie.
