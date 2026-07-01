import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { allGenres } from "@/lib/series";
import { Loader2, Plus, Trash2, Upload, BookPlus, Library, ShieldAlert, RefreshCw, Bot, Calendar, Zap, Clock, Settings2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — HeavenScans" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type SeriesRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  status: string;
  genres: string[];
  synopsis: string;
  cover_url: string | null;
  is_premium: boolean;
  published: boolean;
};

type ChapterRow = {
  id: string;
  series_id: string;
  number: string;
  title: string | null;
  pages: string[];
  is_premium: boolean;
  published: boolean;
  released_at: string;
  scheduled_at: string | null;
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isTeam, loading: roleLoading } = useRole();
  const [list, setList] = useState<SeriesRow[]>([]);
  const [selected, setSelected] = useState<SeriesRow | null>(null);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const refresh = async () => {
    setLoadingList(true);
    const { data } = await supabase.from("series").select("*").order("created_at", { ascending: false });
    setList((data ?? []) as SeriesRow[]);
    setLoadingList(false);
  };

  useEffect(() => {
    if (isTeam) refresh();
  }, [isTeam]);

  const loadChapters = async (sid: string) => {
    const { data } = await supabase
      .from("chapters")
      .select("*")
      .eq("series_id", sid)
      .order("released_at", { ascending: false });
    setChapters((data ?? []) as ChapterRow[]);
  };

  useEffect(() => {
    if (selected) loadChapters(selected.id);
    else setChapters([]);
  }, [selected]);

  if (authLoading || roleLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!isTeam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-3xl font-black">Accès réservé</h1>
          <p className="mt-2 text-muted-foreground">Cette zone est réservée aux administrateurs et à l'équipe HeavenScans.</p>
          <p className="mt-4 text-xs text-muted-foreground">Ton ID utilisateur : <code className="rounded bg-muted px-2 py-0.5">{user?.id}</code></p>
          <Link to="/" className="mt-6 inline-block text-primary">← Retour à l'accueil</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Back-office</p>
            <h1 className="text-3xl sm:text-4xl font-black">Gestion du catalogue</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/ai" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#6D4AFF] to-[#4DA6FF] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(109,74,255,0.7)]">
              <Bot className="h-4 w-4" /> Agent IA
            </Link>
            {isAdmin && (
              <Link to="/admin/settings" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">
                <Settings2 className="h-4 w-4" /> Paramètres
              </Link>
            )}
            <button onClick={refresh} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">
              <RefreshCw className="h-4 w-4" /> Actualiser
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <SeriesList
            list={list}
            loading={loadingList}
            selected={selected}
            onSelect={setSelected}
            isAdmin={isAdmin}
            onChange={refresh}
          />
          <div className="space-y-6">
            <SeriesEditor series={selected} onSaved={(s) => { setSelected(s); refresh(); }} isAdmin={isAdmin} />
            {selected && (
              <ChaptersPanel
                series={selected}
                chapters={chapters}
                onChange={() => loadChapters(selected.id)}
                isAdmin={isAdmin}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SeriesList({
  list, loading, selected, onSelect, isAdmin, onChange,
}: {
  list: SeriesRow[];
  loading: boolean;
  selected: SeriesRow | null;
  onSelect: (s: SeriesRow | null) => void;
  isAdmin: boolean;
  onChange: () => void;
}) {
  const newSeries = async () => {
    const title = prompt("Titre de la nouvelle série ?");
    if (!title) return;
    const slug = slugify(title);
    const { data, error } = await supabase
      .from("series")
      .insert({ slug, title, type: "Manga", status: "Ongoing", genres: [], synopsis: "" })
      .select()
      .single();
    if (error) return alert(error.message);
    onChange();
    onSelect(data as SeriesRow);
  };

  const remove = async (s: SeriesRow) => {
    if (!confirm(`Supprimer "${s.title}" et tous ses chapitres ?`)) return;
    const { error } = await supabase.from("series").delete().eq("id", s.id);
    if (error) return alert(error.message);
    if (selected?.id === s.id) onSelect(null);
    onChange();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold inline-flex items-center gap-2"><Library className="h-4 w-4 text-primary" /> Séries ({list.length})</h2>
        <button onClick={newSeries} className="inline-flex items-center gap-1 rounded-lg bg-[image:var(--gradient-neon)] px-3 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-neon)]">
          <Plus className="h-3 w-3" /> Nouvelle
        </button>
      </div>
      {loading ? (
        <div className="py-6 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : list.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">Aucune série. Crée la première !</div>
      ) : (
        <ul className="max-h-[60vh] overflow-y-auto space-y-1">
          {list.map((s) => (
            <li key={s.id} className={`group flex items-center gap-2 rounded-lg p-2 cursor-pointer ${selected?.id === s.id ? "bg-muted" : "hover:bg-muted/50"}`}
                onClick={() => onSelect(s)}>
              <div className="h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-muted">
                {s.cover_url && <img src={s.cover_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{s.title}</div>
                <div className="text-[11px] text-muted-foreground">{s.type} · {s.status} {s.published ? "" : "· brouillon"}</div>
              </div>
              {isAdmin && (
                <button onClick={(e) => { e.stopPropagation(); remove(s); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" aria-label="Supprimer">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SeriesEditor({ series, onSaved, isAdmin }: { series: SeriesRow | null; onSaved: (s: SeriesRow) => void; isAdmin: boolean }) {
  const [form, setForm] = useState<SeriesRow | null>(series);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setForm(series); }, [series]);

  if (!series || !form) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Sélectionne une série à gauche ou crée-en une nouvelle.
      </div>
    );
  }

  const upload = async (file: File) => {
    setUploading(true);
    const path = `series/${form.id}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
    if (error) { alert(error.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from("covers").getPublicUrl(path);
    setForm({ ...form, cover_url: pub.publicUrl });
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const { data, error } = await supabase.from("series").update({
      slug: form.slug,
      title: form.title,
      type: form.type,
      status: form.status,
      genres: form.genres,
      synopsis: form.synopsis,
      cover_url: form.cover_url,
      is_premium: form.is_premium,
      published: form.published,
    }).eq("id", form.id).select().single();
    setSaving(false);
    if (error) return alert(error.message);
    onSaved(data as SeriesRow);
  };

  const toggleGenre = (g: string) => {
    setForm({ ...form, genres: form.genres.includes(g) ? form.genres.filter((x) => x !== g) : [...form.genres, g] });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted relative">
          {form.cover_url ? <img src={form.cover_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">Pas de couverture</div>}
        </div>
        <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted">
          <Upload className="h-3.5 w-3.5" /> {uploading ? "Upload…" : "Couverture"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Titre"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></Field>
        <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className="input" /></Field>
        <Field label="Type">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
            {["Manga", "Manhwa", "Manhua", "Webtoon", "Webcomic"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Statut">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
            {["Ongoing", "Completed", "Hiatus"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Synopsis">
        <textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} rows={4} className="input" />
      </Field>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Genres</div>
        <div className="flex flex-wrap gap-1.5">
          {allGenres.map((g) => (
            <button key={g} type="button" onClick={() => toggleGenre(g)}
              className={`rounded-full border px-2.5 py-1 text-xs ${form.genres.includes(g) ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/50"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publié</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} /> Premium</label>
      </div>
      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-neon)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Enregistrer la série
      </button>
      <style>{`.input{margin-top:.25rem;width:100%;border:1px solid hsl(var(--border));border-radius:.5rem;background:hsl(var(--background));padding:.5rem .75rem;font-size:.875rem;outline:none}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ChaptersPanel({ series, chapters, onChange, isAdmin }: { series: SeriesRow; chapters: ChapterRow[]; onChange: () => void; isAdmin: boolean }) {
  const [num, setNum] = useState("");
  const [title, setTitle] = useState("");
  const [premium, setPremium] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [adding, setAdding] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [botRunning, setBotRunning] = useState(false);
  const [botMsg, setBotMsg] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!num.trim()) return;
    let scheduledIso: string | null = null;
    if (scheduleEnabled) {
      if (!scheduledAt) {
        alert("Choisis une date et une heure de publication.");
        return;
      }
      const d = new Date(scheduledAt);
      if (Number.isNaN(d.getTime())) {
        alert("Date invalide.");
        return;
      }
      scheduledIso = d.toISOString();
    }
    setAdding(true);
    let pages: string[] = [];
    if (files && files.length) {
      const arr = Array.from(files).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      for (const f of arr) {
        const path = `${series.id}/${num}/${Date.now()}-${f.name}`;
        const { error } = await supabase.storage.from("chapter-pages").upload(path, f, { upsert: true });
        if (error) { alert(error.message); setAdding(false); return; }
        const { data: pub } = supabase.storage.from("chapter-pages").getPublicUrl(path);
        pages.push(pub.publicUrl);
      }
    }
    const { error } = await supabase.from("chapters").insert({
      series_id: series.id,
      number: num.trim(),
      title: title.trim() || null,
      pages,
      is_premium: premium,
      published: !scheduledIso,
      scheduled_at: scheduledIso,
      released_at: scheduledIso ?? new Date().toISOString(),
    });
    setAdding(false);
    if (error) return alert(error.message);
    setNum(""); setTitle(""); setFiles(null); setPremium(false);
    setScheduleEnabled(false); setScheduledAt("");
    onChange();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce chapitre ?")) return;
    await supabase.from("chapters").delete().eq("id", id);
    onChange();
  };

  const cancelSchedule = async (id: string) => {
    await supabase.from("chapters").update({ scheduled_at: null }).eq("id", id);
    onChange();
  };

  const publishNow = async (id: string) => {
    await supabase
      .from("chapters")
      .update({ published: true, scheduled_at: null, released_at: new Date().toISOString() })
      .eq("id", id);
    onChange();
  };

  const runBot = async () => {
    setBotRunning(true);
    setBotMsg(null);
    try {
      const res = await fetch("/api/public/hooks/publish-scheduled-chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setBotMsg(`✅ Bot exécuté — ${json.published_count} chapitre(s) publié(s).`);
      onChange();
    } catch (e) {
      setBotMsg(`❌ ${e instanceof Error ? e.message : "Échec du bot"}`);
    } finally {
      setBotRunning(false);
    }
  };

  const scheduledChapters = chapters.filter((c) => !c.published && c.scheduled_at);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold inline-flex items-center gap-2 mb-4"><BookPlus className="h-4 w-4 text-primary" /> Chapitres de « {series.title} »</h2>

      {/* Auto-publish bot panel */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-[color:var(--neon-violet)]/30 bg-[image:linear-gradient(135deg,oklch(0.65_0.25_295/0.08),oklch(0.75_0.18_240/0.06))] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon-violet)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--neon-violet)]">Auto-publish Bot</p>
              <p className="text-sm font-bold">Publie tes chapitres tout seul, même quand tu n'es pas là.</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Le bot tourne toutes les 5 min · {scheduledChapters.length} chapitre{scheduledChapters.length > 1 ? "s" : ""} en file d'attente
              </p>
            </div>
          </div>
          <button
            onClick={runBot}
            disabled={botRunning}
            className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-4 py-2 text-xs font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.03] transition disabled:opacity-60"
          >
            {botRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
            Lancer le bot maintenant
          </button>
        </div>
        {botMsg && <p className="mt-3 text-xs">{botMsg}</p>}
        {scheduledChapters.length > 0 && (
          <ul className="mt-3 divide-y divide-[color:var(--neon-violet)]/15 rounded-xl border border-[color:var(--neon-violet)]/20 bg-background/40">
            {scheduledChapters.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                <div className="min-w-0 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[color:var(--neon-violet)] flex-none" />
                  <span className="font-semibold">Ch. {c.number}</span>
                  <span className="text-muted-foreground truncate">
                    publication {new Date(c.scheduled_at!).toLocaleString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <button onClick={() => publishNow(c.id)} className="rounded-md border border-[color:var(--neon-blue)]/40 px-2 py-1 font-bold text-[color:var(--neon-blue)] hover:bg-[color:var(--neon-blue)]/10">
                    Publier
                  </button>
                  <button onClick={() => cancelSchedule(c.id)} className="rounded-md border border-border px-2 py-1 text-muted-foreground hover:text-foreground">
                    Annuler
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={add} className="rounded-xl border border-border bg-background/40 p-4 grid gap-3 sm:grid-cols-2 mb-4">
        <Field label="Numéro"><input value={num} onChange={(e) => setNum(e.target.value)} placeholder="ex: 12 ou 12.5" className="input" required /></Field>
        <Field label="Titre (optionnel)"><input value={title} onChange={(e) => setTitle(e.target.value)} className="input" /></Field>
        <Field label="Pages (images, sélection multiple — triées par nom)">
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="block w-full text-xs" />
        </Field>
        <label className="inline-flex items-center gap-2 text-sm self-end">
          <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> Chapitre Premium
        </label>
        <div className="sm:col-span-2 rounded-xl border border-dashed border-[color:var(--neon-violet)]/30 bg-background/30 p-3">
          <label className="inline-flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
            />
            <Calendar className="h-4 w-4 text-[color:var(--neon-violet)]" />
            Programmer la publication (le bot s'en charge)
          </label>
          {scheduleEnabled && (
            <div className="mt-2 grid sm:grid-cols-[1fr_auto] gap-2 items-center">
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                className="input"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Le chapitre restera en brouillon jusqu'à cette date, puis sera publié automatiquement.
              </p>
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <button disabled={adding} className="inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-neon)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60">
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {scheduleEnabled ? "Programmer le chapitre" : "Ajouter le chapitre"}
          </button>
        </div>
        <style>{`.input{margin-top:.25rem;width:100%;border:1px solid hsl(var(--border));border-radius:.5rem;background:hsl(var(--background));padding:.5rem .75rem;font-size:.875rem;outline:none}`}</style>
      </form>
      {chapters.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-6">Aucun chapitre encore.</div>
      ) : (
        <ul className="divide-y divide-border">
          {chapters.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2.5">
              <div className="min-w-0">
                <div className="text-sm font-semibold inline-flex items-center gap-1.5">
                  Chapitre {c.number}
                  {c.is_premium && <span className="text-[10px] uppercase tracking-wider text-[color:var(--neon-blue)]">Premium</span>}
                  {!c.published && c.scheduled_at && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--neon-violet)]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--neon-violet)]">
                      <Bot className="h-2.5 w-2.5" /> programmé
                    </span>
                  )}
                  {!c.published && !c.scheduled_at && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">brouillon</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {c.title || `${c.pages.length} pages`}
                  {" · "}
                  {!c.published && c.scheduled_at
                    ? `prévu ${new Date(c.scheduled_at).toLocaleString("fr-FR")}`
                    : new Date(c.released_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}