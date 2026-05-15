import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { series } from "@/lib/series";
import { Star, BookOpen, Clock } from "lucide-react";

export const Route = createFileRoute("/series/$slug")({
  component: SeriesDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-black">Série introuvable</h1>
        <Link to="/series" className="mt-4 inline-block text-primary">← Retour au catalogue</Link>
      </div>
    </div>
  ),
});

function SeriesDetail() {
  const { slug } = Route.useParams();
  const s = series.find((x) => x.slug === slug);
  if (!s) throw notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: `url(${s.cover})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(40px)" }} />
        <div className="absolute inset-0 -z-10 bg-background/80" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-[240px_1fr]">
          <img src={s.cover} alt={s.title} className="w-full max-w-[240px] rounded-xl shadow-[var(--shadow-card)]" />
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="rounded bg-primary/20 px-2 py-0.5 text-primary">{s.type}</span>
              <span className="rounded bg-secondary px-2 py-0.5">{s.status}</span>
              {s.rating != null && (
                <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5"><Star className="h-3 w-3 fill-primary text-primary" />{s.rating.toFixed(1)}</span>
              )}
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-black">{s.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.genres.map((g) => <span key={g} className="rounded-full border border-border bg-card/50 px-3 py-1 text-xs">{g}</span>)}
            </div>
            <p className="mt-5 max-w-3xl text-muted-foreground">{s.synopsis}</p>
          </div>
        </div>
      </div>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-black mb-4 inline-flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Chapitres</h2>
        {s.chapters.length === 0 ? (
          <p className="text-muted-foreground">Aucun chapitre disponible pour le moment.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
            {s.chapters.map((c) => (
              <li key={c.number} className="flex items-center justify-between p-4 hover:bg-muted transition">
                <div>
                  <div className="font-semibold">Chapitre {c.number}</div>
                  {c.title && <div className="text-sm text-muted-foreground">{c.title}</div>}
                </div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />{c.releasedAt}</div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}