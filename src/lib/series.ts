// Add your series here. Each entry will appear on the homepage and listings.
// Place cover images in `public/covers/` and reference them as `/covers/your-image.jpg`.
export type Chapter = {
  number: string;
  title?: string;
  releasedAt: string; // ISO date or human string
};

export type Series = {
  slug: string;
  title: string;
  cover: string;
  type: "Manga" | "Manhwa" | "Manhua" | "Webtoon" | "Webcomic";
  status: "Ongoing" | "Completed" | "Hiatus";
  genres: string[];
  rating?: number;
  synopsis: string;
  chapters: Chapter[];
};

const cover = (slug: string) => `https://picsum.photos/seed/heaven-${slug}/400/600`;

const chapters = (count: number): Chapter[] =>
  Array.from({ length: count }, (_, i) => ({
    number: String(count - i),
    title: i === 0 ? "Dernier chapitre" : undefined,
    releasedAt: `Il y a ${i === 0 ? "1 jour" : i < 4 ? `${i + 1} jours` : `${i + 1} sem.`}`,
  }));

export const series: Series[] = [];

export const allGenres = [
  "Action",
  "Aventure",
  "Comédie",
  "Drame",
  "Fantastique",
  "Horreur",
  "Isekai",
  "Romance",
  "Sci-Fi",
  "Shonen",
  "Seinen",
  "Slice of Life",
  "Surnaturel",
  "Thriller",
];