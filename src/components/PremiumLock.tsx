import { Link } from "@tanstack/react-router";
import { Lock, Crown, MessageCircle, Sparkles } from "lucide-react";

export function PremiumLock({
  title = "Chapitre Premium",
  subtitle = "Ce chapitre est réservé aux membres Premium. Débloque l'accès anticipé et la lecture sans publicité.",
  cover,
}: {
  title?: string;
  subtitle?: string;
  cover?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl shadow-[var(--shadow-neon)]">
      {/* Blurred manga preview */}
      <div className="absolute inset-0 -z-10">
        {cover ? (
          <img src={cover} alt="" className="h-full w-full object-cover scale-110 blur-2xl opacity-30" />
        ) : (
          <div className="h-full w-full bg-[image:var(--gradient-cyber)] opacity-20" />
        )}
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_20%,oklch(0.75_0.18_240/0.25),transparent_60%),radial-gradient(circle_at_70%_80%,oklch(0.65_0.25_295/0.25),transparent_60%)]" />
      </div>

      {/* Faux page previews — blurred */}
      <div className="relative grid grid-cols-3 gap-3 p-6 sm:p-10 select-none pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-xl border border-white/5 bg-[image:var(--gradient-card)] blur-[6px] opacity-50 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>

      {/* Lock overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-background/60 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--neon-blue)]">
          <Sparkles className="h-3 w-3" /> HeavenScans Premium
        </div>
        <div className="mt-5 grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon-violet)]">
          <Lock className="h-7 w-7 text-white" />
        </div>
        <h3 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button className="group relative inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-neon)] transition-transform hover:-translate-y-0.5 hover:scale-[1.02]">
            <Lock className="h-4 w-4" /> Déverrouiller le chapitre
          </button>
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-background/50 backdrop-blur px-5 py-3 text-sm font-bold hover:border-[color:var(--neon-blue)] hover:text-[color:var(--neon-blue)] transition"
          >
            <Crown className="h-4 w-4" /> Devenir Premium
          </Link>
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-background/50 backdrop-blur px-5 py-3 text-sm font-bold hover:border-[color:var(--neon-violet)] hover:text-[color:var(--neon-violet)] transition"
          >
            <MessageCircle className="h-4 w-4" /> Rejoindre Discord
          </a>
        </div>
      </div>
    </div>
  );
}

export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--neon-blue)] shadow-[var(--shadow-neon-violet)] " +
        className
      }
    >
      <Crown className="h-3 w-3" /> Premium
    </span>
  );
}

export function ComingSoon({
  message = "Nouveaux chapitres bientôt disponibles",
}: {
  message?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-8 text-center">
      <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_50%_0%,oklch(0.75_0.18_240/0.2),transparent_70%)]" />
      <div className="mx-auto flex h-12 w-12 items-center justify-center">
        <span className="relative flex h-12 w-12">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--neon-blue)] opacity-30" />
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon)]">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
        </span>
      </div>
      <p className="mt-4 text-base font-bold tracking-wide">{message}</p>
      <div className="mt-4 flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon-blue)] animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}