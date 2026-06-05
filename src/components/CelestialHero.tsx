import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Crown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setY(window.scrollY);
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

export function CelestialHero() {
  const y = useScrollY();
  const ref = useRef<HTMLElement>(null);

  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 6,
        duration: 2 + Math.random() * 4,
      })),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        hue: Math.random() > 0.5 ? "var(--neon-blue)" : "var(--neon-violet)",
      })),
    []
  );

  const parallax = Math.min(y, 600);

  return (
    <section
      ref={ref}
      className="celestial-hero relative isolate overflow-hidden border-b border-border"
    >
      {/* Deep space base */}
      <div className="absolute inset-0 -z-50 bg-[radial-gradient(ellipse_at_top,oklch(0.22_0.06_280)_0%,oklch(0.10_0.03_270)_55%,oklch(0.06_0.02_270)_100%)]" />

      {/* Nebula clouds */}
      <div
        className="absolute inset-0 -z-40 opacity-80 nebula"
        style={{ transform: `translate3d(0,${parallax * 0.15}px,0)` }}
      />

      {/* Light rays */}
      <div
        className="absolute inset-x-0 top-0 -z-30 h-[120%] light-rays"
        style={{ transform: `translate3d(0,${parallax * 0.05}px,0)` }}
      />

      {/* Stars */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, ${p.hue} 0%, transparent 70%)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Aurora glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none [background:radial-gradient(60%_50%_at_50%_30%,oklch(0.75_0.18_240/0.25),transparent_70%),radial-gradient(40%_40%_at_80%_70%,oklch(0.65_0.25_295/0.25),transparent_70%)]" />

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-20 sm:pb-28"
        style={{
          transform: `translate3d(0,${parallax * -0.08}px,0)`,
          opacity: Math.max(0, 1 - parallax / 700),
        }}
      >
        {/* Floating glowing logo */}
        <div className="flex justify-center">
          <div className="logo-float relative">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-80 bg-[radial-gradient(circle,oklch(0.75_0.18_240/0.7),transparent_70%)]" />
            <h2 className="select-none text-center font-black tracking-tight text-5xl sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-[linear-gradient(135deg,#fff_0%,oklch(0.85_0.12_240)_45%,oklch(0.75_0.22_295)_100%)] drop-shadow-[0_0_30px_oklch(0.75_0.18_240/0.6)]">
              HeavenScans
            </h2>
          </div>
        </div>

        <div className="mt-10 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 shadow-[0_0_30px_oklch(0.75_0.18_240/0.25)]">
            <Sparkles className="h-3 w-3 text-[color:var(--neon-blue)]" />
            Bienvenue dans le paradis du scan
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Plonge dans un univers{" "}
            <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,oklch(0.85_0.16_240),oklch(0.7_0.25_295),oklch(0.85_0.18_75))]">
              céleste
            </span>{" "}
            de scans
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl mx-auto">
            Mangas, manhwas, manhuas et webtoons traduits par une équipe passionnée. Nouvelles sorties chaque semaine.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/series"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white bg-[linear-gradient(135deg,oklch(0.55_0.22_260),oklch(0.55_0.25_300))] shadow-[0_10px_40px_-10px_oklch(0.65_0.25_295/0.8),0_0_0_1px_oklch(0.75_0.18_240/0.3)_inset] hover:scale-[1.03] transition-transform"
            >
              <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,oklch(0.85_0.18_240/0.4),transparent)] opacity-0 group-hover:opacity-100 transition" />
              Explorer les séries <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/premium"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl px-6 py-3 text-sm font-bold text-white hover:bg-white/10 hover:border-white/30 transition"
            >
              <Crown className="h-4 w-4 text-[color:var(--primary)]" /> Devenir Premium
            </Link>
          </div>
        </div>

        {/* Glass orbital card */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_30px_120px_-30px_oklch(0.65_0.25_295/0.5)]">
            <div className="pointer-events-none absolute inset-0 rounded-3xl [background:radial-gradient(60%_80%_at_20%_0%,oklch(0.75_0.18_240/0.15),transparent_70%),radial-gradient(60%_80%_at_100%_100%,oklch(0.65_0.25_295/0.15),transparent_70%)]" />
            <div className="grid grid-cols-3 gap-4 sm:gap-8 relative">
              {[
                { k: "1 200+", v: "Chapitres" },
                { k: "180+", v: "Séries VF" },
                { k: "24/7", v: "Mises à jour" },
              ].map((s) => (
                <div key={s.v} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-[linear-gradient(135deg,#fff,oklch(0.75_0.18_240))]">
                    {s.k}
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/60">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_bottom,transparent,var(--background))]" />
    </section>
  );
}