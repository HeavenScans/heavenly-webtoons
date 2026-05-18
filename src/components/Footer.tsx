import { Link } from "@tanstack/react-router";
import { BookOpen, Github, MessageCircle, Twitter, Send } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              setSent(true);
              setEmail("");
              setTimeout(() => setSent(false), 3000);
            }}
            className="mt-5 flex max-w-md items-center gap-2 rounded-lg border border-border bg-background/60 backdrop-blur p-1.5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ton email pour les nouvelles sorties"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="inline-flex items-center gap-1.5 rounded-md bg-[image:var(--gradient-neon)] px-3 py-2 text-xs font-bold text-white shadow-[var(--shadow-neon)]">
              <Send className="h-3.5 w-3.5" /> {sent ? "Inscrit !" : "S'abonner"}
            </button>
          </form>
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
            <li><Link to="/library" className="hover:text-foreground">Ma bibliothèque</Link></li>
            <li><Link to="/premium" className="hover:text-foreground">Premium</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Infos</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Discord</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <Link to="/terms" className="hover:text-foreground">Conditions</Link>
        <Link to="/privacy" className="hover:text-foreground">Confidentialité</Link>
        <Link to="/dmca" className="hover:text-foreground">DMCA</Link>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HeavenScans — Tous droits réservés.
      </div>
    </footer>
  );
}