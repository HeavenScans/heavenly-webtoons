import { Link } from "@tanstack/react-router";
import { Search, Menu, BookOpen } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
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

        <div className="flex items-center gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-lg bg-secondary hover:bg-muted transition-colors">
            <Search className="h-4 w-4" />
          </button>
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