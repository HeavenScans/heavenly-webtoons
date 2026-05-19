import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { usePremium } from "@/hooks/usePremium";
import { useRole } from "@/hooks/useRole";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Crown, Heart, LogOut, Loader2, Save, User as UserIcon, Upload, ShieldCheck } from "lucide-react";
import { supabase as sb } from "@/integrations/supabase/client";

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
  const { isTeam } = useRole();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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
      .select("display_name, username, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
        setUsername(data?.username ?? "");
        setAvatarUrl(data?.avatar_url ?? null);
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
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);
    setSaving(false);
    if (!error) setSavedAt(Date.now());
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploadingAvatar(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await sb.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { alert(error.message); setUploadingAvatar(false); return; }
    const { data: pub } = sb.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(pub.publicUrl);
    await sb.from("profiles").update({ avatar_url: pub.publicUrl }).eq("id", user.id);
    setUploadingAvatar(false);
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
          <label className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-2xl shadow-[var(--shadow-glow)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-[image:var(--gradient-hero)] text-2xl font-black text-primary-foreground">
                {(displayName || user.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 hover:opacity-100 transition">
              {uploadingAvatar ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Upload className="h-5 w-5 text-white" />}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
          </label>
          <div className="min-w-0">
            <h1 className="text-3xl font-black truncate">{displayName || user.email}</h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
          {isTeam && (
            <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--neon-blue)]/50 bg-[image:var(--gradient-neon)] px-3 py-2 text-sm font-semibold text-white shadow-[var(--shadow-neon)]">
              <ShieldCheck className="h-4 w-4" /> Admin
            </Link>
          )}
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
          </div>
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
