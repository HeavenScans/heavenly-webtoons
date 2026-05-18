import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const faqs = [
  { q: "Les chapitres sont-ils gratuits ?", a: "Oui. La totalité du catalogue est lisible gratuitement. Premium débloque l'accès anticipé et retire les publicités." },
  { q: "À quelle fréquence sortent les chapitres ?", a: "Chaque semaine. Les sorties dépendent des équipes RAW, de la traduction et du clean — suis-nous sur Discord pour les annonces." },
  { q: "Comment rejoindre la team ?", a: "On recrute traducteurs, cleaners, typesetters et check. Passe sur Discord ou utilise la page Contact." },
  { q: "Puis-je signaler une erreur de traduction ?", a: "Bien sûr — envoie-nous le chapitre et la page concernée par Discord ou email, on corrige rapidement." },
  { q: "Comment annuler Premium ?", a: "Depuis ta page Premium, tu peux te désabonner à tout moment. Ton accès reste actif jusqu'à la fin de la période payée." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — HeavenScans" },
      { name: "description", content: "Questions fréquentes sur HeavenScans : sorties, Premium, recrutement, signalements." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Aide" title="Questions fréquentes" intro="Tout ce qu'on nous demande le plus souvent.">
      <div className="not-prose space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-border bg-card/60 p-5 open:border-primary/60">
            <summary className="cursor-pointer list-none font-bold text-foreground flex items-center justify-between">
              {f.q}
              <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  ),
});
