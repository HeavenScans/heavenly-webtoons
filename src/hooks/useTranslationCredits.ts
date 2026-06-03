import { useEffect, useState, useCallback } from "react";

const KEY = "heavenscans:translation-credits";
const EVENT = "heavenscans:translation-credits-change";

function read(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function write(n: number) {
  try {
    localStorage.setItem(KEY, String(Math.max(0, n)));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export const TRANSLATION_PACKS = [
  { id: "starter", credits: 5, priceEur: 2 },
  { id: "boost", credits: 15, priceEur: 5, badge: "Populaire" },
  { id: "max", credits: 40, priceEur: 12, badge: "Meilleure valeur" },
] as const;

export type TranslationPackId = (typeof TRANSLATION_PACKS)[number]["id"];

export function useTranslationCredits() {
  const [credits, setCredits] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCredits(read());
    setHydrated(true);
    const sync = () => setCredits(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const buyPack = useCallback((id: TranslationPackId) => {
    const pack = TRANSLATION_PACKS.find((p) => p.id === id);
    if (!pack) return;
    write(read() + pack.credits);
  }, []);

  const consume = useCallback(() => {
    const cur = read();
    if (cur <= 0) return false;
    write(cur - 1);
    return true;
  }, []);

  return { credits, hydrated, buyPack, consume };
}