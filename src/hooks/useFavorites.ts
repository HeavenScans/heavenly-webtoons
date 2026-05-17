import { useCallback, useEffect, useState } from "react";

const KEY = "heavenscans:favorites";
const EVENT = "heavenscans:favorites-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export function useFavorites() {
  const [list, setList] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setList(read());
    setHydrated(true);
    const sync = () => setList(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback((slug: string) => list.includes(slug), [list]);

  const toggle = useCallback((slug: string) => {
    const cur = read();
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur];
    write(next);
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((s) => s !== slug));
  }, []);

  return { list, hydrated, has, toggle, remove };
}
