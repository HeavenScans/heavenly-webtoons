import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const LS_KEY = "heavenscans:reading-history";

export type HistoryEntry = {
  series_slug: string;
  chapter_number: string;
  page: number;
  updated_at: string;
};

function read(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function write(list: HistoryEntry[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
}

export function useReadingHistory() {
  const { user } = useAuth();
  const [list, setList] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setList(read());
    if (!user) return;
    supabase
      .from("reading_history")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setList(data as HistoryEntry[]);
          write(data as HistoryEntry[]);
        }
      });
  }, [user]);

  const record = useCallback(
    async (series_slug: string, chapter_number: string, page = 1) => {
      const entry: HistoryEntry = {
        series_slug,
        chapter_number,
        page,
        updated_at: new Date().toISOString(),
      };
      const next = [entry, ...read().filter((h) => h.series_slug !== series_slug)].slice(0, 50);
      write(next);
      setList(next);
      if (user) {
        await supabase.from("reading_history").upsert({
          user_id: user.id,
          series_slug,
          chapter_number,
          page,
          updated_at: entry.updated_at,
        });
      }
    },
    [user]
  );

  const getFor = useCallback(
    (slug: string) => list.find((h) => h.series_slug === slug) ?? null,
    [list]
  );

  return { list, record, getFor };
}