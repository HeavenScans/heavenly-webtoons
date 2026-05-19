import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { series } from "@/lib/series";
import { ChevronLeft, ChevronRight, ArrowLeft, Lock, Crown, List } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useDbSeries } from "@/hooks/useDbSeries";
import { useEffect } from "react";

export const Route = createFileRoute("/series/$slug/chapter/$number")({
  component: ChapterReader,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-black">Chapitre introuvable</h1>
        <Link to="/series" className="mt-4 inline-block text-primary">← Retour au catalogue</Link>
      </div>
    </div>
  ),
});

function ChapterReader() {
  const { slug, number } = Route.useParams();
  const { series: db, loading } = useDbSeries();
  const s = series.find((x) => x.slug === slug) ?? db.find((x) => x.slug === slug);
  const { record } = useReadingHistory();
  useEffect(() => {
    if (s) record(slug, number, 1);
  }, [slug, number, s, record]);
  if (!s && !loading) throw notFound();
  if (!s) return <div className="min-h-screen grid place-items-center text-muted-foreground">Chargement…</div>;
  const idx = s.chapters.findIndex((c) => c.number === number);
  if (idx === -1) throw notFound();
  const chapter = s.chapters[idx];
  const prev = s.chapters[idx + 1];
  const next = s.chapters[idx - 1];
  const { active: isPremium, hydrated } = usePremium();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 py-8">
        <Link
          to="/series/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {s.title}
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--neon-blue)]">{s.type}</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black">
              Chapitre {chapter.number}
              {chapter.title && <span className="text-muted-foreground font-bold"> — {chapter.title}</span>}
            </h1>
          </div>
          <div className="text-xs text-muted-foreground">{chapter.releasedAt}</div>
        </div>

        {hydrated && !isPremium ? (
          <div className="mt-10 relative overflow-hidden rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-8 sm:p-12 text-center">
            <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_50%_0%,oklch(0.65_0.25_295/0.3),transparent_55%)]" />
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon)]">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-5 text-2xl sm:text-3xl font-black">Chapitre verrouillé</h2>
            <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
              Ce chapitre est réservé aux membres Premium. Passez Premium pour débloquer la lecture complète et l'accès anticipé.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/premium"
                className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.03] transition-transform"
              >
                <Crown className="h-4 w-4" /> Devenir Premium
              </Link>
              <Link
                to="/series/$slug"
                params={{ slug }}
                className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-background/40 backdrop-blur px-5 py-3 text-sm font-bold hover:border-[color:var(--neon-violet)] transition"
              >
                <List className="h-4 w-4" /> Voir les chapitres
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-card">
                <img
                  src={`https://picsum.photos/seed/${slug}-${number}-${i}/900/1300`}
                  alt={`Page ${i + 1}`}
                  loading="lazy"
                  className="block w-full"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          {prev ? (
            <Link
              to="/series/$slug/chapter/$number"
              params={{ slug, number: prev.number }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition"
            >
              <ChevronLeft className="h-4 w-4" /> Ch. {prev.number}
            </Link>
          ) : <span />}
          <Link
            to="/series/$slug"
            params={{ slug }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition"
          >
            <List className="h-4 w-4" /> Sommaire
          </Link>
          {next ? (
            <Link
              to="/series/$slug/chapter/$number"
              params={{ slug, number: next.number }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-neon)] px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.02] transition-transform"
            >
              Ch. {next.number} <ChevronRight className="h-4 w-4" />
            </Link>
          ) : <span />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
