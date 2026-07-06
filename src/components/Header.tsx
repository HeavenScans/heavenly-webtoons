import { Link } from "@tanstack/react-router";
import { Search, Menu, X, Clock, Trash2, Crown, Heart, User as UserIcon, LogIn, ShieldCheck, Settings2 } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { useState, useEffect, useRef, useMemo } from "react";
import { series, allGenres } from "@/lib/series";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

const RECENT_KEY = "heavenscans:recent-searches";
const MAX_RECENT = 8;

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const { active: isPremium, tier, hydrated, deactivate } = usePremium();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isSuperAdmin } = useRole();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const persistRecent = (next: string[]) => {
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  const addRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
    persistRecent(next);
  };

  const removeRecent = (term: string) => {
    persistRecent(recent.filter((r) => r !== term));
  };

  const clearRecent = () => persistRecent([]);

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

  const onSelectResult = (term: string) => {
    addRecent(term);
    closeSearch();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) addRecent(query);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoUrl}
            alt="HeavenScans logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain drop-shadow-[0_0_12px_oklch(0.65_0.25_295/0.5)] transition-transform group-hover:scale-110"
          />
          <span className="text-xl font-black tracking-tight">
            Heaven<span className="text-primary">Scans</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Accueil</Link>
          <Link to="/series" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Séries</Link>
          <Link to="/genres" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Genres</Link>
          <Link to="/latest" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Derniers chapitres</Link>
          <Link to="/library" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
            <Heart className="h-3.5 w-3.5" /> Biblio
          </Link>
          {hydrated && isPremium ? (
            <button
              onClick={deactivate}
              title="Cliquer pour désactiver Premium"
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--neon-blue)]/50 bg-[image:var(--gradient-neon)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-[var(--shadow-neon-violet)] hover:scale-105 transition-transform"
            >
              <Crown className="h-3 w-3" /> {tier === "ultimate" ? "Ultimate" : "Premium"} actif
            </button>
          ) : (
            <Link to="/premium" className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-[color:var(--neon-blue)] hover:border-[color:var(--neon-blue)] hover:shadow-[var(--shadow-neon-violet)] transition-all">
              ✦ Premium
            </Link>
          )}
          {!authLoading && (user ? (
            <>
            {isAdmin && (
              <div className="inline-flex items-center gap-1">
                <Link to="/admin" className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--neon-blue)]/50 px-2.5 py-1.5 text-xs font-bold text-[color:var(--neon-blue)] hover:bg-[color:var(--neon-blue)]/10 transition-colors" title="Panneau d'administration">
                  <ShieldCheck className="h-3 w-3" /> Administration
                </Link>
                {isSuperAdmin && (
                  <Link to="/admin/settings" className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--neon-blue)]/30 px-2 py-1.5 text-[10px] font-bold text-[color:var(--neon-blue)] hover:bg-[color:var(--neon-blue)]/10 transition-colors" title="Paramètres admin">
                    <Settings2 className="h-3 w-3" /> Paramètres
                  </Link>
                )}
              </div>
            )}
            <Link to="/profile" className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold hover:bg-muted transition-colors" title="Mon profil">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-[image:var(--gradient-hero)] text-[10px] font-black text-primary-foreground">
                {(user.email ?? "?").charAt(0).toUpperCase()}
              </span>
              Profil
            </Link>
            </>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold hover:border-primary hover:text-primary transition-colors">
              <LogIn className="h-3 w-3" /> Connexion
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2" ref={searchRef}>
          {!authLoading && user && isAdmin && (
            <Link
              to="/admin"
              aria-label="Administration"
              title="Administration"
              className="md:hidden inline-flex items-center gap-1 rounded-lg border border-[color:var(--neon-blue)]/50 bg-[color:var(--neon-blue)]/10 px-2 py-1.5 text-[11px] font-bold text-[color:var(--neon-blue)] hover:bg-[color:var(--neon-blue)]/20 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
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
                <form onSubmit={onSubmit} className="flex items-center gap-2 border-b border-border px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une série ou un genre…"
                    className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </form>
                <div className="max-h-[60vh] overflow-y-auto">
                  {!q && recent.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Tape pour rechercher dans le catalogue.
                    </div>
                  )}
                  {!q && recent.length > 0 && (
                    <div className="py-2">
                      <div className="flex items-center justify-between px-3 pb-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <Clock className="h-3 w-3" /> Récentes
                        </div>
                        <button
                          onClick={clearRecent}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Effacer
                        </button>
                      </div>
                      {recent.map((term) => (
                        <div
                          key={term}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors group"
                        >
                          <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <button
                            onClick={() => {
                              setQuery(term);
                              inputRef.current?.focus();
                            }}
                            className="flex-1 text-left text-sm truncate"
                          >
                            {term}
                          </button>
                          <button
                            onClick={() => removeRecent(term)}
                            aria-label={`Supprimer ${term}`}
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
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
                          onClick={() => onSelectResult(s.title)}
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
                            onClick={() => onSelectResult(g)}
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
          <Link to="/library" onClick={() => setOpen(false)}>Ma bibliothèque</Link>
          <Link to="/premium" onClick={() => setOpen(false)}>Premium</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5 text-[color:var(--neon-blue)]"><ShieldCheck className="h-4 w-4" /> Administration</Link>
          )}
          {isSuperAdmin && (
            <Link to="/admin/settings" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5 text-[color:var(--neon-blue)]"><Settings2 className="h-4 w-4" /> Paramètres admin</Link>
          )}
          {user ? (
            <Link to="/profile" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5"><UserIcon className="h-4 w-4" /> Mon profil</Link>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5 text-primary"><LogIn className="h-4 w-4" /> Connexion / Inscription</Link>
          )}
        </nav>
      )}
    </header>
  );
}