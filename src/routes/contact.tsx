import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — HeavenScans" },
      { name: "description", content: "Contacter l'équipe HeavenScans : partenariats, recrutement, signalements." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell eyebrow="Nous écrire" title="Contact" intro="Une question, un partenariat, une candidature pour rejoindre la team ? Écris-nous.">
      <div className="grid gap-3 sm:grid-cols-2 not-prose">
        <a href="mailto:contact@heavenscans.fr" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-bold text-foreground">Email</div>
            <div className="text-xs text-muted-foreground">contact@heavenscans.fr</div>
          </div>
        </a>
        <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors">
          <MessageCircle className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-bold text-foreground">Discord</div>
            <div className="text-xs text-muted-foreground">Réponse en moins de 24h</div>
          </div>
        </a>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          (e.target as HTMLFormElement).reset();
          setTimeout(() => setSent(false), 4000);
        }}
        className="mt-8 space-y-3 rounded-2xl border border-border bg-card/60 p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Nom" className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          <input required type="email" placeholder="Email" className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <input required placeholder="Sujet" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <textarea required rows={5} placeholder="Ton message..." className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <button className="inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-neon)] px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-neon)]">
          <Send className="h-4 w-4" /> {sent ? "Message envoyé !" : "Envoyer"}
        </button>
      </form>
    </PageShell>
  );
}
