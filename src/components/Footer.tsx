import { Link } from "@tanstack/react-router";
import { BookOpen, Github, MessageCircle, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-hero)]">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black">Heaven<span className="text-primary">Scans</span></span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Votre paradis pour lire les meilleurs mangas, manhwas, manhuas et webtoons traduits par notre équipe passionnée.
          </p>
          <div className="mt-5 flex gap-3">
            <a className="grid h-9 w-9 place-items-center rounded-lg bg-secondary hover:bg-muted transition-colors" href="#"><Twitter className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-lg bg-secondary hover:bg-muted transition-colors" href="#"><MessageCircle className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-lg bg-secondary hover:bg-muted transition-colors" href="#"><Github className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Navigation</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Accueil</Link></li>
            <li><Link to="/series" className="hover:text-foreground">Séries</Link></li>
            <li><Link to="/genres" className="hover:text-foreground">Genres</Link></li>
            <li><Link to="/latest" className="hover:text-foreground">Derniers chapitres</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Infos</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>À propos</li>
            <li>Discord</li>
            <li>Contact</li>
            <li>DMCA</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HeavenScans — Tous droits réservés.
      </div>
    </footer>
  );
}