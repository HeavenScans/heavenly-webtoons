import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Languages, Loader2, Sparkles, X, Crown, Coins, Zap } from "lucide-react";
import { translateScanPage } from "@/lib/translate.functions";
import { usePremium } from "@/hooks/usePremium";
import {
  useTranslationCredits,
  TRANSLATION_PACKS,
  type TranslationPackId,
} from "@/hooks/useTranslationCredits";

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
  const { credits, buyPack, consume } = useTranslationCredits();
  const canTranslate = isUltimate || credits > 0;

  const translate = useServerFn(translateScanPage);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justPurchased, setJustPurchased] = useState<TranslationPackId | null>(null);

  async function run(targetLang: Lang) {
    if (!isUltimate) {
      const ok = consume();
      if (!ok) {
        setError("Tu n'as plus de crédits de traduction. Achète un pack pour continuer.");
        return;
      }
    }
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

  function handleBuy(id: TranslationPackId) {
    buyPack(id);
    setJustPurchased(id);
    setTimeout(() => setJustPurchased(null), 2200);
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
        {isUltimate ? (
          <span className="relative ml-1 inline-flex items-center gap-0.5 rounded-full bg-[image:var(--gradient-neon)] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-white">
            <Crown className="h-2.5 w-2.5" /> Illimité
          </span>
        ) : (
          <span className="relative ml-1 inline-flex items-center gap-0.5 rounded-full bg-[color:var(--neon-violet)]/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-[color:var(--neon-violet)]">
            <Coins className="h-2.5 w-2.5" /> {credits}
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

              {/* Credits / status strip */}
              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--glass-border)] bg-background/40 px-4 py-3">
                {isUltimate ? (
                  <>
                    <div className="flex items-center gap-2 text-xs">
                      <Crown className="h-4 w-4 text-[color:var(--neon-violet)]" />
                      <span className="font-bold">Ultimate — traductions illimitées</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--neon-violet)]">∞</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs">
                      <Coins className="h-4 w-4 text-[color:var(--neon-blue)]" />
                      <span className="font-bold">{credits} crédit{credits > 1 ? "s" : ""} de traduction</span>
                    </div>
                    <Link
                      to="/premium"
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--neon-violet)] hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      Passer Ultimate →
                    </Link>
                  </>
                )}
              </div>

              {/* Pay-per-use packs for non-Ultimate */}
              {!isUltimate && (
                <div className="mt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Acheter des crédits
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {TRANSLATION_PACKS.map((p) => {
                      const purchased = justPurchased === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleBuy(p.id)}
                          className={
                            "group relative overflow-hidden rounded-xl border p-3 text-left transition " +
                            (purchased
                              ? "border-[color:var(--neon-blue)] bg-[color:var(--neon-blue)]/10"
                              : "border-[color:var(--glass-border)] bg-background/40 hover:border-[color:var(--neon-violet)]/60")
                          }
                        >
                          {"badge" in p && p.badge && (
                            <span className="absolute top-1 right-1 rounded-full bg-[image:var(--gradient-neon)] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                              {p.badge}
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--neon-blue)]">
                            <Zap className="h-3 w-3" /> {p.credits} trad.
                          </div>
                          <div className="mt-1 text-lg font-black">{p.priceEur}€</div>
                          <div className="text-[10px] text-muted-foreground">
                            {(p.priceEur / p.credits).toFixed(2).replace(".", ",")}€ / trad.
                          </div>
                          {purchased && (
                            <div className="mt-1 text-[10px] font-bold text-[color:var(--neon-blue)]">
                              + ajouté ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                            disabled={loading || !canTranslate}
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
                    {!canTranslate && (
                      <p className="mt-2 text-[11px] text-[color:var(--neon-violet)]">
                        Achète un pack ci-dessus pour lancer une traduction (1 crédit = 1 page).
                      </p>
                    )}
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
                        {isUltimate
                          ? "Choisis une langue ci-dessus pour lancer la traduction IA de cette page."
                          : credits > 0
                            ? `Tu as ${credits} crédit${credits > 1 ? "s" : ""}. Choisis une langue pour traduire cette page.`
                            : "Achète un pack de crédits pour traduire les scans dans la langue de ton choix."}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}