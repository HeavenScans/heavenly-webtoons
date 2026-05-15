import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeriesCard } from "@/components/SeriesCard";
import { EmptyState } from "@/components/EmptyState";
import { series, allGenres } from "@/lib/series";
import { Flame, Sparkles, TrendingUp, ArrowRight, Crown, Zap, ShieldOff, BookOpen } from "lucide-react";
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

        {/* Premium teaser */}
        <section className="relative overflow-hidden rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-8 sm:p-12">
          <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_15%_20%,oklch(0.75_0.18_240/0.3),transparent_55%),radial-gradient(circle_at_85%_80%,oklch(0.65_0.25_295/0.3),transparent_55%)]" />
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-background/50 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--neon-blue)]">
                <Crown className="h-3 w-3" /> HeavenScans Premium
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
                Lecture <span className="bg-[image:var(--gradient-neon)] bg-clip-text text-transparent">sans limite</span>, sans pub.
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Accès anticipé, chapitres exclusifs et soutien direct à l'équipe de traduction.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/premium" className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.02] transition">
                  <Crown className="h-4 w-4" /> Devenir Premium
                </Link>
                <Link to="/premium" className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-background/40 backdrop-blur px-5 py-3 text-sm font-bold hover:border-[color:var(--neon-violet)] hover:text-[color:var(--neon-violet)] transition">
                  Voir les avantages
                </Link>
              </div>
            </div>
            <ul className="grid gap-3">
              {[
                { Icon: Zap, t: "Accès anticipé aux chapitres" },
                { Icon: ShieldOff, t: "Lecture sans publicité" },
                { Icon: BookOpen, t: "Chapitres exclusifs Premium" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-3 rounded-xl border border-[color:var(--glass-border)] bg-background/40 backdrop-blur px-4 py-3 transition hover:translate-x-1 hover:border-[color:var(--neon-blue)]/40">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon-violet)]">
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-sm font-semibold">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
