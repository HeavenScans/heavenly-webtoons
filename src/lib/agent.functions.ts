import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "tool"]),
  content: z.string(),
  tool_call_id: z.string().optional(),
  name: z.string().optional(),
  tool_calls: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal("function"),
        function: z.object({ name: z.string(), arguments: z.string() }),
      }),
    )
    .optional(),
});

const Input = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
});

type ToolMessage = z.infer<typeof MessageSchema>;

const tools = [
  {
    type: "function",
    function: {
      name: "get_overview_stats",
      description: "Récupère les statistiques globales du site : nombre de séries, chapitres, scans programmés, scans premium.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "list_recent_chapters",
      description: "Liste les derniers chapitres publiés ou créés (max 10).",
      parameters: {
        type: "object",
        properties: { limit: { type: "number", description: "1-10", default: 5 } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_scheduled_chapters",
      description: "Liste les chapitres programmés non encore publiés.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "run_auto_publish",
      description: "Déclenche immédiatement le bot d'auto-publication : publie tous les chapitres programmés dont la date est passée.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "schedule_chapter",
      description: "Programme la publication d'un chapitre existant (par ID) à une date ISO 8601.",
      parameters: {
        type: "object",
        properties: {
          chapter_id: { type: "string" },
          scheduled_at: { type: "string", description: "Date ISO 8601 future" },
        },
        required: ["chapter_id", "scheduled_at"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "publish_chapter_now",
      description: "Publie immédiatement un chapitre (par ID).",
      parameters: {
        type: "object",
        properties: { chapter_id: { type: "string" } },
        required: ["chapter_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "trend_analysis",
      description: "Analyse les tendances : séries les mieux notées et les plus récentes.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
];

async function execTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "get_overview_stats": {
      const [series, chapters, scheduled, premium] = await Promise.all([
        supabaseAdmin.from("series").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("chapters").select("id", { count: "exact", head: true }),
        supabaseAdmin
          .from("chapters")
          .select("id", { count: "exact", head: true })
          .eq("published", false)
          .not("scheduled_at", "is", null),
        supabaseAdmin
          .from("chapters")
          .select("id", { count: "exact", head: true })
          .eq("is_premium", true),
      ]);
      return {
        series_count: series.count ?? 0,
        chapters_count: chapters.count ?? 0,
        scheduled_count: scheduled.count ?? 0,
        premium_chapters_count: premium.count ?? 0,
      };
    }
    case "list_recent_chapters": {
      const limit = Math.min(Math.max(Number(args.limit ?? 5), 1), 10);
      const { data } = await supabaseAdmin
        .from("chapters")
        .select("id, number, title, released_at, published, series_id")
        .order("created_at", { ascending: false })
        .limit(limit);
      return { chapters: data ?? [] };
    }
    case "list_scheduled_chapters": {
      const { data } = await supabaseAdmin
        .from("chapters")
        .select("id, number, title, scheduled_at, series_id")
        .eq("published", false)
        .not("scheduled_at", "is", null)
        .order("scheduled_at", { ascending: true })
        .limit(20);
      return { scheduled: data ?? [] };
    }
    case "run_auto_publish": {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabaseAdmin
        .from("chapters")
        .update({ published: true, released_at: nowIso })
        .eq("published", false)
        .not("scheduled_at", "is", null)
        .lte("scheduled_at", nowIso)
        .select("id, number, series_id");
      if (error) return { ok: false, error: error.message };
      return { ok: true, published_count: (data ?? []).length, published: data ?? [] };
    }
    case "schedule_chapter": {
      const id = String(args.chapter_id);
      const at = String(args.scheduled_at);
      const { error } = await supabaseAdmin
        .from("chapters")
        .update({ scheduled_at: at, published: false })
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
      return { ok: true, chapter_id: id, scheduled_at: at };
    }
    case "publish_chapter_now": {
      const id = String(args.chapter_id);
      const { error } = await supabaseAdmin
        .from("chapters")
        .update({ published: true, released_at: new Date().toISOString() })
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
      return { ok: true, chapter_id: id };
    }
    case "trend_analysis": {
      const [{ data: top }, { data: recent }] = await Promise.all([
        supabaseAdmin
          .from("series")
          .select("title, slug, rating, genres")
          .order("rating", { ascending: false, nullsFirst: false })
          .limit(5),
        supabaseAdmin
          .from("series")
          .select("title, slug, updated_at")
          .order("updated_at", { ascending: false })
          .limit(5),
      ]);
      return { top_rated: top ?? [], most_recent: recent ?? [] };
    }
    default:
      return { error: `Outil inconnu : ${name}` };
  }
}

const SYSTEM_PROMPT = `Tu es Astra, l'agent IA de HeavenScans. Tu es un employé virtuel qui aide les admins à gérer leur plateforme de scans manga.

Capacités :
- Publier des chapitres immédiatement ou les programmer
- Déclencher l'auto-publication des scans programmés
- Donner des stats, tendances, et analyses
- Lister chapitres récents et programmés

Règles :
- Réponds en français, concis et chaleureux.
- Utilise les outils dès qu'une action concrète est demandée.
- Confirme toujours les actions effectuées avec les détails clés (nombre, IDs courts).
- Pour les dates, accepte le langage naturel ("demain 18h") et convertis en ISO 8601 UTC.
- Si une demande est ambiguë, pose une seule question claire.`;

export const runAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Réservé aux administrateurs.");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Lovable AI indisponible : clé manquante.");

    const convo: ToolMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...data.messages,
    ];

    const toolEvents: Array<{ name: string; result: string }> = [];

    for (let step = 0; step < 6; step++) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: convo,
          tools,
        }),
      });

      if (res.status === 429) throw new Error("Limite IA atteinte. Réessaie dans un instant.");
      if (res.status === 402) throw new Error("Crédits IA épuisés.");
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Échec IA (${res.status}). ${txt.slice(0, 200)}`);
      }

      const json = (await res.json()) as {
        choices?: Array<{
          message?: {
            role: string;
            content?: string | null;
            tool_calls?: Array<{
              id: string;
              type: "function";
              function: { name: string; arguments: string };
            }>;
          };
        }>;
      };
      const msg = json.choices?.[0]?.message;
      if (!msg) throw new Error("Réponse IA vide.");

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        convo.push({
          role: "assistant",
          content: msg.content ?? "",
          tool_calls: msg.tool_calls,
        });
        for (const call of msg.tool_calls) {
          let parsed: Record<string, unknown> = {};
          try {
            parsed = JSON.parse(call.function.arguments || "{}");
          } catch {
            parsed = {};
          }
          const result = await execTool(call.function.name, parsed);
          const resultStr = JSON.stringify(result);
          toolEvents.push({ name: call.function.name, result: resultStr });
          convo.push({
            role: "tool",
            tool_call_id: call.id,
            name: call.function.name,
            content: resultStr,
          });
        }
        continue;
      }

      return {
        reply: msg.content ?? "",
        toolEvents,
      };
    }

    return { reply: "(Boucle d'outils interrompue après 6 étapes.)", toolEvents };
  });

export const getAgentDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Réservé aux administrateurs.");

    const [seriesCount, chaptersCount, scheduled, recent, premiumCount] = await Promise.all([
      supabaseAdmin.from("series").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("chapters").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("chapters")
        .select("id, number, title, scheduled_at, series_id")
        .eq("published", false)
        .not("scheduled_at", "is", null)
        .order("scheduled_at", { ascending: true })
        .limit(8),
      supabaseAdmin
        .from("chapters")
        .select("id, number, title, released_at, published, series_id")
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("chapters")
        .select("id", { count: "exact", head: true })
        .eq("is_premium", true),
    ]);

    const seriesIds = new Set<string>();
    (scheduled.data ?? []).forEach((c) => seriesIds.add(c.series_id));
    (recent.data ?? []).forEach((c) => seriesIds.add(c.series_id));
    let titlesById: Record<string, string> = {};
    if (seriesIds.size > 0) {
      const { data: s } = await supabaseAdmin
        .from("series")
        .select("id, title")
        .in("id", Array.from(seriesIds));
      titlesById = Object.fromEntries((s ?? []).map((r) => [r.id, r.title]));
    }

    return {
      stats: {
        series: seriesCount.count ?? 0,
        chapters: chaptersCount.count ?? 0,
        scheduled: (scheduled.data ?? []).length,
        premium: premiumCount.count ?? 0,
      },
      scheduled: (scheduled.data ?? []).map((c) => ({ ...c, series_title: titlesById[c.series_id] ?? "—" })),
      recent: (recent.data ?? []).map((c) => ({ ...c, series_title: titlesById[c.series_id] ?? "—" })),
    };
  });