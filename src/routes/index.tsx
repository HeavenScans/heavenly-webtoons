import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { allGenres } from "@/lib/series";
import {
  Flame, Sparkles, TrendingUp, ArrowRight, Crown, Zap, ShieldOff, BookOpen,
  Star, Heart, Users, Languages, MessagesSquare, ChevronRight, ChevronLeft,
  Plus, Minus,
} from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CelestialHero } from "@/components/CelestialHero";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeavenScans — Paradis du Scan · Mangas, Manhwas & Webtoons VF" },
      { name: "description", content: "Plongez dans le paradis céleste du scan : mangas, manhwas, manhuas et webtoons traduits avec passion par HeavenScans." },
      { property: "og:title", content: "HeavenScans — Paradis du Scan" },
      { property: "og:description", content: "Mangas, manhwas et webtoons en VF, mises à jour quotidiennes." },
    ],
  }),
  component: Index,
});

type Mock = { slug: string; title: string; type: string; chapter: string; rating: number; genre: string; cover: string };

const mock = (n: number, seed: string): Mock[] =>
  Array.from({ length: n }).map((_, i) => ({
    slug: `${seed}-${i}`,
    title: ["Solo Awakening", "Celestial Blade", "Heaven's Path", "Divine Return", "Moonlit Saga", "Astral Knight", "Eternal Throne", "Skyborn Hero", "Phoenix Reborn", "Ascendant"][i % 10],
    type: ["Manhwa", "Manga", "Webtoon", "Manhua"][i % 4],
    chapter: String(120 - i * 3),
    rating: 4.4 + (i % 6) * 0.1,
    genre: ["Action", "Fantastique", "Aventure", "Drame"][i % 4],
    cover: `https://picsum.photos/seed/heaven-${seed}-${i}/600/900`,
  }));

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function SectionHeader({ eyebrow, title, icon: Icon, href, accent = "#6D4AFF" }: { eyebrow: string; title: string; icon: React.ComponentType<{ className?: string }>; href?: string; accent?: string }) {
  return (
    <motion.div {...fadeUp()} className="flex items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>
          <Icon className="h-4 w-4" /> {eyebrow}
        </div>
        <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link to={href} className="hidden sm:inline-flex items-center gap-1 rounded-full glass-card px-4 py-2 text-xs font-semibold text-white/80 hover:text-white">
          Voir tout <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </motion.div>
  );
}

