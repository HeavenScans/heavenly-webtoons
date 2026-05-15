import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { series } from "@/lib/series";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { PremiumLock, PremiumBadge, ComingSoon } from "@/components/PremiumLock";

export const Route = createFileRoute("/latest")({
  head: () => ({
    meta: [
      { title: "Derniers chapitres — HeavenScans" },
      { name: "description", content: "Tous les derniers chapitres publiés sur HeavenScans." },
    ],
  }),
  component: LatestPage,
});

function LatestPage() {
  const items = series.flatMap((s) =>
    s.chapters.slice(0, 3).map((c) => ({ s, c }))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Mises à jour</p>
          <h1 className="mt-1 text-4xl font-black">Derniers chapitres</h1>
        </div>
        {items.length === 0 ? (
          <div className="space-y-8">
            <PremiumLock
              title="Chapitre Premium"
              subtitle="Les prochains chapitres seront disponibles en avant-première pour les membres Premium."
            />
            <ComingSoon />
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
            {items.map(({ s, c }, i) => (
              <li key={i}>
                <Link to="/series/$slug" params={{ slug: s.slug }} className="group flex items-center gap-4 p-4 hover:bg-muted transition-all hover:translate-x-1">
                  <img src={s.cover} alt={s.title} className="h-16 w-12 rounded object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold truncate">{s.title}</h3>
                      <PremiumBadge />
                    </div>
                    <p className="text-sm text-muted-foreground">Chapitre {c.number}{c.title ? ` — ${c.title}` : ""}</p>
                  </div>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />{c.releasedAt}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}