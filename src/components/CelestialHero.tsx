import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Flame } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

export function CelestialHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const portalY = useTransform(scrollY, [0, 800], [0, 200]);
  const portalScale = useTransform(scrollY, [0, 800], [1, 1.3]);
  const contentY = useTransform(scrollY, [0, 800], [0, -120]);
  const contentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const cloudsY = useTransform(scrollY, [0, 800], [0, -80]);

  const stars = useMemo(
    () =>
      Array.from({ length: 140 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.4,
        delay: Math.random() * 6,
        duration: 2 + Math.random() * 4,
      })),
    []
  );

  const goldSparks = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 50 + Math.random() * 50,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 6,
      })),
    []
  );

  return (
    <section
      ref={ref}
      className="celestial-hero relative isolate overflow-hidden min-h-screen flex items-center"
      style={{ background: "#050816" }}
    >
      {/* Deep space base + nebula */}
      <div
        className="absolute inset-0 -z-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(109,74,255,0.35) 0%, rgba(5,8,22,1) 60%), radial-gradient(ellipse at 20% 80%, rgba(77,166,255,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(245,176,65,0.12) 0%, transparent 50%), #050816",
        }}
      />

      {/* Nebula drift layer */}
      <div className="absolute inset-0 -z-40 nebula opacity-70" />

      {/* Stars */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
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

      {/* Light rays */}
      <div className="absolute inset-x-0 top-0 -z-30 h-[120%] light-rays ray-sweep" />

      {/* Heavenly portal */}
      <motion.div
        style={{ y: portalY, scale: portalScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-[80vmin] w-[80vmin]">
          {/* Outer glow */}
          <div className="portal-core absolute inset-0 rounded-full" style={{ background: "var(--gradient-portal)" }} />
          {/* Rotating ring */}
          <div
            className="portal-ring absolute inset-[8%] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(245,176,65,0.6) 60deg, transparent 120deg, rgba(77,166,255,0.6) 180deg, transparent 240deg, rgba(109,74,255,0.6) 300deg, transparent 360deg)",
              mask: "radial-gradient(circle, transparent 60%, #000 62%, #000 72%, transparent 74%)",
              WebkitMask: "radial-gradient(circle, transparent 60%, #000 62%, #000 72%, transparent 74%)",
            }}
          />
          {/* Reverse ring */}
          <div
            className="portal-ring-rev absolute inset-[18%] rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg, transparent 0deg, rgba(255,255,255,0.4) 40deg, transparent 80deg, rgba(245,176,65,0.5) 200deg, transparent 240deg)",
              mask: "radial-gradient(circle, transparent 55%, #000 57%, #000 64%, transparent 66%)",
              WebkitMask: "radial-gradient(circle, transparent 55%, #000 57%, #000 64%, transparent 66%)",
            }}
          />
          {/* Center glow */}
          <div
            className="absolute inset-[30%] rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(245,176,65,0.7), rgba(109,74,255,0.3) 60%, transparent)" }}
          />
        </div>
      </motion.div>

      {/* Floating islands silhouettes */}
      <motion.div style={{ y: cloudsY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="island-bob absolute left-[6%] top-[28%] h-24 w-40 rounded-[60%_40%_60%_40%/40%_60%_50%_50%] opacity-40 blur-sm" style={{ background: "linear-gradient(180deg, rgba(109,74,255,0.5), rgba(5,8,22,0.9))" }} />
        <div className="island-bob absolute right-[8%] top-[20%] h-20 w-32 rounded-[55%_45%_55%_45%/45%_55%_45%_55%] opacity-50 blur-sm" style={{ background: "linear-gradient(180deg, rgba(77,166,255,0.5), rgba(5,8,22,0.9))", animationDelay: "2s" }} />
        <div className="island-bob absolute left-[15%] bottom-[18%] h-28 w-44 rounded-[60%_40%_50%_50%/50%_60%_40%_50%] opacity-35 blur-sm" style={{ background: "linear-gradient(180deg, rgba(245,176,65,0.4), rgba(5,8,22,0.95))", animationDelay: "4s" }} />
        <div className="island-bob absolute right-[14%] bottom-[22%] h-24 w-36 rounded-[50%_50%_60%_40%/60%_40%_55%_45%] opacity-40 blur-sm" style={{ background: "linear-gradient(180deg, rgba(109,74,255,0.45), rgba(5,8,22,0.9))", animationDelay: "1s" }} />
      </motion.div>

      {/* Drifting clouds */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="cloud-drift absolute top-[40%] h-32 w-[60%] rounded-full opacity-25 blur-2xl" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", animationDuration: "60s" }} />
        <div className="cloud-drift absolute top-[65%] h-24 w-[50%] rounded-full opacity-15 blur-2xl" style={{ background: "linear-gradient(90deg, transparent, rgba(77,166,255,0.5), transparent)", animationDuration: "90s", animationDelay: "-30s" }} />
      </div>

      {/* Gold sparks */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {goldSparks.map((s) => (
          <span
            key={s.id}
            className="gold-spark absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: "radial-gradient(circle, #F5B041, transparent 70%)",
              boxShadow: "0 0 12px #F5B041",
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Foreground content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 pt-28 pb-16 sm:py-32 text-center"
      >
        {/* Emblem */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="logo-float mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background: "var(--gradient-celestial)",
            boxShadow: "0 0 60px rgba(245,176,65,0.6), 0 0 120px rgba(109,74,255,0.5), inset 0 0 30px rgba(255,255,255,0.3)",
          }}
        >
          <Sparkles className="h-10 w-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full glass-card-gold px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F5B041]"
        >
          <Sparkles className="h-3 w-3" /> HeavenScans · Édition Céleste
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02]"
        >
          <span className="text-white">Bienvenue au </span>
          <span className="text-gradient-celestial">Paradis du Scan</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70"
        >
          Découvrez les meilleurs mangas, manhwas et webtoons traduits avec passion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/series"
            className="group relative inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-bold text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #6D4AFF 0%, #4DA6FF 100%)",
              boxShadow: "0 20px 60px -15px rgba(109,74,255,0.8), 0 0 0 1px rgba(255,255,255,0.1) inset",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            Explorer les séries <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/latest"
            className="inline-flex items-center gap-2 rounded-2xl glass-card px-7 py-4 text-sm font-bold text-white hover:border-white/30 transition"
          >
            <Flame className="h-4 w-4 text-[#F5B041]" /> Dernières sorties
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom fade into page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,#050816)]" />
    </section>
  );
}