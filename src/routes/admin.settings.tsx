import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Loader2, ShieldAlert, Save, Settings2, Sparkles, Wrench, CreditCard, Languages, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Paramètres — Admin HeavenScans" }, { name: "robots", content: "noindex" }] }),
  component: AdminSettingsPage,
});

type Branding = { site_name: string; tagline: string; contact_email: string; discord_url: string };
type Features = { maintenance_mode: boolean; allow_signups: boolean; comments_enabled: boolean; ratings_enabled: boolean; auto_publish_bot: boolean };
type Premium = { reader_price: number; premium_price: number; ultimate_price: number; currency: string };
type Translation = { pack_starter_credits: number; pack_starter_price: number; pack_boost_credits: number; pack_boost_price: number; pack_max_credits: number; pack_max_price: number };

function AdminSettingsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const { settings, loading, save } = useSiteSettings();

  useEffect(() => { if (!authLoading && !user) navigate({ to: "/auth" }); }, [authLoading, user, navigate]);

  if (authLoading || roleLoading || loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-3xl font-black">Accès administrateur requis</h1>
          <p className="mt-2 text-muted-foreground">Seuls les administrateurs peuvent modifier les paramètres du site.</p>
          <Link to="/admin" className="mt-6 inline-block text-primary">← Retour à l'admin</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3" /> Admin</Link>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-primary">Configuration globale</p>
            <h1 className="text-3xl sm:text-4xl font-black inline-flex items-center gap-3"><Settings2 className="h-8 w-8 text-primary" /> Paramètres du site</h1>
            <p className="mt-1 text-sm text-muted-foreground">Modifie l'identité, les fonctionnalités et les tarifs sans toucher au code.</p>
          </div>
        </div>

        <div className="space-y-6">
          <BrandingCard initial={(settings.branding ?? {}) as unknown as Branding} onSave={(v) => save("branding", v as unknown as Record<string, unknown>)} />
          <FeaturesCard initial={(settings.features ?? {}) as unknown as Features} onSave={(v) => save("features", v as unknown as Record<string, unknown>)} />
          <PremiumCard initial={(settings.premium ?? {}) as unknown as Premium} onSave={(v) => save("premium", v as unknown as Record<string, unknown>)} />
          <TranslationCard initial={(settings.translation ?? {}) as unknown as Translation} onSave={(v) => save("translation", v as unknown as Record<string, unknown>)} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Card({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <header className="mb-5 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#6D4AFF]/20 to-[#4DA6FF]/20 text-primary">{icon}</div>
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-background/50 p-3">
      <div>
        <p className="font-semibold text-sm">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${checked ? "bg-primary" : "bg-muted"}`}
        aria-pressed={checked}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SaveBar({ dirty, saving, saved, onSave }: { dirty: boolean; saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="mt-5 flex items-center justify-end gap-3">
      {saved && <span className="inline-flex items-center gap-1 text-xs text-emerald-500"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré</span>}
      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6D4AFF] to-[#4DA6FF] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(109,74,255,0.7)] disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Enregistrer
      </button>
    </div>
  );
}

function useDirtyForm<T extends Record<string, unknown>>(initial: T, onSave: (v: T) => Promise<void> | void) {
  const [state, setState] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const initialStr = useMemo(() => JSON.stringify(initial), [initial]);
  useEffect(() => { setState(initial); /* reset when initial changes */ /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [initialStr]);
  const dirty = JSON.stringify(state) !== initialStr;
  const save = async () => {
    setSaving(true); setSaved(false);
    try { await onSave(state); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { alert((e as Error).message); }
    finally { setSaving(false); }
  };
  return { state, setState, dirty, saving, saved, save };
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function BrandingCard({ initial, onSave }: { initial: Branding; onSave: (v: Branding) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Branding>(
    { site_name: initial.site_name ?? "HeavenScans", tagline: initial.tagline ?? "", contact_email: initial.contact_email ?? "", discord_url: initial.discord_url ?? "" },
    onSave,
  );
  return (
    <Card icon={<Sparkles className="h-5 w-5" />} title="Identité" description="Nom du site, contact et communauté.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom du site"><input className={inputCls} value={state.site_name} onChange={(e) => setState({ ...state, site_name: e.target.value })} /></Field>
        <Field label="Slogan"><input className={inputCls} value={state.tagline} onChange={(e) => setState({ ...state, tagline: e.target.value })} /></Field>
        <Field label="Email de contact"><input type="email" className={inputCls} value={state.contact_email} onChange={(e) => setState({ ...state, contact_email: e.target.value })} /></Field>
        <Field label="Lien Discord"><input type="url" className={inputCls} value={state.discord_url} onChange={(e) => setState({ ...state, discord_url: e.target.value })} /></Field>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function FeaturesCard({ initial, onSave }: { initial: Features; onSave: (v: Features) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Features>(
    {
      maintenance_mode: !!initial.maintenance_mode,
      allow_signups: initial.allow_signups ?? true,
      comments_enabled: initial.comments_enabled ?? true,
      ratings_enabled: initial.ratings_enabled ?? true,
      auto_publish_bot: initial.auto_publish_bot ?? true,
    },
    onSave,
  );
  return (
    <Card icon={<Wrench className="h-5 w-5" />} title="Fonctionnalités" description="Active ou coupe les modules du site.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Mode maintenance" description="Affiche une page de maintenance aux visiteurs." checked={state.maintenance_mode} onChange={(v) => setState({ ...state, maintenance_mode: v })} />
        <Toggle label="Inscriptions ouvertes" description="Autoriser la création de nouveaux comptes." checked={state.allow_signups} onChange={(v) => setState({ ...state, allow_signups: v })} />
        <Toggle label="Commentaires" description="Section commentaires sur les séries." checked={state.comments_enabled} onChange={(v) => setState({ ...state, comments_enabled: v })} />
        <Toggle label="Notes / étoiles" description="Système d'évaluation par étoiles." checked={state.ratings_enabled} onChange={(v) => setState({ ...state, ratings_enabled: v })} />
        <Toggle label="Bot auto-publication" description="Publie les chapitres programmés toutes les 5 min." checked={state.auto_publish_bot} onChange={(v) => setState({ ...state, auto_publish_bot: v })} />
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function PremiumCard({ initial, onSave }: { initial: Premium; onSave: (v: Premium) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Premium>(
    { reader_price: Number(initial.reader_price ?? 0), premium_price: Number(initial.premium_price ?? 14), ultimate_price: Number(initial.ultimate_price ?? 35), currency: initial.currency ?? "EUR" },
    onSave,
  );
  return (
    <Card icon={<CreditCard className="h-5 w-5" />} title="Tarifs premium" description="Prix affichés sur la page Premium.">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Reader"><input type="number" min="0" className={inputCls} value={state.reader_price} onChange={(e) => setState({ ...state, reader_price: Number(e.target.value) })} /></Field>
        <Field label="Premium"><input type="number" min="0" className={inputCls} value={state.premium_price} onChange={(e) => setState({ ...state, premium_price: Number(e.target.value) })} /></Field>
        <Field label="Ultimate"><input type="number" min="0" className={inputCls} value={state.ultimate_price} onChange={(e) => setState({ ...state, ultimate_price: Number(e.target.value) })} /></Field>
        <Field label="Devise"><input className={inputCls} value={state.currency} onChange={(e) => setState({ ...state, currency: e.target.value.toUpperCase() })} /></Field>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function TranslationCard({ initial, onSave }: { initial: Translation; onSave: (v: Translation) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Translation>(
    {
      pack_starter_credits: Number(initial.pack_starter_credits ?? 5),
      pack_starter_price: Number(initial.pack_starter_price ?? 2),
      pack_boost_credits: Number(initial.pack_boost_credits ?? 15),
      pack_boost_price: Number(initial.pack_boost_price ?? 5),
      pack_max_credits: Number(initial.pack_max_credits ?? 40),
      pack_max_price: Number(initial.pack_max_price ?? 12),
    },
    onSave,
  );
  const row = (name: string, credKey: keyof Translation, priceKey: keyof Translation) => (
    <div className="grid grid-cols-[1fr_auto_auto] items-end gap-3">
      <div className="text-sm font-semibold">{name}</div>
      <Field label="Crédits"><input type="number" min="1" className={`${inputCls} w-24`} value={state[credKey] as number} onChange={(e) => setState({ ...state, [credKey]: Number(e.target.value) })} /></Field>
      <Field label="Prix (€)"><input type="number" min="0" step="0.5" className={`${inputCls} w-24`} value={state[priceKey] as number} onChange={(e) => setState({ ...state, [priceKey]: Number(e.target.value) })} /></Field>
    </div>
  );
  return (
    <Card icon={<Languages className="h-5 w-5" />} title="Packs de traduction" description="Configure les crédits vendus pour la traduction IA.">
      <div className="space-y-3">
        {row("Starter", "pack_starter_credits", "pack_starter_price")}
        {row("Boost", "pack_boost_credits", "pack_boost_price")}
        {row("Max", "pack_max_credits", "pack_max_price")}
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}