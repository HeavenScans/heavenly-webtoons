import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeriesCard } from "@/components/SeriesCard";
import { ScrollToTop } from "@/components/ScrollToTop";
import { series } from "@/lib/series";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Ma bibliothèque — HeavenScans" },
      { name: "description", content: "Retrouvez toutes les séries que vous suivez sur HeavenScans." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { list, hydrated } = useFavorites();
  const favSeries = series.filter((s) => list.includes(s.slug));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--neon-blue)] inline-flex items-center gap-2">
              <Heart className="h-4 w-4" /> Favoris
            </p>
            <h1 className="mt-1 text-4xl font-black">Ma bibliothèque</h1>
            <p className="mt-2 text-muted-foreground">
              {hydrated ? `${favSeries.length} série${favSeries.length > 1 ? "s" : ""} suivie${favSeries.length > 1 ? "s" : ""}.` : "Chargement…"}
            </p>
          </div>
        </div>
        {hydrated && favSeries.length === 0 ? (
          <div className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-xl p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[image:var(--gradient-neon)] shadow-[var(--shadow-neon)]">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-5 text-2xl font-black">Aucun favori pour l'instant</h2>
            <p className="mt-2 text-sm text-muted-foreground">Ajoute des séries à ta bibliothèque en cliquant sur le cœur.</p>
            <Link
              to="/series"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 transition"
            >
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favSeries.map((s) => <SeriesCard key={s.slug} s={s} />)}
          </div>
        )}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
