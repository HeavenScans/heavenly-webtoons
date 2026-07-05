import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Loader2, ShieldAlert, Wand2, CheckCircle2, XCircle, Clock, Calendar, ArrowLeft, ScrollText, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/admin/bot")({
  head: () => ({ meta: [{ title: "HeavenBot — Workflow chapitres" }, { name: "robots", content: "noindex" }] }),
  component: BotDashboard,
});

type ChapterRow = {
  id: string;
  series_id: string;
  number: string;
  title: string | null;
  pages: string[];
  status: string;
  source: string;
  watermarked: boolean;
  thumbnail_url: string | null;
  scheduled_at: string | null;
  released_at: string;
  published: boolean;
  created_at: string;
  is_premium: boolean;
};

type SeriesLite = { id: string; title: string; slug: string; cover_url: string | null };

type AuditRow = { id: string; chapter_id: string | null; action: string; details: Record<string, unknown>; created_at: string; actor_id: string | null };

type Tab = "draft" | "pending_review" | "scheduled" | "published";

const TABS: { key: Tab; label: string; icon: typeof Wand2 }[] = [
  { key: "draft", label: "Détectés", icon: Bot },
  { key: "pending_review", label: "En attente", icon: Clock },
  { key: "scheduled", label: "Programmés", icon: Calendar },
  { key: "published", label: "Publiés", icon: CheckCircle2 },
];

function BotDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [tab, setTab] = useState<Tab>("draft");
  const [rows, setRows] = useState<ChapterRow[]>([]);
  const [seriesMap, setSeriesMap] = useState<Record<string, SeriesLite>>({});
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate({ to: "/auth" }); }, [authLoading, user, navigate]);

  const refresh = async () => {
    setLoading(true);
    const { data: chs } = await supabase
      .from("chapters")
      .select("id, series_id, number, title, pages, status, source, watermarked, thumbnail_url, scheduled_at, released_at, published, created_at, is_premium")
      .order("created_at", { ascending: false })
      .limit(300);
    const list = (chs ?? []) as ChapterRow[];
    setRows(list);
    const seriesIds = Array.from(new Set(list.map((c) => c.series_id)));
    if (seriesIds.length) {
      const { data: ss } = await supabase.from("series").select("id, title, slug, cover_url").in("id", seriesIds);
      const map: Record<string, SeriesLite> = {};
      (ss ?? []).forEach((s) => (map[(s as SeriesLite).id] = s as SeriesLite));
      setSeriesMap(map);
    }
    const { data: log } = await supabase
      .from("chapter_audit_log")
      .select("id, chapter_id, action, details, created_at, actor_id")
      .order("created_at", { ascending: false })
      .limit(100);
    setAudit((log ?? []) as AuditRow[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  const filtered = useMemo(() => rows.filter((r) => r.status === tab), [rows, tab]);
  const counts = useMemo(() => {
    const c: Record<Tab, number> = { draft: 0, pending_review: 0, scheduled: 0, published: 0 };
    rows.forEach((r) => { if (r.status in c) c[r.status as Tab]++; });
    return c;
  }, [rows]);

  const logAction = async (chapterId: string, action: string, details: Record<string, unknown> = {}) => {
    await supabase.from("chapter_audit_log").insert({ chapter_id: chapterId, actor_id: user?.id ?? null, action, details: details as never });
  };

  if (authLoading || roleLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-3xl font-black">Accès réservé</h1>
          <p className="mt-2 text-muted-foreground">HeavenBot est réservé aux administrateurs.</p>
          <Link to="/" className="mt-6 inline-block text-primary">← Accueil</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-1.5"><Bot className="h-4 w-4" /> HeavenBot</p>
            <h1 className="text-3xl sm:text-4xl font-black">Workflow des chapitres</h1>
            <p className="mt-1 text-sm text-muted-foreground">Détection, watermark, validation & publication programmée</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
            <button onClick={() => setShowLogs((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">
              <ScrollText className="h-4 w-4" /> Journal
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-muted"}`}>
                <Icon className="h-4 w-4" />
                {t.label}
                <span className={`rounded-full px-1.5 text-xs ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{counts[t.key]}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucun chapitre dans cet état.
            {tab === "draft" && <div className="mt-2">Uploade des chapitres depuis <Link to="/admin" className="text-primary underline">l'admin</Link> — ils apparaîtront ici.</div>}
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((c) => (
              <ChapterCard key={c.id} row={c} series={seriesMap[c.series_id]} onChange={refresh} logAction={logAction} />
            ))}
          </div>
        )}

        {showLogs && (
          <section className="mt-10 rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-bold inline-flex items-center gap-2"><ScrollText className="h-5 w-5 text-primary" /> Journal des actions (100 dernières)</h2>
            </div>
            {audit.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Aucune action encore.</div>
            ) : (
              <ul className="divide-y divide-border">
                {audit.map((a) => (
                  <li key={a.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{a.action}</span>
                    <span className="truncate text-muted-foreground">{JSON.stringify(a.details)}</span>
                    <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("fr-FR")}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ChapterCard({ row, series, onChange, logAction }: {
  row: ChapterRow;
  series: SeriesLite | undefined;
  onChange: () => void;
  logAction: (id: string, action: string, details?: Record<string, unknown>) => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [scheduleAt, setScheduleAt] = useState<string>("");

  const process = async () => {
    setBusy("process");
    try {
      const { watermarkedUrls, thumbnail } = await processImages(row);
      await supabase.from("chapters").update({
        pages: watermarkedUrls,
        thumbnail_url: thumbnail ?? row.thumbnail_url,
        watermarked: true,
        status: "pending_review",
      }).eq("id", row.id);
      await logAction(row.id, "processed", { pages: watermarkedUrls.length, watermark: true });
      onChange();
    } catch (e) {
      alert(`Échec traitement : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(null);
    }
  };

  const validateAndSchedule = async () => {
    if (!scheduleAt) { alert("Choisis une date & heure de publication."); return; }
    const d = new Date(scheduleAt);
    if (Number.isNaN(d.getTime())) { alert("Date invalide."); return; }
    setBusy("schedule");
    const iso = d.toISOString();
    await supabase.from("chapters").update({
      status: "scheduled",
      scheduled_at: iso,
      released_at: iso,
      published: false,
    }).eq("id", row.id);
    await logAction(row.id, "validated_and_scheduled", { scheduled_at: iso });
    setBusy(null);
    onChange();
  };

  const publishNow = async () => {
    setBusy("publish");
    const iso = new Date().toISOString();
    await supabase.from("chapters").update({
      status: "published", published: true, scheduled_at: null, released_at: iso,
    }).eq("id", row.id);
    await logAction(row.id, "published_now", {});
    setBusy(null);
    onChange();
  };

  const cancel = async () => {
    if (!confirm("Annuler la publication de ce chapitre ?")) return;
    setBusy("cancel");
    await supabase.from("chapters").update({
      status: "cancelled", published: false, scheduled_at: null,
    }).eq("id", row.id);
    await logAction(row.id, "cancelled", {});
    setBusy(null);
    onChange();
  };

  const backToPending = async () => {
    setBusy("back");
    await supabase.from("chapters").update({
      status: "pending_review", scheduled_at: null, published: false,
    }).eq("id", row.id);
    await logAction(row.id, "unscheduled", {});
    setBusy(null);
    onChange();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {row.thumbnail_url || row.pages[0] || series?.cover_url ? (
            <img src={row.thumbnail_url || row.pages[0] || series?.cover_url || ""} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono rounded bg-muted px-1.5 py-0.5">Ch. {row.number}</span>
            {row.watermarked && <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"><Wand2 className="h-3 w-3" /> Watermark</span>}
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">source: {row.source}</span>
            <span className="text-xs text-muted-foreground">{row.pages.length} page(s)</span>
          </div>
          <h3 className="mt-1 truncate font-semibold">{series?.title ?? "Série inconnue"}{row.title ? ` — ${row.title}` : ""}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ajouté {new Date(row.created_at).toLocaleString("fr-FR")}
            {row.scheduled_at && ` · Programmé pour ${new Date(row.scheduled_at).toLocaleString("fr-FR")}`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {row.status === "draft" && (
          <button onClick={process} disabled={busy !== null || row.pages.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-neon)] px-3 py-2 text-sm font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60">
            {busy === "process" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            Traiter (watermark + miniature)
          </button>
        )}
        {row.status === "pending_review" && (
          <>
            <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-2 text-sm" />
            <button onClick={validateAndSchedule} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-neon)] px-3 py-2 text-sm font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60">
              {busy === "schedule" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
              Valider & programmer
            </button>
            <button onClick={publishNow} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary/10 px-3 py-2 text-sm font-semibold text-primary disabled:opacity-60">
              <PlayCircle className="h-4 w-4" /> Publier maintenant
            </button>
            <button onClick={cancel} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-destructive">
              <XCircle className="h-4 w-4" /> Annuler
            </button>
          </>
        )}
        {row.status === "scheduled" && (
          <>
            <button onClick={publishNow} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-neon)] px-3 py-2 text-sm font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60">
              <PlayCircle className="h-4 w-4" /> Publier maintenant
            </button>
            <button onClick={backToPending} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold">
              <Clock className="h-4 w-4" /> Reporter (retirer)
            </button>
            <button onClick={cancel} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-destructive">
              <XCircle className="h-4 w-4" /> Annuler
            </button>
          </>
        )}
        {row.status === "published" && series && (
          <Link to="/series/$slug/chapter/$number" params={{ slug: series.slug, number: row.number }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">
            Voir le chapitre
          </Link>
        )}
      </div>
    </div>
  );
}

// ---------- Client-side image processing (canvas) ----------
// Runs in the admin browser: downloads originals, burns "HeavenScans" watermark
// in the bottom-right, re-uploads to storage. Thumbnail = first page resized to 400px wide.
async function processImages(row: ChapterRow): Promise<{ watermarkedUrls: string[]; thumbnail: string | null }> {
  const watermarked: string[] = [];
  let thumbnail: string | null = null;

  for (let i = 0; i < row.pages.length; i++) {
    const url = row.pages[i];
    const blob = await watermarkImage(url);
    const path = `${row.series_id}/${row.number}/wm-${Date.now()}-${i}.jpg`;
    const { error } = await supabase.storage.from("chapter-pages").upload(path, blob, { upsert: true, contentType: "image/jpeg" });
    if (error) throw new Error(error.message);
    const { data: pub } = supabase.storage.from("chapter-pages").getPublicUrl(path);
    watermarked.push(pub.publicUrl);

    if (i === 0) {
      const thumbBlob = await resizeImage(url, 400);
      const thumbPath = `${row.series_id}/${row.number}/thumb-${Date.now()}.jpg`;
      const { error: e2 } = await supabase.storage.from("chapter-pages").upload(thumbPath, thumbBlob, { upsert: true, contentType: "image/jpeg" });
      if (!e2) {
        const { data: p2 } = supabase.storage.from("chapter-pages").getPublicUrl(thumbPath);
        thumbnail = p2.publicUrl;
      }
    }
  }
  return { watermarkedUrls: watermarked, thumbnail };
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
}

async function watermarkImage(url: string): Promise<Blob> {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unsupported");
  ctx.drawImage(img, 0, 0);

  // Watermark: bottom-right, semi-transparent white with dark shadow
  const fontSize = Math.max(18, Math.round(canvas.width * 0.035));
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = "bottom";
  ctx.textAlign = "right";
  const text = "HeavenScans";
  const pad = Math.round(fontSize * 0.6);
  ctx.shadowColor = "rgba(0,0,0,0.75)";
  ctx.shadowBlur = Math.round(fontSize * 0.4);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(text, canvas.width - pad, canvas.height - pad);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", 0.9);
  });
}

async function resizeImage(url: string, targetWidth: number): Promise<Blob> {
  const img = await loadImage(url);
  const ratio = targetWidth / img.naturalWidth;
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = Math.round(img.naturalHeight * ratio);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unsupported");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", 0.85);
  });
}