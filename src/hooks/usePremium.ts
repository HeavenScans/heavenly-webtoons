import { useEffect, useState, useCallback } from "react";

const PREMIUM_KEY = "heavenscans:premium";
const EVENT = "heavenscans:premium-change";

export type PremiumTier = "premium" | "ultimate";

export interface PremiumState {
  active: boolean;
  tier: PremiumTier | null;
  since: number | null;
}

const defaultState: PremiumState = { active: false, tier: null, since: null };

function read(): PremiumState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(PREMIUM_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as PremiumState;
    if (parsed && typeof parsed.active === "boolean") return parsed;
  } catch {}
  return defaultState;
}

function write(state: PremiumState) {
  try {
    localStorage.setItem(PREMIUM_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export function usePremium() {
  const [state, setState] = useState<PremiumState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const sync = () => setState(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const activate = useCallback((tier: PremiumTier = "premium") => {
    write({ active: true, tier, since: Date.now() });
  }, []);

  const deactivate = useCallback(() => {
    write(defaultState);
  }, []);

  const toggle = useCallback(() => {
    const cur = read();
    write(cur.active ? defaultState : { active: true, tier: "premium", since: Date.now() });
  }, []);

  return { ...state, hydrated, activate, deactivate, toggle };
}