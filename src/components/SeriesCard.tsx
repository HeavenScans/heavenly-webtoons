import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Series } from "@/lib/series";

export function SeriesCard({ s }: { s: Series }) {
  return (
    <Link
      to="/series/$slug"
      params={{ slug: s.slug }}
      className="group relative overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
    >
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
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-background/80 backdrop-blur px-2 py-0.5 text-xs font-semibold">
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
  );
}