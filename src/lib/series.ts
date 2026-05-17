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

export const series: Series[] = [
  {
    slug: "shadow-monarch",
    title: "Shadow Monarch Rising",
    cover: cover("shadow-monarch"),
    type: "Manhwa",
    status: "Ongoing",
    genres: ["Action", "Fantastique", "Surnaturel"],
    rating: 4.9,
    synopsis:
      "Le plus faible des chasseurs reçoit un don mystérieux et part dompter les ombres pour devenir le souverain absolu.",
    chapters: chapters(24),
  },
  {
    slug: "neon-blade",
    title: "Neon Blade",
    cover: cover("neon-blade"),
    type: "Manga",
    status: "Ongoing",
    genres: ["Action", "Sci-Fi", "Seinen"],
    rating: 4.7,
    synopsis:
      "Dans une mégapole cyberpunk, un mercenaire au katana laser traque les responsables de la chute de sa famille.",
    chapters: chapters(18),
  },
  {
    slug: "isekai-academy",
    title: "Isekai Academy",
    cover: cover("isekai-academy"),
    type: "Manhua",
    status: "Ongoing",
    genres: ["Isekai", "Aventure", "Comédie", "Fantastique"],
    rating: 4.5,
    synopsis:
      "Téléporté dans une école de magie d'un autre monde, un lycéen découvre que ses notes IRL sont devenues ses statistiques de combat.",
    chapters: chapters(32),
  },
  {
    slug: "silver-petals",
    title: "Silver Petals",
    cover: cover("silver-petals"),
    type: "Webtoon",
    status: "Ongoing",
    genres: ["Romance", "Drame", "Slice of Life"],
    rating: 4.6,
    synopsis:
      "Deux étudiants en arts apprennent à se reconstruire à travers la peinture et les saisons qui défilent.",
    chapters: chapters(40),
  },
  {
    slug: "demon-courier",
    title: "Demon Courier",
    cover: cover("demon-courier"),
    type: "Manhwa",
    status: "Hiatus",
    genres: ["Action", "Surnaturel", "Thriller"],
    rating: 4.3,
    synopsis:
      "Un livreur nocturne accepte des colis pour des clients démoniaques. Chaque livraison cache un piège.",
    chapters: chapters(12),
  },
  {
    slug: "kingdom-of-ash",
    title: "Kingdom of Ash",
    cover: cover("kingdom-of-ash"),
    type: "Manga",
    status: "Completed",
    genres: ["Fantastique", "Drame", "Shonen"],
    rating: 4.8,
    synopsis:
      "Après la chute du dernier royaume libre, un jeune prince banni rassemble les survivants pour reprendre son trône.",
    chapters: chapters(60),
  },
  {
    slug: "midnight-cafe",
    title: "Minuit au Café",
    cover: cover("midnight-cafe"),
    type: "Webcomic",
    status: "Ongoing",
    genres: ["Slice of Life", "Romance", "Comédie"],
    rating: 4.4,
    synopsis:
      "Un café ouvert seulement la nuit accueille des clients étranges et des histoires plus étranges encore.",
    chapters: chapters(22),
  },
  {
    slug: "void-runners",
    title: "Void Runners",
    cover: cover("void-runners"),
    type: "Manhua",
    status: "Ongoing",
    genres: ["Sci-Fi", "Aventure", "Action"],
    rating: 4.2,
    synopsis:
      "Un équipage de pilleurs spatiaux découvre une relique capable de réécrire l'histoire de l'univers.",
    chapters: chapters(15),
  },
];

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