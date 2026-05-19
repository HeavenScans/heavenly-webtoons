import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type CommentRow = {
  id: string;
  user_id: string;
  series_slug: string;
  chapter_number: string | null;
  body: string;
  created_at: string;
  author?: { display_name: string | null; username: string | null; avatar_url: string | null } | null;
};

export function Comments({ slug, chapter }: { slug: string; chapter?: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CommentRow[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("comments")
      .select("id, user_id, series_slug, chapter_number, body, created_at")
      .eq("series_slug", slug)
      .order("created_at", { ascending: false })
      .limit(100);
    if (chapter) q = q.eq("chapter_number", chapter);
    const { data } = await q;
    const list = (data ?? []) as CommentRow[];
    const ids = Array.from(new Set(list.map((c) => c.user_id)));
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", ids);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => (map[p.id] = p));
      list.forEach((c) => (c.author = map[c.user_id] ?? null));
    }
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, chapter]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setSending(true);
    await supabase.from("comments").insert({
      user_id: user.id,
      series_slug: slug,
      chapter_number: chapter ?? null,
      body: body.trim().slice(0, 2000),
    });
    setBody("");
    setSending(false);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    load();
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black mb-4 inline-flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" /> Commentaires
        <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
      </h2>
      {user ? (
        <form onSubmit={send} className="rounded-2xl border border-border bg-card p-4 mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Partage ton avis…"
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">{body.length}/2000</div>
            <button
              disabled={sending || !body.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-neon)] px-3 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              Publier
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-4 mb-6 text-sm text-muted-foreground">
          <Link to="/auth" className="text-primary font-semibold">Connecte-toi</Link> pour participer aux discussions.
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucun commentaire — sois le premier !
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => {
            const name = c.author?.display_name || c.author?.username || "Lecteur";
            const initial = name.charAt(0).toUpperCase();
            const canDelete = user && c.user_id === user.id;
            return (
              <li key={c.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  {c.author?.avatar_url ? (
                    <img src={c.author.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[image:var(--gradient-hero)] text-xs font-black text-primary-foreground">{initial}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{name}</div>
                    <div className="text-[11px] text-muted-foreground">{new Date(c.created_at).toLocaleString("fr-FR")}</div>
                  </div>
                  {canDelete && (
                    <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{c.body}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}