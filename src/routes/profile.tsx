import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { usePremium } from "@/hooks/usePremium";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Crown, Heart, LogOut, Loader2, Save, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Mon profil — HeavenScans" },
      { name: "description", content: "Gère ton compte HeavenScans, ta progression et ton abonnement Premium." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { list: favorites } = useFavorites();
  const { active: isPremium, tier } = usePremium();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
        setUsername(data?.username ?? "");
        setProfileLoaded(true);
      });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        username: username.trim() || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (!error) setSavedAt(Date.now());
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-6 py-12 space-y-8">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-hero)] text-2xl font-black text-primary-foreground shadow-[var(--shadow-glow)]">
            {(displayName || user.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-black truncate">{displayName || user.email}</h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/library" className="rounded-2xl border border-border bg-card p-5 hover:border-primary transition-colors">
            <Heart className="h-5 w-5 text-primary" />
            <div className="mt-2 text-2xl font-black">{favorites.length}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Favoris</div>
          </Link>
          <Link to="/premium" className="rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-5 backdrop-blur hover:border-[color:var(--neon-blue)] transition-colors">
            <Crown className="h-5 w-5 text-[color:var(--neon-blue)]" />
            <div className="mt-2 text-2xl font-black">
              {isPremium ? (tier === "ultimate" ? "Ultimate" : "Premium") : "Free"}
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Abonnement</div>
          </Link>
          <div className="rounded-2xl border border-border bg-card p-5">
            <UserIcon className="h-5 w-5 text-primary" />
            <div className="mt-2 text-2xl font-black">
              {new Date(user.created_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Membre depuis</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold">Informations du profil</h2>
            <p className="text-sm text-muted-foreground">Personnalise comment tu apparais sur HeavenScans.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pseudo affiché</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={40}
                disabled={!profileLoaded}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom d'utilisateur</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                maxLength={30}
                disabled={!profileLoaded}
                placeholder="ex: shadow_reader"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={saving || !profileLoaded}
              className="inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-neon)] px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer
            </button>
            {savedAt && <span className="text-xs text-muted-foreground">Enregistré ✓</span>}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
