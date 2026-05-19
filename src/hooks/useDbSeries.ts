import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Series } from "@/lib/series";

type DbSeriesRow = {
  slug: string;
  title: string;
  type: string;
  status: string;
  genres: string[];
  synopsis: string;
  cover_url: string | null;
  rating: number | null;
  is_premium: boolean;
};

type DbChapterRow = {
  series_id: string;
  number: string;
  title: string | null;
  released_at: string;
  pages: string[];
  is_premium: boolean;
};

export function useDbSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows } = await supabase
        .from("series")
        .select("id, slug, title, type, status, genres, synopsis, cover_url, rating, is_premium")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (!rows) {
        if (!cancelled) setLoading(false);
        return;
      }
      const ids = rows.map((r: any) => r.id);
      const { data: chs } = ids.length
        ? await supabase
            .from("chapters")
            .select("series_id, number, title, released_at, pages, is_premium")
            .in("series_id", ids)
            .eq("published", true)
            .order("released_at", { ascending: false })
        : { data: [] as any[] };
      const byId: Record<string, DbChapterRow[]> = {};
      (chs ?? []).forEach((c: any) => {
        (byId[c.series_id] ??= []).push(c);
      });
      const mapped: Series[] = rows.map((r: any) => ({
        slug: r.slug,
        title: r.title,
        type: r.type as Series["type"],
        status: r.status as Series["status"],
        genres: r.genres ?? [],
        synopsis: r.synopsis ?? "",
        cover: r.cover_url ?? `https://picsum.photos/seed/heaven-${r.slug}/400/600`,
        rating: r.rating ?? undefined,
        chapters: (byId[r.id] ?? []).map((c) => ({
          number: c.number,
          title: c.title ?? undefined,
          releasedAt: new Date(c.released_at).toLocaleDateString("fr-FR"),
        })),
      }));
      if (!cancelled) {
        setSeries(mapped);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { series, loading };
}