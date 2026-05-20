import { Check, Crown, Zap, Star, Sparkles } from "lucide-react";
import { usePremium, type PremiumTier } from "@/hooks/usePremium";

const tiers = [
  {
    name: "Reader",
    price: "0",
    period: "Gratuit",
    icon: Star,
    accent: "var(--muted-foreground)",
    features: [
      "Catalogue complet en accès libre",
      "Lecture en ligne standard",
      "Favoris et historique synchronisés",
      "Support communautaire Discord",
    ],
    cta: "Commencer",
    highlight: false,
    tier: null as PremiumTier | null,
  },
  {
    name: "Premium",
    price: "4,99",
    period: "/ mois",
    icon: Crown,
    accent: "var(--neon-blue)",
    features: [
      "Accès anticipé 48 h aux chapitres",
      "Lecture 100 % sans publicité",
      "Qualité d'image HD améliorée",
      "Chapitres exclusifs Premium",
      "Badge Premium sur Discord",
      "Annulable à tout moment",
    ],
    cta: "Devenir Premium",
    highlight: true,
    tier: "premium" as PremiumTier | null,
  },
  {
    name: "Ultimate",
    price: "8",
    period: "/ mois",
    icon: Zap,
    accent: "var(--neon-violet)",
    features: [
      "Tout le Premium inclus",
      "Accès ultra-anticipé 7 jours",
      "Téléchargement hors-ligne illimité",
      "Lecture 4K & mode cinéma",
      "Avant-premières & artbooks exclusifs",
      "Vote sur les prochaines séries traduites",
      "Salon Discord VIP avec l'équipe",
      "Badge animé Ultimate",
    ],
    cta: "Passer Ultimate",
    highlight: false,
    tier: "ultimate" as PremiumTier | null,
  },
];

export function PricingCards() {
  const { active, tier, activate, deactivate, hydrated } = usePremium();
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((t) => {
        const Icon = t.icon;
        const isCurrent = hydrated && active && t.tier === tier;
        const isFreeWhilePremium = hydrated && active && t.tier === null;
        return (
          <div
            key={t.name}
            className={
              "group relative overflow-hidden rounded-3xl border bg-[color:var(--glass-bg)] backdrop-blur-xl p-7 transition-all duration-300 hover:-translate-y-1.5 " +
              (t.highlight
                ? "border-[color:var(--neon-blue)]/40 shadow-[var(--shadow-neon)]"
                : "border-[color:var(--glass-border)] hover:border-[color:var(--neon-violet)]/40 hover:shadow-[var(--shadow-neon-violet)]")
            }
          >
            {/* Glow */}
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
              style={{ background: `var(--gradient-neon)` }}
            />
            {t.highlight && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-[image:var(--gradient-neon)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                Populaire
              </div>
            )}
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl"
              style={{
                background: t.highlight ? "var(--gradient-neon)" : "var(--card)",
                boxShadow: t.highlight ? "var(--shadow-neon-violet)" : "none",
                border: t.highlight ? "none" : "1px solid var(--glass-border)",
              }}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="mt-5 text-2xl font-black tracking-tight">{t.name}</h3>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-4xl font-black bg-[image:var(--gradient-neon)] bg-clip-text text-transparent">
                {t.price === "0" ? "0€" : `${t.price}€`}
              </span>
              <span className="text-sm text-muted-foreground">{t.period}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full"
                    style={{
                      background: t.highlight ? "var(--gradient-neon)" : "var(--secondary)",
                    }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                if (t.tier === null) {
                  if (active) deactivate();
                } else {
                  activate(t.tier);
                }
              }}
              disabled={isCurrent}
              className={
                "mt-7 w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 disabled:opacity-80 disabled:cursor-default " +
                (t.highlight
                  ? "bg-[image:var(--gradient-neon)] text-white shadow-[var(--shadow-neon)] hover:scale-[1.02]"
                  : "border border-[color:var(--glass-border)] bg-background/40 hover:border-[color:var(--neon-violet)] hover:text-[color:var(--neon-violet)]")
              }
            >
              {isCurrent
                ? "✓ Abonnement actif"
                : isFreeWhilePremium
                  ? "Désactiver Premium"
                  : t.cta}
            </button>
          </div>
        );
      })}
    </div>
  );
}