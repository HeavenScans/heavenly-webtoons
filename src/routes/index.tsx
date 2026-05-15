import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeriesCard } from "@/components/SeriesCard";
import { EmptyState } from "@/components/EmptyState";
import { series, allGenres } from "@/lib/series";
import { Flame, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeavenScans — Mangas, Manhwas & Webtoons en VF" },
      { name: "description", content: "Lisez les derniers chapitres de mangas, manhwas, manhuas et webtoons traduits par HeavenScans. Votre paradis de la lecture." },
      { property: "og:title", content: "HeavenScans" },
      { property: "og:description", content: "Lisez les meilleurs scans en VF sur HeavenScans." },
    ],
  }),
  component: Index,
});

function Index() {
  const latest = series.slice(0, 12);
  const popular = series.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-hero)] opacity-20" />
        <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_20%_20%,oklch(0.55_0.20_295/0.25),transparent_50%),radial-gradient(circle_at_80%_60%,oklch(0.78_0.16_75/0.2),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Bienvenue dans le paradis du scan
          </div>
          <h1 className="mt-5 max-w-3xl text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            Lis tes scans préférés sur <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">HeavenScans</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Mangas, manhwas, manhuas et webtoons traduits par une équipe passionnée. Nouvelles sorties chaque semaine.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/series" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 transition">
              Explorer les séries <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/latest" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-bold hover:bg-muted transition">
              Derniers chapitres
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-12 space-y-16">
        {/* Latest releases */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider"><Flame className="h-4 w-4" /> Dernières sorties</div>
              <h2 className="mt-1 text-3xl font-black">Fraîchement traduits</h2>
            </div>
            <Link to="/latest" className="text-sm font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1">Voir tout <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {latest.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {latest.map((s) => <SeriesCard key={s.slug} s={s} />)}
            </div>
          )}
        </section>

        {/* Popular */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider"><TrendingUp className="h-4 w-4" /> Tendances</div>
              <h2 className="mt-1 text-3xl font-black">Populaire cette semaine</h2>
            </div>
          </div>
          {popular.length === 0 ? (
            <EmptyState title="Le top arrive bientôt" hint="Ajoute tes premières séries pour faire monter le classement." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {popular.map((s) => <SeriesCard key={s.slug} s={s} />)}
            </div>
          )}
        </section>

        {/* Genres */}
        <section>
          <div className="mb-6">
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Parcourir</div>
            <h2 className="mt-1 text-3xl font-black">Par genre</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((g) => (
              <Link key={g} to="/genres" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                {g}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
