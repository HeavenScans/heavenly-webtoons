import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { Crown, Zap, BookOpen, ShieldOff, Sparkles, MessageCircle } from "lucide-react";

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
  { icon: Zap, title: "Accès anticipé", desc: "Lis les nouveaux chapitres avant tout le monde, dès leur traduction." },
  { icon: ShieldOff, title: "Lecture sans publicité", desc: "Une expérience cinématographique, sans interruption ni bannière." },
  { icon: BookOpen, title: "Chapitres exclusifs", desc: "Des séries et bonus réservés à la communauté Premium." },
];

function PremiumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="relative flex-1 overflow-hidden">
        {/* Cinematic hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_20%_10%,oklch(0.75_0.18_240/0.35),transparent_55%),radial-gradient(circle_at_85%_70%,oklch(0.65_0.25_295/0.35),transparent_55%)]" />
          <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(oklch(0.75_0.18_240)_1px,transparent_1px),linear-gradient(90deg,oklch(0.75_0.18_240)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--neon-blue)]">
              <Sparkles className="h-3 w-3" /> HeavenScans Premium
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
              Une expérience{" "}
              <span className="bg-[image:var(--gradient-neon)] bg-clip-text text-transparent">
                cinématographique
              </span>{" "}
              du manga.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Soutiens l'équipe, débloque l'accès anticipé et plonge dans une lecture pure, sans publicité.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#tarifs" className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.02] transition">
                <Crown className="h-4 w-4" /> Devenir Premium
              </a>
              <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur px-6 py-3 text-sm font-bold hover:border-[color:var(--neon-violet)] hover:text-[color:var(--neon-violet)] transition">
                <MessageCircle className="h-4 w-4" /> Rejoindre Discord
              </a>
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="group relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-6 transition-all hover:-translate-y-1 hover:border-[color:var(--neon-blue)]/40 hover:shadow-[var(--shadow-neon-violet)]">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon-violet)]">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-xl font-black">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section id="tarifs" className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-24">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--neon-blue)]">Tarifs</p>
            <h2 className="mt-2 text-4xl sm:text-5xl font-black">Choisis ton accès</h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">Sans engagement. Annule quand tu veux. Soutiens un scantrad passionné.</p>
          </div>
          <PricingCards />
        </section>
      </main>
      <Footer />
    </div>
  );
}