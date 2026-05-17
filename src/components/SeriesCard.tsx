import { Link } from "@tanstack/react-router";
import { Star, Heart } from "lucide-react";
import type { Series } from "@/lib/series";
import { useFavorites } from "@/hooks/useFavorites";

export function SeriesCard({ s }: { s: Series }) {
  const { has, toggle, hydrated } = useFavorites();
  const fav = hydrated && has(s.slug);
  return (
    <div className="group relative overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
      <Link to="/series/$slug" params={{ slug: s.slug }} className="block">
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={s.cover}
            alt={s.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute top-2 left-2 rounded-md bg-background/80 backdrop-blur px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {s.type}
        </div>
        {s.rating != null && (
          <div className="absolute top-2 right-12 flex items-center gap-1 rounded-md bg-background/80 backdrop-blur px-2 py-0.5 text-xs font-semibold">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {s.rating.toFixed(1)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent p-3 pt-10">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight">{s.title}</h3>
          {s.chapters[0] && (
            <p className="mt-1 text-xs text-muted-foreground">Ch. {s.chapters[0].number}</p>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(s.slug);
        }}
        aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        className={`absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-md backdrop-blur transition-all ${
          fav
            ? "bg-[image:var(--gradient-neon)] text-white shadow-[var(--shadow-neon)]"
            : "bg-background/80 text-muted-foreground hover:text-primary"
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${fav ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
