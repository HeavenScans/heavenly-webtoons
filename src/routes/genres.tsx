import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { allGenres, series } from "@/lib/series";

export const Route = createFileRoute("/genres")({
  head: () => ({
    meta: [
      { title: "Genres — HeavenScans" },
      { name: "description", content: "Parcourez les séries par genre sur HeavenScans." },
    ],
  }),
  component: GenresPage,
});

function GenresPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Catégories</p>
          <h1 className="mt-1 text-4xl font-black">Tous les genres</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allGenres.map((g) => {
            const count = series.filter((s) => s.genres.includes(g)).length;
            return (
              <Link
                key={g}
                to="/series"
                search={{ genre: g }}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary transition"
              >
                <div className="text-lg font-bold group-hover:text-primary transition-colors">{g}</div>
                <div className="mt-1 text-xs text-muted-foreground">{count} série{count > 1 ? "s" : ""}</div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
