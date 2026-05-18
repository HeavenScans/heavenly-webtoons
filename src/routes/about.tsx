import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — HeavenScans" },
      { name: "description", content: "L'équipe HeavenScans, sa mission et son histoire." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Qui sommes-nous"
      title="L'équipe derrière HeavenScans"
      intro="HeavenScans est un collectif passionné de traducteurs, éditeurs et cleaners qui partagent leurs séries préférées en VF."
    >
      <h2>Notre mission</h2>
      <p>
        Rendre accessible le meilleur du manga, manhwa, manhua et webtoon à la communauté francophone — avec une
        qualité de traduction et de typesetting digne des éditions officielles.
      </p>
      <h2>Soutenir la team</h2>
      <p>
        Nous traduisons par passion. Si tu veux nous soutenir, rejoins notre Discord, partage les séries autour de toi,
        ou passe Premium pour financer le serveur et les outils.
      </p>
    </PageShell>
  ),
});
