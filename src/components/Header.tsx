import { Link } from "@tanstack/react-router";
import { Search, Menu, BookOpen, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { series, allGenres } from "@/lib/series";

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const { matchedSeries, matchedGenres } = useMemo(() => {
    if (!q) return { matchedSeries: [], matchedGenres: [] };
    return {
      matchedSeries: series
        .filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.genres.some((g) => g.toLowerCase().includes(q))
        )
        .slice(0, 8),
      matchedGenres: allGenres.filter((g) => g.toLowerCase().includes(q)).slice(0, 8),
    };
  }, [q]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)] transition-transform group-hover:scale-110">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tight">
            Heaven<span className="text-primary">Scans</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Accueil</Link>
          <Link to="/series" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Séries</Link>
          <Link to="/genres" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Genres</Link>
          <Link to="/latest" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Derniers chapitres</Link>
        </nav>

        <div className="flex items-center gap-2" ref={searchRef}>
          <div className="relative">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Rechercher"
              className="grid h-9 w-9 place-items-center rounded-lg bg-secondary hover:bg-muted transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-11 w-[calc(100vw-2rem)] sm:w-96 rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une série ou un genre…"
                    className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {!q && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Tape pour rechercher dans le catalogue.
                    </div>
                  )}
                  {q && matchedSeries.length === 0 && matchedGenres.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Aucun résultat pour « {query} ».
                    </div>
                  )}
                  {matchedSeries.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Séries</div>
                      {matchedSeries.map((s) => (
                        <Link
                          key={s.slug}
                          to="/series/$slug"
                          params={{ slug: s.slug }}
                          onClick={closeSearch}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                        >
                          <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-muted">
                            <img src={s.cover} alt={s.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold">{s.title}</div>
                            <div className="text-xs text-muted-foreground">{s.type} · {s.chapters.length} ch.</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {matchedGenres.length > 0 && (
                    <div className="border-t border-border py-2">
                      <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Genres</div>
                      <div className="flex flex-wrap gap-2 px-3 pb-2">
                        {matchedGenres.map((g) => (
                          <Link
                            key={g}
                            to="/genres"
                            onClick={closeSearch}
                            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                          >
                            {g}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden grid h-9 w-9 place-items-center rounded-lg bg-secondary">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setOpen(false)}>Accueil</Link>
          <Link to="/series" onClick={() => setOpen(false)}>Séries</Link>
          <Link to="/genres" onClick={() => setOpen(false)}>Genres</Link>
          <Link to="/latest" onClick={() => setOpen(false)}>Derniers chapitres</Link>
        </nav>
      )}
    </header>
  );
}