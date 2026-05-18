import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation — HeavenScans" },
      { name: "description", content: "Conditions générales d'utilisation du site HeavenScans." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Légal" title="Conditions d'utilisation" intro="En utilisant HeavenScans, tu acceptes les termes ci-dessous.">
      <h2>Utilisation du site</h2>
      <p>Le contenu est mis à disposition à des fins personnelles et non commerciales. Toute rediffusion sans accord est interdite.</p>
      <h2>Comptes & Premium</h2>
      <p>Tu es responsable de la confidentialité de ton compte. Les abonnements Premium sont renouvelés automatiquement et peuvent être annulés à tout moment.</p>
      <h2>Responsabilité</h2>
      <p>Le site est fourni « tel quel ». Nous ne garantissons pas la disponibilité continue ni l'absence d'erreurs.</p>
      <h2>Modifications</h2>
      <p>Ces conditions peuvent évoluer. Les changements majeurs sont annoncés via Discord et email.</p>
    </PageShell>
  ),
});
