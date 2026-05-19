import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const staticPaths = [
          "/", "/series", "/genres", "/latest", "/library",
          "/premium", "/about", "/contact", "/faq",
          "/terms", "/privacy", "/dmca",
        ];
        let dynamic: { slug: string; updated_at: string }[] = [];
        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (url && key) {
          try {
            const sb = createClient(url, key);
            const { data } = await sb.from("series").select("slug, updated_at").eq("published", true);
            dynamic = (data ?? []) as any;
          } catch {}
        }
        const urls = [
          ...staticPaths.map((p) => `<url><loc>${origin}${p}</loc></url>`),
          ...dynamic.map((s) => `<url><loc>${origin}/series/${s.slug}</loc><lastmod>${new Date(s.updated_at).toISOString()}</lastmod></url>`),
        ].join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/sitemaps/0.9">${urls}</urlset>`;
        return new Response(xml, { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});