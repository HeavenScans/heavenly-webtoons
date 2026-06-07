import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { runAgent, getAgentDashboard } from "@/lib/agent.functions";
import {
  Bot, Sparkles, Send, Zap, BookOpen, Calendar, Crown, Activity,
  Loader2, ShieldAlert, MessageSquare, TrendingUp, Bell, Languages, Radio,
} from "lucide-react";

export const Route = createFileRoute("/admin/ai")({
  head: () => ({ meta: [{ title: "Agent IA — HeavenScans" }, { name: "robots", content: "noindex" }] }),
  component: AiCenter,
});

type ChatMsg = { role: "user" | "assistant"; content: string; tools?: { name: string; result: string }[] };

type Dashboard = Awaited<ReturnType<typeof getAgentDashboard>>;

function AiCenter() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const dashboardFn = useServerFn(getAgentDashboard);
  const agentFn = useServerFn(runAgent);

  const [dash, setDash] = useState<Dashboard | null>(null);
  const [loadingDash, setLoadingDash] = useState(true);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", content: "Salut, je suis Astra ✨ Ton agent IA HeavenScans. Demande-moi de publier, programmer, analyser les tendances, ou donner les stats." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const loadDash = async () => {
    setLoadingDash(true);
    try {
      const d = await dashboardFn();
      setDash(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDash(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadDash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || thinking) return;
    setInput("");
    const next: ChatMsg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setThinking(true);
    try {
      const apiMsgs = next.map((m) => ({ role: m.role, content: m.content }));
      const res = await agentFn({ data: { messages: apiMsgs } });
      setMsgs((m) => [...m, { role: "assistant", content: res.reply || "(silence)", tools: res.toolEvents }]);
      if (res.toolEvents.some((t) => ["run_auto_publish", "publish_chapter_now", "schedule_chapter"].includes(t.name))) {
        loadDash();
      }
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", content: `❌ ${(e as Error).message}` }]);
    } finally {
      setThinking(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <ShieldAlert className="w-12 h-12 mx-auto text-[#F5B041] mb-4" />
          <h1 className="text-2xl font-bold">Réservé aux administrateurs</h1>
          <p className="text-white/60 mt-2">Cette interface est restreinte.</p>
          <Link to="/" className="inline-block mt-6 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/15">Retour</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const quickCmds = [
    { label: "Publier tous les scans dus", icon: Zap, prompt: "Lance maintenant l'auto-publication des chapitres programmés." },
    { label: "Donne-moi les stats", icon: TrendingUp, prompt: "Donne-moi un résumé des stats globales." },
    { label: "Tendances de la semaine", icon: Sparkles, prompt: "Analyse les tendances et propose 3 actions." },
    { label: "Chapitres programmés", icon: Calendar, prompt: "Liste les chapitres programmés à venir." },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* Cosmic bg */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-[#6D4AFF]/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-[#4DA6FF]/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[32rem] h-[32rem] rounded-full bg-[#F5B041]/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Hero */}
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6D4AFF] to-[#F5B041] blur-xl opacity-60" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6D4AFF] to-[#4DA6FF] flex items-center justify-center border border-white/20">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#F5B041]">
                <Radio className="w-3 h-3 animate-pulse" /> AI Agent online
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient-celestial">Astra Control Center</h1>
              <p className="text-white/70 mt-1 max-w-2xl text-sm sm:text-base">Ton employé IA qui publie, traduit, analyse et gère HeavenScans en autonomie.</p>
            </div>
            <button
              onClick={() => send("Lance maintenant l'auto-publication des chapitres programmés.")}
              disabled={thinking}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#4DA6FF] text-white font-semibold flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(109,74,255,0.8)] hover:opacity-90 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" /> Auto-publier
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={BookOpen} label="Séries" value={dash?.stats.series} accent="from-[#6D4AFF] to-[#4DA6FF]" />
            <StatCard icon={Activity} label="Chapitres" value={dash?.stats.chapters} accent="from-[#4DA6FF] to-[#6D4AFF]" />
            <StatCard icon={Calendar} label="Programmés" value={dash?.stats.scheduled} accent="from-[#F5B041] to-[#6D4AFF]" />
            <StatCard icon={Crown} label="Chap. Premium" value={dash?.stats.premium} accent="from-[#F5B041] to-[#4DA6FF]" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Activity & schedule */}
            <div className="xl:col-span-2 space-y-6">
              <Panel title="Flux d'activité en temps réel" icon={Activity}>
                {loadingDash ? <Skeleton /> : (
                  <ul className="divide-y divide-white/5">
                    {(dash?.recent ?? []).map((c) => (
                      <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{c.series_title} <span className="text-white/40">— Ch. {c.number}</span></div>
                          <div className="text-xs text-white/50">{new Date(c.released_at).toLocaleString("fr-FR")}</div>
                        </div>
                        <span className={`text-[10px] uppercase px-2 py-1 rounded-full border ${c.published ? "border-[#4DA6FF]/40 text-[#4DA6FF] bg-[#4DA6FF]/10" : "border-[#F5B041]/40 text-[#F5B041] bg-[#F5B041]/10"}`}>
                          {c.published ? "Publié" : "En attente"}
                        </span>
                      </li>
                    ))}
                    {(dash?.recent ?? []).length === 0 && <li className="py-6 text-center text-white/40 text-sm">Aucune activité récente.</li>}
                  </ul>
                )}
              </Panel>

              <Panel title="File de programmation" icon={Calendar}>
                {loadingDash ? <Skeleton /> : (
                  <ul className="divide-y divide-white/5">
                    {(dash?.scheduled ?? []).map((c) => (
                      <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{c.series_title} <span className="text-white/40">— Ch. {c.number}</span></div>
                          <div className="text-xs text-white/50">{c.scheduled_at ? new Date(c.scheduled_at).toLocaleString("fr-FR") : "—"}</div>
                        </div>
                        <button
                          onClick={() => send(`Publie maintenant le chapitre ${c.id}.`)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10"
                        >Publier</button>
                      </li>
                    ))}
                    {(dash?.scheduled ?? []).length === 0 && <li className="py-6 text-center text-white/40 text-sm">Aucun chapitre programmé.</li>}
                  </ul>
                )}
              </Panel>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FeatureBadge icon={Languages} title="Traduction auto" desc="7 langues, à la demande." />
                <FeatureBadge icon={Bell} title="Notifications smart" desc="Lecteurs alertés à chaque sortie." />
                <FeatureBadge icon={TrendingUp} title="Prédiction tendances" desc="Détecte ce qui va exploser." />
              </div>
            </div>

            {/* Chat */}
            <div className="glass-card rounded-3xl p-4 flex flex-col h-[640px] xl:sticky xl:top-6">
              <div className="flex items-center gap-2 px-2 pb-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D4AFF] to-[#4DA6FF] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Astra</div>
                  <div className="text-[10px] text-[#4DA6FF] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#4DA6FF] animate-pulse" /> en ligne</div>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar">
                {msgs.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                    <div className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-md px-3 py-2 bg-gradient-to-br from-[#6D4AFF] to-[#4DA6FF] text-white text-sm"
                        : "max-w-[90%] text-sm text-white/90 whitespace-pre-wrap leading-relaxed"
                    }>
                      {m.content}
                      {m.tools && m.tools.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {m.tools.map((t, j) => (
                            <details key={j} className="text-[11px] rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                              <summary className="cursor-pointer text-[#F5B041]">⚙ {t.name}</summary>
                              <pre className="mt-1 text-white/60 overflow-x-auto">{t.result}</pre>
                            </details>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Loader2 className="w-3 h-3 animate-spin" /> Astra réfléchit…
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 py-2 border-t border-white/5">
                {quickCmds.map((c) => (
                  <button key={c.label} onClick={() => send(c.prompt)} disabled={thinking}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 disabled:opacity-50">
                    <c.icon className="w-3 h-3 text-[#F5B041]" /> {c.label}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-end gap-2 pt-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Demande à Astra…"
                  rows={2}
                  className="flex-1 resize-none rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#6D4AFF]"
                />
                <button type="submit" disabled={thinking || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D4AFF] to-[#4DA6FF] flex items-center justify-center disabled:opacity-40">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | undefined; accent: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`} />
      <div className="flex items-center justify-between relative">
        <span className="text-xs uppercase tracking-widest text-white/50">{label}</span>
        <Icon className="w-4 h-4 text-[#F5B041]" />
      </div>
      <div className="text-3xl font-extrabold mt-2 relative">{value ?? "—"}</div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#4DA6FF]" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/80">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FeatureBadge({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <Icon className="w-5 h-5 text-[#F5B041] mb-2" />
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-white/50 mt-0.5">{desc}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[0,1,2].map(i => <div key={i} className="h-10 rounded-lg bg-white/5" />)}
    </div>
  );
}