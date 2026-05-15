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

// Empty by design — add your scans here.
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