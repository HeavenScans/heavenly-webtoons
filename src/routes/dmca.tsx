import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA — HeavenScans" },
      { name: "description", content: "Procédure de signalement DMCA pour le retrait de contenu sur HeavenScans." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Légal"
      title="DMCA / Retrait de contenu"
      intro="HeavenScans respecte les droits des ayants droit. Tout contenu peut être retiré sur demande légitime."
    >
      <h2>Comment signaler</h2>
      <p>
        Envoie une demande de retrait à <a href="mailto:dmca@heavenscans.fr">dmca@heavenscans.fr</a> avec les éléments suivants :
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Identité et coordonnées du demandeur (ou de son représentant).</li>
        <li>Lien(s) exact(s) vers le contenu concerné sur HeavenScans.</li>
        <li>Preuve de détention des droits (éditeur, auteur, licence).</li>
        <li>Déclaration de bonne foi.</li>
      </ul>
      <h2>Délais</h2>
      <p>Les demandes valides sont traitées sous 72h ouvrées. Une confirmation est envoyée après retrait.</p>
    </PageShell>
  ),
});
