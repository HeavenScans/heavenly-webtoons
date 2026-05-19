import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { series } from "@/lib/series";
import { Star, BookOpen, Clock, Lock, Play, MessageCircle, Crown } from "lucide-react";
import { PremiumLock, PremiumBadge, ComingSoon } from "@/components/PremiumLock";
import { usePremium } from "@/hooks/usePremium";
import { useDbSeries } from "@/hooks/useDbSeries";
import { Comments } from "@/components/Comments";
import { RatingStars } from "@/components/RatingStars";

export const Route = createFileRoute("/series/$slug")({
  component: SeriesDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-black">Série introuvable</h1>
        <Link to="/series" className="mt-4 inline-block text-primary">← Retour au catalogue</Link>
      </div>
    </div>
  ),
});

function SeriesDetail() {
  const { slug } = Route.useParams();
  const { series: dbSeries, loading } = useDbSeries();
  const s = series.find((x) => x.slug === slug) ?? dbSeries.find((x) => x.slug === slug);
  if (!s && !loading) throw notFound();
  if (!s) return <div className="min-h-screen grid place-items-center text-muted-foreground">Chargement…</div>;
  const { active: isPremium } = usePremium();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: `url(${s.cover})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(40px)" }} />
        <div className="absolute inset-0 -z-10 bg-background/80" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-[240px_1fr]">
          <img src={s.cover} alt={s.title} className="w-full max-w-[240px] rounded-xl shadow-[var(--shadow-card)]" />
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="rounded bg-primary/20 px-2 py-0.5 text-primary">{s.type}</span>
              <span className="rounded bg-secondary px-2 py-0.5">{s.status}</span>
              {s.rating != null && (
                <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5"><Star className="h-3 w-3 fill-primary text-primary" />{s.rating.toFixed(1)}</span>
              )}
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-black">{s.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.genres.map((g) => <span key={g} className="rounded-full border border-border bg-card/50 px-3 py-1 text-xs">{g}</span>)}
            </div>
            <p className="mt-5 max-w-3xl text-muted-foreground">{s.synopsis}</p>
            <div className="mt-5"><RatingStars slug={s.slug} /></div>
          </div>
        </div>
      </div>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-black mb-4 inline-flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Chapitres</h2>
        {s.chapters.length === 0 ? (
          <div className="space-y-6">
            <PremiumLock cover={s.cover} />
            <ComingSoon />
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--glass-border)] rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl overflow-hidden">
            {s.chapters.map((c) => (
              <li key={c.number} className="group flex items-center justify-between gap-3 p-4 hover:bg-muted/50 transition-all hover:translate-x-1">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--glass-border)] bg-background/40 text-[color:var(--neon-blue)] group-hover:bg-[image:var(--gradient-neon)] group-hover:text-white group-hover:border-transparent transition">
                    {isPremium ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">Chapitre {c.number}</div>
                      {!isPremium && <PremiumBadge />}
                    </div>
                    {c.title ? (
                      <div className="text-sm text-muted-foreground">{c.title}</div>
                    ) : !isPremium ? (
                      <div className="text-sm text-muted-foreground">Chapitre Premium</div>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:inline-flex text-xs text-muted-foreground items-center gap-1"><Clock className="h-3 w-3" />{c.releasedAt}</div>
                  {isPremium ? (
                    <Link
                      to="/series/$slug/chapter/$number"
                      params={{ slug: s.slug, number: c.number }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-neon)] px-3 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.03] transition-transform"
                    >
                      <Play className="h-3.5 w-3.5" /> Lire
                    </Link>
                  ) : (
                    <Link
                      to="/series/$slug/chapter/$number"
                      params={{ slug: s.slug, number: c.number }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--glass-border)] bg-background/40 px-3 py-1.5 text-xs font-bold text-[color:var(--neon-blue)] hover:border-[color:var(--neon-blue)] transition"
                    >
                      <Lock className="h-3.5 w-3.5" /> Chapitre Premium
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isPremium && (
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-6 sm:p-8 shadow-[var(--shadow-neon-violet)]">
            <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_15%_20%,oklch(0.65_0.25_295/0.25),transparent_55%),radial-gradient(circle_at_85%_80%,oklch(0.75_0.18_240/0.25),transparent_55%)]" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon)]">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--glass-border)] bg-background/50 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--neon-blue)]">
                    <Crown className="h-3 w-3" /> Communauté HeavenScans
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight">Rejoins le Discord pour les annonces & sorties</h3>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    Notifications de nouveaux chapitres, sondages, sneak peeks et accès à des offres Premium exclusives.
                  </p>
                </div>
              </div>
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.03] transition-transform"
              >
                <MessageCircle className="h-4 w-4" /> Rejoindre Discord
              </a>
            </div>
          </div>
        )}
        <Comments slug={s.slug} />
      </main>
      <Footer />
    </div>
  );
}