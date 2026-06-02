import { Check, Crown, Rocket, Sparkles, Infinity as InfinityIcon } from "lucide-react";
import { usePremium, type PremiumTier } from "@/hooks/usePremium";

type Tier = {
  name: string;
  tagline: string;
  price: string;
  period: string;
  icon: typeof Crown;
  badge?: string;
  features: string[];
  cta: string;
  highlight: boolean;
  tier: PremiumTier | null;
};

const tiers: Tier[] = [
  {
    name: "Reader",
    tagline: "Pour découvrir l'univers HeavenScans.",
    price: "0",
    period: "Gratuit, pour toujours",
    icon: Sparkles,
    features: [
      "Catalogue complet en accès libre",
      "Lecture en ligne standard",
      "Favoris & historique synchronisés",
      "Communauté Discord",
    ],
    cta: "Commencer gratuitement",
    highlight: false,
    tier: null,
  },
  {
    name: "Premium",
    tagline: "L'expérience de lecture sans compromis.",
    price: "7",
    period: "/ mois",
    icon: Crown,
    badge: "Le plus populaire",
    features: [
      "Accès anticipé 48 h aux nouveaux chapitres",
      "Lecture 100 % sans publicité",
      "Qualité d'image HD améliorée",
      "Badge Premium sur Discord",
    ],
    cta: "Devenir Premium",
    highlight: true,
    tier: "premium",
  },
  {
    name: "Ultimate",
    tagline: "Tout. Plus tôt. Sans aucune limite.",
    price: "14",
    period: "/ mois",
    icon: Rocket,
    badge: "Meilleure valeur",
    features: [
      "Accès ultra-anticipé 7 jours",
      "Téléchargement hors-ligne illimité",
      "Traduction IA des pages (7 langues)",
      "Salon Discord VIP avec l'équipe",
    ],
    cta: "Passer Ultimate",
    highlight: false,
    tier: "ultimate",
  },
];

export function PricingCards() {
  const { active, tier, activate, deactivate, hydrated } = usePremium();
  return (
    <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
      {tiers.map((t) => {
        const Icon = t.icon;
        const isCurrent = hydrated && active && t.tier === tier;
        const isFreeWhilePremium = hydrated && active && t.tier === null;
        const isUltimate = t.tier === "ultimate";
        return (
          <div
            key={t.name}
            className={
              "group relative flex flex-col overflow-hidden rounded-3xl border bg-[color:var(--glass-bg)] backdrop-blur-xl p-7 transition-all duration-500 hover:-translate-y-2 " +
              (t.highlight
                ? "md:scale-[1.04] border-transparent shadow-[var(--shadow-neon)] ring-1 ring-[color:var(--neon-blue)]/40"
                : isUltimate
                  ? "border-[color:var(--neon-violet)]/30 hover:border-[color:var(--neon-violet)]/60 hover:shadow-[var(--shadow-neon-violet)]"
                  : "border-[color:var(--glass-border)] hover:border-foreground/30")
            }
          >
            {/* Animated gradient border for highlight */}
            {t.highlight && (
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px">
                <div className="h-full w-full rounded-3xl bg-[conic-gradient(from_0deg,oklch(0.75_0.18_240),oklch(0.65_0.25_295),oklch(0.78_0.16_75),oklch(0.75_0.18_240))] animate-[spin_8s_linear_infinite]" />
              </div>
            )}
            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              style={{
                background: isUltimate
                  ? "radial-gradient(circle, oklch(0.65 0.25 295) 0%, transparent 70%)"
                  : "var(--gradient-neon)",
              }}
            />

            {t.badge && (
              <div
                className={
                  "absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] " +
                  (t.highlight
                    ? "bg-[image:var(--gradient-neon)] text-white shadow-[var(--shadow-neon-violet)]"
                    : "border border-[color:var(--neon-violet)]/40 bg-background/60 text-[color:var(--neon-violet)] backdrop-blur")
                }
              >
                {t.highlight && <Sparkles className="h-2.5 w-2.5" />}
                {t.badge}
              </div>
            )}

            <div className="relative">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl"
                style={{
                  background: t.highlight
                    ? "var(--gradient-neon)"
                    : isUltimate
                      ? "linear-gradient(135deg, oklch(0.65 0.25 295), oklch(0.45 0.18 295))"
                      : "var(--card)",
                  boxShadow: t.highlight
                    ? "var(--shadow-neon-violet)"
                    : isUltimate
                      ? "0 0 24px -8px oklch(0.65 0.25 295 / 0.6)"
                      : "none",
                  border: t.highlight || isUltimate ? "none" : "1px solid var(--glass-border)",
                }}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-5 text-3xl font-black tracking-tight">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground min-h-[2.5rem]">{t.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1.5 border-b border-[color:var(--glass-border)] pb-5">
                <span
                  className={
                    "text-5xl font-black tracking-tight " +
                    (t.highlight || isUltimate
                      ? "bg-[image:var(--gradient-neon)] bg-clip-text text-transparent"
                      : "text-foreground")
                  }
                >
                  {t.price === "0" ? "0€" : `${t.price}€`}
                </span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
            </div>

            <ul className="relative mt-6 space-y-3 text-sm flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full ring-1 ring-inset ring-white/10"
                    style={{
                      background: t.highlight
                        ? "var(--gradient-neon)"
                        : isUltimate
                          ? "oklch(0.65 0.25 295 / 0.25)"
                          : "var(--secondary)",
                    }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-foreground/85">{f}</span>
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
                "relative mt-7 w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-300 disabled:opacity-80 disabled:cursor-default " +
                (t.highlight
                  ? "bg-[image:var(--gradient-neon)] text-white shadow-[var(--shadow-neon)] hover:scale-[1.02]"
                  : isUltimate
                    ? "border border-[color:var(--neon-violet)]/40 bg-[color:var(--neon-violet)]/10 text-[color:var(--neon-violet)] hover:bg-[color:var(--neon-violet)]/20 hover:scale-[1.02]"
                    : "border border-[color:var(--glass-border)] bg-background/40 hover:border-foreground/40")
              }
            >
              {isCurrent
                ? "✓ Abonnement actif"
                : isFreeWhilePremium
                  ? "Désactiver Premium"
                  : t.cta}
            </button>

            {isUltimate && (
              <p className="relative mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <InfinityIcon className="h-3 w-3" /> Inclut tous les bonus à venir
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}