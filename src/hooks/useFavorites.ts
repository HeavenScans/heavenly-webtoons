import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

let currentUserId: string | null = null;

async function pushAdd(slug: string) {
  if (!currentUserId) return;
  await supabase.from("favorites").upsert({ user_id: currentUserId, slug });
}

async function pushRemove(slug: string) {
  if (!currentUserId) return;
  await supabase.from("favorites").delete().eq("user_id", currentUserId).eq("slug", slug);
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

    // Cloud sync on auth state
    const syncWithCloud = async (userId: string | null) => {
      currentUserId = userId;
      if (!userId) return;
      const local = read();
      const { data } = await supabase.from("favorites").select("slug").eq("user_id", userId);
      const remote = (data ?? []).map((r) => r.slug);
      // Merge: union, remote first to preserve cloud ordering
      const merged = Array.from(new Set([...remote, ...local]));
      // Push any local-only items to cloud
      const toPush = local.filter((s) => !remote.includes(s));
      if (toPush.length) {
        await supabase.from("favorites").upsert(toPush.map((slug) => ({ user_id: userId, slug })));
      }
      write(merged);
    };

    supabase.auth.getSession().then(({ data }) => syncWithCloud(data.session?.user?.id ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      syncWithCloud(s?.user?.id ?? null);
    });

    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
      subscription.unsubscribe();
    };
  }, []);

  const has = useCallback((slug: string) => list.includes(slug), [list]);

  const toggle = useCallback((slug: string) => {
    const cur = read();
    const adding = !cur.includes(slug);
    const next = adding ? [slug, ...cur] : cur.filter((s) => s !== slug);
    write(next);
    if (adding) void pushAdd(slug);
    else void pushRemove(slug);
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((s) => s !== slug));
    void pushRemove(slug);
  }, []);

  return { list, hydrated, has, toggle, remove };
}
