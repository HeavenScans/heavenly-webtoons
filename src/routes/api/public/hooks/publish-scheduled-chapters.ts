import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/hooks/publish-scheduled-chapters")({
  server: {
    handlers: {
      POST: async () => {
        const nowIso = new Date().toISOString();

        const { data, error } = await supabaseAdmin
          .from("chapters")
          .update({ published: true, released_at: nowIso })
          .eq("published", false)
          .not("scheduled_at", "is", null)
          .lte("scheduled_at", nowIso)
          .select("id, series_id, number, scheduled_at");

        if (error) {
          console.error("[auto-publish-bot] update failed", error);
          return new Response(
            JSON.stringify({ ok: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const published = data ?? [];
        console.log(`[auto-publish-bot] published ${published.length} chapter(s)`);

        return new Response(
          JSON.stringify({
            ok: true,
            published_count: published.length,
            published,
            ran_at: nowIso,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});