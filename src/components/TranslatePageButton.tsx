import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Languages, Loader2, Sparkles, X, Crown, Lock } from "lucide-react";
import { translateScanPage } from "@/lib/translate.functions";
import { usePremium } from "@/hooks/usePremium";

type Lang = "fr" | "en" | "es" | "de" | "it" | "pt" | "ja";

const LANG_OPTIONS: { value: Lang; label: string; flag: string }[] = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
  { value: "pt", label: "Português", flag: "🇵🇹" },
];

export function TranslatePageButton({ imageUrl, pageIndex }: { imageUrl: string; pageIndex: number }) {
  const { tier, hydrated } = usePremium();
  const isUltimate = hydrated && tier === "ultimate";

  const translate = useServerFn(translateScanPage);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(targetLang: Lang) {
    setLoading(true);
    setError(null);
    setResult(null);
    setLang(targetLang);
    try {
      const r = await translate({ data: { imageUrl, targetLang } });
      setResult(r.translation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de la traduction.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating neon button — unique design */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Traduire cette page avec l'IA"
        className="group absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-3.5 py-2 text-xs font-bold text-white shadow-[0_8px_32px_-8px_oklch(0.65_0.25_295/0.7)] transition-all duration-300 hover:scale-105 hover:border-[color:var(--neon-violet)]/60"
      >
        {/* Animated conic ring */}
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-[1.5px]">
          <span className="block h-full w-full rounded-full bg-[conic-gradient(from_0deg,oklch(0.75_0.18_240),oklch(0.65_0.25_295),oklch(0.78_0.16_75),oklch(0.75_0.18_240))] animate-[spin_4s_linear_infinite]" />
        </span>
        <span className="relative grid h-5 w-5 place-items-center rounded-full bg-[image:var(--gradient-neon)]">
          <Languages className="h-3 w-3" />
        </span>
        <span className="relative tracking-wide">Traduire</span>
        {!isUltimate && (
          <span className="relative ml-1 inline-flex items-center gap-0.5 rounded-full bg-[color:var(--neon-violet)]/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-[color:var(--neon-violet)]">
            <Lock className="h-2.5 w-2.5" /> Ultimate
          </span>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-2xl shadow-[var(--shadow-neon)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(circle_at_20%_0%,oklch(0.75_0.18_240/0.3),transparent_55%),radial-gradient(circle_at_100%_100%,oklch(0.65_0.25_295/0.35),transparent_55%)]" />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/40 backdrop-blur text-white/70 hover:text-white hover:border-white/30 transition"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6 sm:p-7">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon)]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--neon-blue)]">
                    AI Translator · Page {pageIndex + 1}
                  </p>
                  <h3 className="text-xl font-black tracking-tight">Traduction instantanée</h3>
                </div>
              </div>

              {!isUltimate ? (
                <div className="mt-6 rounded-2xl border border-[color:var(--neon-violet)]/30 bg-[color:var(--neon-violet)]/5 p-5 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon-violet)]">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <p className="mt-4 text-sm font-bold">Fonctionnalité exclusive Ultimate</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    La traduction IA des pages est réservée aux abonnés Ultimate — passe au plan pour traduire chaque scan dans la langue de ton choix.
                  </p>
                  <Link
                    to="/premium"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-neon)] px-5 py-2.5 text-xs font-bold text-white shadow-[var(--shadow-neon)] hover:scale-[1.03] transition"
                    onClick={() => setOpen(false)}
                  >
                    <Crown className="h-3.5 w-3.5" /> Passer Ultimate
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mt-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Langue cible
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {LANG_OPTIONS.map((opt) => {
                        const active = lang === opt.value;
                        return (
                          <button
                            key={opt.value}
                            disabled={loading}
                            onClick={() => run(opt.value)}
                            className={
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 " +
                              (active
                                ? "border-transparent bg-[image:var(--gradient-neon)] text-white shadow-[var(--shadow-neon)]"
                                : "border-[color:var(--glass-border)] bg-background/40 hover:border-[color:var(--neon-blue)]/50")
                            }
                          >
                            <span>{opt.flag}</span> {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 min-h-[140px] rounded-2xl border border-[color:var(--glass-border)] bg-background/40 p-4 text-sm">
                    {loading && (
                      <div className="flex h-full items-center justify-center gap-2 py-8 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-[color:var(--neon-blue)]" />
                        <span>Lecture des bulles et traduction…</span>
                      </div>
                    )}
                    {!loading && error && (
                      <p className="text-destructive">{error}</p>
                    )}
                    {!loading && !error && !result && (
                      <p className="text-muted-foreground">
                        Choisis une langue ci-dessus pour lancer la traduction IA de cette page.
                      </p>
                    )}
                    {!loading && result && (
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed text-foreground/90">
                        {result}
                      </pre>
                    )}
                  </div>

                  <p className="mt-3 text-[10px] text-muted-foreground/70 text-center">
                    Propulsé par Lovable AI · Les traductions sont générées automatiquement et peuvent contenir des imprécisions.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}