function PremiumCard({ s, rank }: { s: Mock; rank?: number }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      className="group relative w-[180px] sm:w-[210px] flex-shrink-0 overflow-hidden rounded-3xl glass-card"
      style={{ boxShadow: "0 20px 60px -25px rgba(109,74,255,0.5)" }}
    >
      <Link to="/series" className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img src={s.cover} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/30 to-transparent" />
          {/* Glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 100%, rgba(109,74,255,0.4), transparent 70%)" }} />
          {/* Badge */}
          <div className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: "rgba(245,176,65,0.2)", color: "#F5B041", border: "1px solid rgba(245,176,65,0.4)", backdropFilter: "blur(8px)" }}>
            {s.type}
          </div>
          {/* Rank */}
          {rank != null && (
            <div className="absolute -bottom-2 -left-2 text-7xl font-black leading-none text-transparent" style={{ WebkitTextStroke: "2px rgba(245,176,65,0.8)", textShadow: "0 0 30px rgba(245,176,65,0.4)" }}>
              {rank}
            </div>
          )}
          {/* Rating */}
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full glass-card px-2 py-0.5 text-[10px] font-bold text-white">
            <Star className="h-3 w-3 fill-[#F5B041] text-[#F5B041]" /> {s.rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-sm font-bold text-white">{s.title}</h3>
          <div className="mt-1 flex items-center justify-between text-[11px] text-white/60">
            <span>Ch. {s.chapter}</span>
            <span className="text-[#4DA6FF]">{s.genre}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Carousel({ items, withRank = false }: { items: Mock[]; withRank?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4">
        {items.map((s, i) => (
          <PremiumCard key={s.slug} s={s} rank={withRank ? i + 1 : undefined} />
        ))}
      </div>
      <button onClick={() => scroll(-1)} aria-label="Précédent" className="hidden md:grid absolute -left-4 top-1/2 -translate-y-1/2 h-12 w-12 place-items-center rounded-full glass-card text-white hover:text-[#F5B041]">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => scroll(1)} aria-label="Suivant" className="hidden md:grid absolute -right-4 top-1/2 -translate-y-1/2 h-12 w-12 place-items-center rounded-full glass-card text-white hover:text-[#F5B041]">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

const features = [
  { icon: Zap, title: "Vitesse divine", text: "Nouveaux chapitres traduits et mis en ligne en un temps record." },
  { icon: ShieldOff, title: "Lecture pure", text: "Aucune pub, aucune distraction. Le scan dans sa forme la plus céleste." },
  { icon: Languages, title: "Traduction IA", text: "Traduisez n'importe quelle page dans la langue de votre choix." },
  { icon: Crown, title: "Premium exclusif", text: "Accès anticipé, chapitres bonus et soutien direct à l'équipe." },
  { icon: BookOpen, title: "180+ séries", text: "Mangas, manhwas, manhuas, webtoons — tous les univers réunis." },
  { icon: Heart, title: "Communauté passionnée", text: "Une équipe de fans qui traduit avec amour, pour les fans." },
];

const stats = [
  { k: "1 200+", v: "Chapitres traduits" },
  { k: "180+", v: "Séries VF" },
  { k: "85 000+", v: "Lecteurs actifs" },
  { k: "24/7", v: "Mises à jour" },
];

const faqs = [
  { q: "Est-ce que HeavenScans est gratuit ?", a: "Oui, la lecture est entièrement gratuite. Le Premium est optionnel et débloque l'accès anticipé, le mode sans pub et des chapitres exclusifs." },
  { q: "À quelle fréquence sortent les chapitres ?", a: "Chaque jour. Les séries phares reçoivent plusieurs chapitres par semaine." },
  { q: "Comment fonctionne la traduction IA ?", a: "Dans le lecteur, un bouton permet de traduire la page affichée à la volée vers la langue de votre choix. Une fonctionnalité réservée aux membres Premium." },
  { q: "Puis-je proposer une série à traduire ?", a: "Bien sûr, rejoignez le Discord et envoyez votre suggestion à l'équipe." },
];

function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050816" }}>
      <Header />

      <CelestialHero />

      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-20 space-y-24">
        {/* Genres */}
        <section>
          <SectionHeader eyebrow="Parcourir" title="Par genre" icon={BookOpen} accent="#4DA6FF" />
          <div className="flex flex-wrap gap-2">
            {allGenres.map((g, i) => (
              <motion.div key={g} {...fadeUp(i * 0.02)}>
                <Link to="/series" search={{ genre: g }} className="inline-block rounded-full glass-card px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:border-[#6D4AFF]/60 transition">
                  {g}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why HeavenScans */}
        <section>
          <SectionHeader eyebrow="Pourquoi nous" title="Le royaume du scan" icon={Crown} accent="#F5B041" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.06)}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl glass-card p-6"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" style={{ background: "radial-gradient(circle, rgba(109,74,255,0.5), transparent)" }} />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-celestial)", boxShadow: "0 10px 30px -10px rgba(109,74,255,0.6)" }}>
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">{f.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Community stats */}
        <section>
          <motion.div {...fadeUp()} className="relative overflow-hidden rounded-3xl glass-card-gold p-10 sm:p-14">
            <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(109,74,255,0.3), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(245,176,65,0.2), transparent 60%)" }} />
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#F5B041]">
                <Users className="h-4 w-4" /> Communauté
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">Un royaume qui ne dort jamais</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div key={s.v} {...fadeUp(i * 0.08)} className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-gradient-celestial">{s.k}</div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/60">{s.v}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Discord CTA */}
        <section>
          <motion.div {...fadeUp()} className="relative overflow-hidden rounded-3xl p-10 sm:p-14" style={{ background: "linear-gradient(135deg, #6D4AFF 0%, #4DA6FF 100%)", boxShadow: "0 40px 100px -30px rgba(109,74,255,0.8)" }}>
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4), transparent 50%)" }} />
            <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  <MessagesSquare className="h-3 w-3" /> Discord
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Rejoins la communauté céleste
                </h2>
                <p className="mt-3 text-white/85 max-w-lg">
                  Discute des derniers chapitres, propose des séries, et participe aux events exclusifs avec plus de 12 000 lecteurs.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#6D4AFF] hover:scale-[1.02] transition-transform">
                    <MessagesSquare className="h-4 w-4" /> Rejoindre Discord
                  </a>
                  <Link to="/premium" className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition">
                    <Crown className="h-4 w-4" /> Devenir Premium
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30" />
                  <div className="absolute inset-4 rounded-full bg-white/20 grid place-items-center">
                    <MessagesSquare className="h-20 w-20 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section>
          <SectionHeader eyebrow="Questions" title="Tout ce qu'il faut savoir" icon={Sparkles} accent="#4DA6FF" />
          <div className="space-y-3 max-w-3xl">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div key={f.q} {...fadeUp(i * 0.05)} className="overflow-hidden rounded-2xl glass-card">
                  <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="text-base font-bold text-white">{f.q}</span>
                    <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full" style={{ background: open ? "var(--gradient-celestial)" : "rgba(255,255,255,0.06)" }}>
                      {open ? <Minus className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-white/70 leading-relaxed">{f.a}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
