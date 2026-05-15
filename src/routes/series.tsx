import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeriesCard } from "@/components/SeriesCard";
import { EmptyState } from "@/components/EmptyState";
import { series } from "@/lib/series";

export const Route = createFileRoute("/series")({
  head: () => ({
    meta: [
      { title: "Séries — HeavenScans" },
      { name: "description", content: "Catalogue complet des mangas, manhwas et webtoons traduits par HeavenScans." },
    ],
  }),
  component: SeriesPage,
});

function SeriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Bibliothèque</p>
          <h1 className="mt-1 text-4xl font-black">Toutes les séries</h1>
          <p className="mt-2 text-muted-foreground">{series.length} série{series.length > 1 ? "s" : ""} dans le catalogue.</p>
        </div>
        {series.length === 0 ? (
          <EmptyState title="Catalogue vide" hint="Ajoute des séries via src/lib/series.ts pour les voir apparaître ici." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {series.map((s) => <SeriesCard key={s.slug} s={s} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}