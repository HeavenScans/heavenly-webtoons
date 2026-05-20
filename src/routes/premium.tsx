import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import {
  Crown,
  Zap,
  BookOpen,
  ShieldOff,
  Sparkles,
  MessageCircle,
  Download,
  Star,
  Headphones,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — HeavenScans" },
      { name: "description", content: "Accès anticipé, lecture sans publicité et chapitres exclusifs avec HeavenScans Premium." },
    ],
  }),
  component: PremiumPage,
});

const perks = [
  { icon: Zap, title: "Accès anticipé", desc: "Lis les nouveaux chapitres jusqu'à 7 jours avant tout le monde." },
  { icon: ShieldOff, title: "Zéro publicité", desc: "Une lecture cinématographique, sans aucune interruption." },
  { icon: BookOpen, title: "Contenus exclusifs", desc: "Oneshots, bonus et artbooks réservés aux abonnés." },
  { icon: Download, title: "Hors-ligne illimité", desc: "Télécharge tes chapitres pour les lire partout, sans data." },
  { icon: Star, title: "Qualité 4K", desc: "Images sublimées en haute définition et mode cinéma immersif." },
  { icon: Heart, title: "Soutiens l'équipe", desc: "Chaque abonnement finance directement les traducteurs." },
];

const faqs = [
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui. L'annulation est immédiate depuis ton profil, sans frais ni justification. Tu gardes l'accès jusqu'à la fin de la période payée.",
  },
  {
    q: "Quelle est la différence entre Premium et Ultimate ?",
    a: "Premium te donne 48 h d'avance et zéro publicité. Ultimate te donne 7 jours d'avance, le téléchargement hors-ligne, la 4K, les artbooks et un salon Discord VIP.",
  },
  {
    q: "Mes données et favoris sont-ils conservés ?",
    a: "Oui, tout ton historique, tes favoris et ta progression sont synchronisés, même si tu changes d'abonnement.",
  },
  {
    q: "Comment mon abonnement aide l'équipe ?",
    a: "100 % des revenus servent à payer les traducteurs, les correcteurs et les serveurs. Pas d'actionnaire, pas de pub. Juste du scantrad passionné.",
  },
];

const testimonials = [
  {
    name: "Aiko",
    role: "Membre Premium depuis 8 mois",
    quote:
      "L'accès anticipé a changé ma vie de lectrice. Plus jamais je ne reviendrai en arrière.",
  },
  {
    name: "Kenji",
    role: "Ultimate",
    quote:
      "La 4K + le mode cinéma, c'est comme regarder un film. Le téléchargement hors-ligne dans le métro est parfait.",
  },
  {
    name: "Lila",
    role: "Premium",
    quote:
      "Zéro pub, lecture fluide, communauté géniale. Le prix d'un café par mois pour soutenir le scantrad, sans hésiter.",
  },
];

function PremiumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="relative flex-1 overflow-hidden">
        {/* Cinematic hero */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Aurora */}
          <div className="absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_top,oklch(0.75_0.18_240/0.4),transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.65_0.25_295/0.45),transparent_55%),radial-gradient(circle_at_20%_80%,oklch(0.78_0.16_75/0.25),transparent_50%)]" />
          {/* Grid */}
          <div className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(oklch(0.75_0.18_240)_1px,transparent_1px),linear-gradient(90deg,oklch(0.75_0.18_240)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
          {/* Floating orbs */}
          <div className="pointer-events-none absolute top-20 left-10 h-72 w-72 rounded-full bg-[color:var(--neon-blue)]/20 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-[color:var(--neon-violet)]/25 blur-3xl animate-pulse [animation-delay:1s]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-32 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-blue)]/30 bg-[color:var(--glass-bg)] backdrop-blur px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[color:var(--neon-blue)]">
              <Sparkles className="h-3 w-3" /> HeavenScans Premium
            </div>
            <h1 className="mx-auto mt-7 max-w-4xl text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95]">
              Lis comme{" "}
              <span className="relative inline-block">
                <span className="bg-[image:var(--gradient-cyber)] bg-clip-text text-transparent">
                  jamais
                </span>
                <span className="absolute -inset-2 -z-10 bg-[image:var(--gradient-cyber)] opacity-20 blur-2xl" />
              </span>{" "}
              auparavant.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl text-muted-foreground">
              Accès anticipé, qualité 4K, téléchargement hors-ligne. L'expérience manga ultime, sans publicité.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#tarifs"
                className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.03] transition"
              >
                <Crown className="h-4 w-4 transition-transform group-hover:rotate-12" /> Voir les offres
              </a>
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur px-7 py-3.5 text-sm font-bold hover:border-[color:var(--neon-violet)] hover:text-[color:var(--neon-violet)] transition"
              >
                <MessageCircle className="h-4 w-4" /> Rejoindre Discord
              </a>
            </div>
            {/* Trust strip */}
            <div className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldOff className="h-3.5 w-3.5" /> Sans engagement</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Activation instantanée</span>
              <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" /> Soutient l'équipe</span>
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--neon-violet)]">Pourquoi Premium</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
              Tout ce que tu aimes,{" "}
              <span className="bg-[image:var(--gradient-neon)] bg-clip-text text-transparent">élevé.</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="group relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--neon-blue)]/50"
                >
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                    style={{ background: "var(--gradient-neon)" }}
                  />
                  <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon-violet)]">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="relative mt-4 text-lg font-black">{p.title}</h3>
                  <p className="relative mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                  <span className="absolute bottom-3 right-4 text-[10px] font-black tracking-widest text-muted-foreground/30">
                    0{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section
          id="tarifs"
          className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 py-20 scroll-mt-20"
        >
          <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_center,oklch(0.65_0.25_295/0.15),transparent_70%)]" />
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--neon-blue)]">Tarifs simples</p>
            <h2 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight">Choisis ton accès</h2>
            <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
              Sans engagement. Annule en un clic. Le prix d'un café pour soutenir un scantrad indépendant.
            </p>
          </div>
          <PricingCards />
        </section>

        {/* Testimonials */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--neon-violet)]">Communauté</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">Adopté par nos lecteurs</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-6 transition hover:border-[color:var(--neon-blue)]/40"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[color:var(--primary)] text-[color:var(--primary)]" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-neon)] text-xs font-black text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--neon-blue)]">FAQ</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-5 open:border-[color:var(--neon-blue)]/40 transition"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-bold list-none">
                  {f.q}
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-[color:var(--glass-border)] text-lg leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--neon-blue)]/30 bg-[color:var(--glass-bg)] backdrop-blur-xl p-10 sm:p-16 text-center">
            <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_30%_30%,oklch(0.75_0.18_240/0.3),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.65_0.25_295/0.3),transparent_60%)]" />
            <Headphones className="mx-auto h-10 w-10 text-[color:var(--neon-blue)]" />
            <h2 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight">
              Prêt à passer au niveau supérieur ?
            </h2>
            <p className="mt-3 max-w-lg mx-auto text-muted-foreground">
              Rejoins les milliers de lecteurs qui ont déjà choisi l'expérience Premium.
            </p>
            <a
              href="#tarifs"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-8 py-4 text-sm font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.03] transition"
            >
              <Crown className="h-4 w-4" /> Commencer maintenant
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}