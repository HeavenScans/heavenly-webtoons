import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { series } from "@/lib/series";
import { ChevronLeft, ChevronRight, ArrowLeft, Lock, Crown, List, BookOpen } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useDbSeries } from "@/hooks/useDbSeries";
import { TranslatePageButton } from "@/components/TranslatePageButton";
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
    <div className="min-h-screen flex flex-col bg-white text-black [--ink:#0a0a0a] [--paper:#ffffff] [--azure:#1d4ed8] [--azure-deep:#0b1e63] [--halftone:radial-gradient(circle_at_center,rgba(10,10,10,0.18)_1px,transparent_1.4px)]">
      <Header />
      <main className="relative mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
          style={{ backgroundImage: "var(--halftone)", backgroundSize: "10px 10px" }}
        />
        <Link
          to="/series/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--azure-deep)] hover:text-[color:var(--ink)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {s.title}
        </Link>

        <div className="mt-4 relative overflow-hidden rounded-2xl border-[3px] border-[color:var(--ink)] bg-[color:var(--paper)] p-5 sm:p-6 shadow-[6px_6px_0_0_var(--ink)]">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color:var(--azure)] opacity-90" />
          <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-[color:var(--paper)] border-[3px] border-[color:var(--ink)] grid place-items-center">
            <BookOpen className="h-5 w-5 text-[color:var(--ink)]" />
          </div>
          <div className="relative flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-block bg-[color:var(--ink)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--paper)]">
                {s.type}
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight leading-none">
                <span className="text-[color:var(--azure-deep)]">Ch.</span> {chapter.number}
              </h1>
              {chapter.title && (
                <p className="mt-1 text-sm sm:text-base font-bold text-[color:var(--ink)]/80">— {chapter.title}</p>
              )}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--ink)]/60">
              {chapter.releasedAt}
            </div>
          </div>
        </div>

        {hydrated && !isPremium ? (
          <div className="mt-8 relative overflow-hidden rounded-2xl border-[3px] border-[color:var(--ink)] bg-[color:var(--paper)] p-8 sm:p-12 text-center shadow-[6px_6px_0_0_var(--ink)]">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--azure) 0 12px, transparent 12px 28px)",
              }}
            />
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[color:var(--azure)] border-[3px] border-[color:var(--ink)] shadow-[4px_4px_0_0_var(--ink)]">
              <Lock className="h-7 w-7 text-[color:var(--paper)]" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-black uppercase tracking-tight">Chapitre verrouillé</h2>
            <p className="mt-2 max-w-md mx-auto text-sm font-medium text-[color:var(--ink)]/70">
              Ce chapitre est réservé aux membres Premium. Passez Premium pour débloquer la lecture complète et l'accès anticipé.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/premium"
                className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--azure)] border-[3px] border-[color:var(--ink)] px-5 py-3 text-sm font-black uppercase tracking-wider text-[color:var(--paper)] shadow-[4px_4px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] transition"
              >
                <Crown className="h-4 w-4" /> Devenir Premium
              </Link>
              <Link
                to="/series/$slug"
                params={{ slug }}
                className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--paper)] border-[3px] border-[color:var(--ink)] px-5 py-3 text-sm font-black uppercase tracking-wider text-[color:var(--ink)] shadow-[4px_4px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] transition"
              >
                <List className="h-4 w-4" /> Voir les chapitres
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => {
              const url = `https://picsum.photos/seed/${slug}-${number}-${i}/900/1300`;
              return (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-[color:var(--paper)] border-[3px] border-[color:var(--ink)] shadow-[5px_5px_0_0_var(--ink)]"
                >
                  <span className="absolute left-3 top-3 z-10 inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-md bg-[color:var(--ink)] text-[color:var(--paper)] text-xs font-black tracking-wider">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <img
                    src={url}
                    alt={`Page ${i + 1}`}
                    loading="lazy"
                    className="block w-full"
                  />
                  <TranslatePageButton imageUrl={url} pageIndex={i} />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          {prev ? (
            <Link
              to="/series/$slug/chapter/$number"
              params={{ slug, number: prev.number }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--paper)] border-[3px] border-[color:var(--ink)] px-4 py-2.5 text-sm font-black uppercase tracking-wider text-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--ink)] transition"
            >
              <ChevronLeft className="h-4 w-4" /> Ch. {prev.number}
            </Link>
          ) : <span />}
          <Link
            to="/series/$slug"
            params={{ slug }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--paper)] border-[3px] border-[color:var(--ink)] px-4 py-2.5 text-sm font-black uppercase tracking-wider text-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--ink)] transition"
          >
            <List className="h-4 w-4" /> Sommaire
          </Link>
          {next ? (
            <Link
              to="/series/$slug/chapter/$number"
              params={{ slug, number: next.number }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--azure)] border-[3px] border-[color:var(--ink)] px-4 py-2.5 text-sm font-black uppercase tracking-wider text-[color:var(--paper)] shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--ink)] transition"
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
