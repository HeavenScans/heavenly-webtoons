import { BookOpen } from "lucide-react";

export function EmptyState({ title = "Aucune série pour le moment", hint = "Les nouvelles sorties apparaîtront ici dès leur ajout." }: { title?: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)]">
        <BookOpen className="h-6 w-6 text-primary-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}