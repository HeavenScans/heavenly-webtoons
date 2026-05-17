import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeriesCard } from "@/components/SeriesCard";
import { ScrollToTop } from "@/components/ScrollToTop";
import { series, allGenres } from "@/lib/series";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";

type SortKey = "recent" | "title" | "rating";

type SeriesSearch = {
  q?: string;
  genre?: string;
  type?: string;
  sort?: SortKey;
};

export const Route = createFileRoute("/series")({
  head: () => ({
    meta: [
      { title: "Séries — HeavenScans" },
      { name: "description", content: "Catalogue complet des mangas, manhwas et webtoons traduits par HeavenScans." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): SeriesSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    genre: typeof search.genre === "string" ? search.genre : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
    sort: ["recent", "title", "rating"].includes(search.sort as string) ? (search.sort as SortKey) : undefined,
  }),
  component: SeriesPage,
});

const TYPES = ["Manga", "Manhwa", "Manhua", "Webtoon", "Webcomic"];

function SeriesPage() {
  const { q = "", genre, type, sort = "recent" } = Route.useSearch();
  const navigate = useNavigate({ from: "/series" });

  const update = (patch: Partial<SeriesSearch>) =>
    navigate({
      search: (prev) => {
        const next = { ...prev, ...patch } as SeriesSearch;
        (Object.keys(next) as (keyof SeriesSearch)[]).forEach((k) => {
          if (next[k] === "" || next[k] === undefined) delete next[k];
        });
        return next;
      },
    });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = series.filter((s) => {
      if (genre && !s.genres.includes(genre)) return false;
      if (type && s.type !== type) return false;
      if (term && !s.title.toLowerCase().includes(term) && !s.genres.some((g) => g.toLowerCase().includes(term))) return false;
      return true;
    });
    if (sort === "title") out = [...out].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "rating") out = [...out].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return out;
  }, [q, genre, type, sort]);

  const hasFilters = !!(q || genre || type) || sort !== "recent";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Bibliothèque</p>
          <h1 className="mt-1 text-4xl font-black">Toutes les séries</h1>
          <p className="mt-2 text-muted-foreground">
            {filtered.length} sur {series.length} série{series.length > 1 ? "s" : ""}.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-4 space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Rechercher par titre ou genre…"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button onClick={() => update({ q: undefined })} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={type ?? ""}
              onChange={(e) => update({ type: e.target.value || undefined })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Tous les types</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={genre ?? ""}
              onChange={(e) => update({ genre: e.target.value || undefined })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Tous les genres</option>
              {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="recent">Trier : Récents</option>
              <option value="title">Trier : Titre A→Z</option>
              <option value="rating">Trier : Mieux notés</option>
            </select>
          </div>
          {hasFilters && (
            <button
              onClick={() => navigate({ search: {} })}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <SlidersHorizontal className="h-3 w-3" /> Réinitialiser les filtres
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Aucune série ne correspond à ces critères.
            <div className="mt-4">
              <Link to="/series" search={{}} className="text-primary font-semibold">Voir tout le catalogue</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((s) => <SeriesCard key={s.slug} s={s} />)}
          </div>
        )}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
