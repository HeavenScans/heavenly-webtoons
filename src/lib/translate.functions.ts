import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  imageUrl: z.string().url().max(2048),
  targetLang: z.enum(["fr", "en", "es", "de", "it", "pt", "ja"]).default("fr"),
});

const LANG_LABEL: Record<string, string> = {
  fr: "français",
  en: "anglais",
  es: "espagnol",
  de: "allemand",
  it: "italien",
  pt: "portugais",
  ja: "japonais",
};

export const translateScanPage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Lovable AI indisponible : clé manquante.");

    const target = LANG_LABEL[data.targetLang];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Tu es un traducteur professionnel de scans manga. Tu extrais le texte de chaque bulle dans l'ordre de lecture (droite-à-gauche pour les mangas) et tu le traduis en ${target}. Format strict :\n\n[Bulle 1] texte traduit\n[Bulle 2] texte traduit\n…\n\nN'ajoute ni commentaire, ni description visuelle, ni note. Si une page ne contient pas de texte, réponds : "(Aucun texte détecté sur cette page.)"`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: `Traduis cette page en ${target}.` },
              { type: "image_url", image_url: { url: data.imageUrl } },
            ],
          },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Trop de requêtes. Réessaie dans un instant.");
    if (res.status === 402) throw new Error("Crédits IA épuisés. Recharge ton workspace.");
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Échec de la traduction (${res.status}). ${txt.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("Réponse IA vide.");
    return { translation: content, targetLang: data.targetLang };
  });