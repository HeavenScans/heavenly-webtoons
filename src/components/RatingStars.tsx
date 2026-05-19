import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function RatingStars({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [avg, setAvg] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [mine, setMine] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const refresh = async () => {
    const { data } = await supabase.from("ratings").select("stars").eq("series_slug", slug);
    if (data) {
      setCount(data.length);
      setAvg(data.length ? data.reduce((a, b) => a + b.stars, 0) / data.length : null);
    }
    if (user) {
      const { data: mineData } = await supabase
        .from("ratings")
        .select("stars")
        .eq("series_slug", slug)
        .eq("user_id", user.id)
        .maybeSingle();
      setMine(mineData?.stars ?? null);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user?.id]);

  const rate = async (stars: number) => {
    if (!user) return;
    await supabase.from("ratings").upsert({ user_id: user.id, series_slug: slug, stars });
    setMine(stars);
    refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = (hover ?? mine ?? Math.round(avg ?? 0)) >= n;
          return (
            <button
              key={n}
              disabled={!user}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => rate(n)}
              className={`p-0.5 ${user ? "hover:scale-110" : "cursor-not-allowed opacity-70"} transition`}
              aria-label={`Noter ${n} étoiles`}
            >
              <Star className={`h-5 w-5 ${filled ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            </button>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground">
        {avg != null ? `${avg.toFixed(1)} / 5` : "Pas encore noté"} · {count} avis
        {!user && " · Connecte-toi pour noter"}
      </div>
    </div>
  );
}