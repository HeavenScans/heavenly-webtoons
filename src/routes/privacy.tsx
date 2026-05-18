import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Confidentialité — HeavenScans" },
      { name: "description", content: "Politique de confidentialité et gestion des données personnelles sur HeavenScans." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Légal" title="Politique de confidentialité" intro="Comment HeavenScans collecte et utilise tes données.">
      <h2>Données collectées</h2>
      <p>Email (newsletter, compte), préférences de lecture (stockées localement), données techniques anonymes (statistiques de fréquentation).</p>
      <h2>Cookies</h2>
      <p>Nous utilisons uniquement des cookies fonctionnels et d'analyse anonymisée. Aucun tracking publicitaire tiers.</p>
      <h2>Tes droits</h2>
      <p>Tu peux demander l'accès, la rectification ou la suppression de tes données à <a href="mailto:privacy@heavenscans.fr">privacy@heavenscans.fr</a>.</p>
      <h2>Conservation</h2>
      <p>Les données de compte sont conservées tant que le compte est actif, puis supprimées sous 30 jours après désinscription.</p>
    </PageShell>
  ),
});
