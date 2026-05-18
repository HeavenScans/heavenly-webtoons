import { createFileRoute, useNavigate, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — HeavenScans" },
      { name: "description", content: "Crée ton compte HeavenScans pour synchroniser tes favoris et ta progression." },
    ],
  }),
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "Min. 6 caractères").max(72),
});

function AuthPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/profile" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
            data: {
              display_name: displayName.trim() || parsed.data.email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        setInfo("Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        router.invalidate();
        navigate({ to: "/profile" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError(null);
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/profile",
    });
    if (result.error) {
      setError(result.error.message ?? "Connexion Google impossible");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    router.invalidate();
    navigate({ to: "/profile" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)]">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="mt-4 text-3xl font-black">{mode === "signin" ? "Connexion" : "Créer un compte"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin" ? "Retrouve ta bibliothèque et ta progression." : "Synchronise tes favoris et débloque le Premium."}
            </p>
          </div>

          <button
            type="button"
            onClick={google}
            disabled={loading}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5L18.4 5C16.9 3.6 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12z"/></svg>
            Continuer avec Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Pseudo (optionnel)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={40}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            )}
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              placeholder="Mot de passe (min. 6)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            {info && <p className="text-xs text-primary">{info}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-neon)] px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-neon)] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Se connecter" : "Créer le compte"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
              className="font-bold text-primary hover:underline"
            >
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            En continuant, tu acceptes nos <Link to="/terms" className="underline hover:text-foreground">Conditions</Link> et notre <Link to="/privacy" className="underline hover:text-foreground">Confidentialité</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
