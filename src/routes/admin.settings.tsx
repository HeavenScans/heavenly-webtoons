import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import {
  Loader2, ShieldAlert, Save, Settings2, Sparkles, Wrench, CreditCard, Languages, Info,
  ArrowLeft, CheckCircle2, Search, Share2, BarChart3, Plug, Mail, ShieldCheck,
  Scale, LayoutDashboard, Megaphone, Palette, Gauge, HardDrive, AlertTriangle,
  BookOpen, Bell, UserPlus, Trash2, Crown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Paramètres — Admin HeavenScans" }, { name: "robots", content: "noindex" }] }),
  component: AdminSettingsPage,
});

type Branding = { site_name: string; tagline: string; contact_email: string; discord_url: string };
type Features = { maintenance_mode: boolean; allow_signups: boolean; comments_enabled: boolean; ratings_enabled: boolean; auto_publish_bot: boolean };
type Premium = { reader_price: number; premium_price: number; ultimate_price: number; currency: string };
type Translation = { pack_starter_credits: number; pack_starter_price: number; pack_boost_credits: number; pack_boost_price: number; pack_max_credits: number; pack_max_price: number };
type Seo = { default_title: string; default_description: string; og_image_url: string; keywords: string; twitter_handle: string };
type Social = { twitter: string; instagram: string; tiktok: string; youtube: string; facebook: string; reddit: string };
type Analytics = { ga_measurement_id: string; plausible_domain: string; posthog_key: string; cookie_banner: boolean };
type Integrations = { discord_webhook_url: string; telegram_bot_token: string; telegram_chat_id: string; stripe_enabled: boolean; sendgrid_from: string };
type Notifications = { email_new_chapter: boolean; email_weekly_digest: boolean; push_enabled: boolean; discord_ping_new_chapter: boolean };
type Content = { mature_content_allowed: boolean; require_login_to_read: boolean; auto_moderate_comments: boolean; forbidden_words: string; default_series_status: string };
type Legal = { terms_url: string; privacy_url: string; dmca_email: string; company_name: string; company_address: string };
type Homepage = { show_hero: boolean; show_genres: boolean; show_popular: boolean; show_latest: boolean; show_favorites: boolean; show_stats: boolean; show_faq: boolean; show_discord: boolean };
type Announcement = { enabled: boolean; message: string; level: string; link_url: string; link_label: string };
type Theme = { primary: string; accent: string; background: string; gold: string };
type Reader = { default_direction: string; default_quality: string; preload_pages: number; infinite_scroll: boolean };
type Security = { rate_limit_rpm: number; max_upload_mb: number; block_vpn: boolean; require_email_verification: boolean };
type Storage = { covers_bucket: string; pages_bucket: string; cdn_url: string; max_pages_per_chapter: number };

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

        <AdminGuideCard />
        <div className="space-y-6">
          <BrandingCard initial={(settings.branding ?? {}) as unknown as Branding} onSave={(v) => save("branding", v as unknown as Record<string, unknown>)} />
          <SeoCard initial={(settings.seo ?? {}) as unknown as Seo} onSave={(v) => save("seo", v as unknown as Record<string, unknown>)} />
          <SocialCard initial={(settings.social ?? {}) as unknown as Social} onSave={(v) => save("social", v as unknown as Record<string, unknown>)} />
          <AnalyticsCard initial={(settings.analytics ?? {}) as unknown as Analytics} onSave={(v) => save("analytics", v as unknown as Record<string, unknown>)} />
          <IntegrationsCard initial={(settings.integrations ?? {}) as unknown as Integrations} onSave={(v) => save("integrations", v as unknown as Record<string, unknown>)} />
          <NotificationsCard initial={(settings.notifications ?? {}) as unknown as Notifications} onSave={(v) => save("notifications", v as unknown as Record<string, unknown>)} />
          <ContentCard initial={(settings.content ?? {}) as unknown as Content} onSave={(v) => save("content", v as unknown as Record<string, unknown>)} />
          <ReaderCard initial={(settings.reader ?? {}) as unknown as Reader} onSave={(v) => save("reader", v as unknown as Record<string, unknown>)} />
          <HomepageCard initial={(settings.homepage ?? {}) as unknown as Homepage} onSave={(v) => save("homepage", v as unknown as Record<string, unknown>)} />
          <AnnouncementCard initial={(settings.announcement ?? {}) as unknown as Announcement} onSave={(v) => save("announcement", v as unknown as Record<string, unknown>)} />
          <ThemeCard initial={(settings.theme ?? {}) as unknown as Theme} onSave={(v) => save("theme", v as unknown as Record<string, unknown>)} />
          <LegalCard initial={(settings.legal ?? {}) as unknown as Legal} onSave={(v) => save("legal", v as unknown as Record<string, unknown>)} />
          <SecurityCard initial={(settings.security ?? {}) as unknown as Security} onSave={(v) => save("security", v as unknown as Record<string, unknown>)} />
          <StorageCard initial={(settings.storage ?? {}) as unknown as Storage} onSave={(v) => save("storage", v as unknown as Record<string, unknown>)} />
          <FeaturesCard initial={(settings.features ?? {}) as unknown as Features} onSave={(v) => save("features", v as unknown as Record<string, unknown>)} />
          <PremiumCard initial={(settings.premium ?? {}) as unknown as Premium} onSave={(v) => save("premium", v as unknown as Record<string, unknown>)} />
          <TranslationCard initial={(settings.translation ?? {}) as unknown as Translation} onSave={(v) => save("translation", v as unknown as Record<string, unknown>)} />
          <AdminsCard currentUserId={user?.id ?? null} />
          <DangerZone />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AdminGuideCard() {
  return (
    <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
      <header className="mb-4 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Guide rapide — Gestion des administrateurs</h2>
          <p className="text-sm text-muted-foreground">Comment ajouter ou retirer un admin en 3 étapes.</p>
        </div>
      </header>
      <ol className="grid gap-4 sm:grid-cols-3">
        <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
          <div>
            <p className="text-sm font-semibold">Descends jusqu'en bas</p>
            <p className="text-xs text-muted-foreground">Fais défiler la page jusqu'à la carte <strong className="text-foreground">Administrateurs</strong>.</p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
          <div>
            <p className="text-sm font-semibold">Recherche l'utilisateur</p>
            <p className="text-xs text-muted-foreground">Tape son pseudo dans le champ de recherche. L'utilisateur doit déjà avoir un compte.</p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
          <div>
            <p className="text-sm font-semibold">Choisis le rôle</p>
            <p className="text-xs text-muted-foreground">Clique sur <strong className="text-foreground">Admin</strong> <ShieldCheck className="inline h-3 w-3" /> ou <strong className="text-foreground">Super</strong> <Crown className="inline h-3 w-3" /> pour l'attribuer.</p>
          </div>
        </li>
      </ol>
      <p className="mt-4 text-xs text-muted-foreground">Pour retirer un rôle, utilise la corbeille à droite de la ligne dans la liste des admins actuels.</p>
    </section>
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

function SeoCard({ initial, onSave }: { initial: Seo; onSave: (v: Seo) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Seo>(
    {
      default_title: initial.default_title ?? "HeavenScans — Manga & Webtoons",
      default_description: initial.default_description ?? "",
      og_image_url: initial.og_image_url ?? "",
      keywords: initial.keywords ?? "",
      twitter_handle: initial.twitter_handle ?? "",
    },
    onSave,
  );
  return (
    <Card icon={<Search className="h-5 w-5" />} title="SEO & partage social" description="Titres, descriptions et image OpenGraph par défaut.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Titre par défaut"><input className={inputCls} value={state.default_title} onChange={(e) => setState({ ...state, default_title: e.target.value })} /></Field>
        <Field label="Handle Twitter (@…)"><input className={inputCls} value={state.twitter_handle} onChange={(e) => setState({ ...state, twitter_handle: e.target.value })} /></Field>
        <Field label="Description par défaut"><textarea rows={2} className={inputCls} value={state.default_description} onChange={(e) => setState({ ...state, default_description: e.target.value })} /></Field>
        <Field label="Image OG (URL absolue https)"><input className={inputCls} value={state.og_image_url} onChange={(e) => setState({ ...state, og_image_url: e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Mots-clés (séparés par virgules)"><input className={inputCls} value={state.keywords} onChange={(e) => setState({ ...state, keywords: e.target.value })} /></Field></div>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function SocialCard({ initial, onSave }: { initial: Social; onSave: (v: Social) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Social>(
    { twitter: initial.twitter ?? "", instagram: initial.instagram ?? "", tiktok: initial.tiktok ?? "", youtube: initial.youtube ?? "", facebook: initial.facebook ?? "", reddit: initial.reddit ?? "" },
    onSave,
  );
  const f = (k: keyof Social, label: string) => (
    <Field label={label}><input className={inputCls} placeholder="https://…" value={state[k]} onChange={(e) => setState({ ...state, [k]: e.target.value })} /></Field>
  );
  return (
    <Card icon={<Share2 className="h-5 w-5" />} title="Réseaux sociaux" description="Liens affichés dans le footer et le header.">
      <div className="grid gap-4 sm:grid-cols-2">
        {f("twitter", "Twitter / X")}
        {f("instagram", "Instagram")}
        {f("tiktok", "TikTok")}
        {f("youtube", "YouTube")}
        {f("facebook", "Facebook")}
        {f("reddit", "Reddit")}
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function AnalyticsCard({ initial, onSave }: { initial: Analytics; onSave: (v: Analytics) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Analytics>(
    { ga_measurement_id: initial.ga_measurement_id ?? "", plausible_domain: initial.plausible_domain ?? "", posthog_key: initial.posthog_key ?? "", cookie_banner: initial.cookie_banner ?? true },
    onSave,
  );
  return (
    <Card icon={<BarChart3 className="h-5 w-5" />} title="Analytics & tracking" description="Mesure d'audience et bannière cookies RGPD.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Google Analytics ID (G-…)"><input className={inputCls} value={state.ga_measurement_id} onChange={(e) => setState({ ...state, ga_measurement_id: e.target.value })} /></Field>
        <Field label="Plausible domaine"><input className={inputCls} value={state.plausible_domain} onChange={(e) => setState({ ...state, plausible_domain: e.target.value })} /></Field>
        <Field label="PostHog clé publique"><input className={inputCls} value={state.posthog_key} onChange={(e) => setState({ ...state, posthog_key: e.target.value })} /></Field>
        <div className="pt-6"><Toggle label="Bannière cookies" description="Afficher le consentement RGPD." checked={state.cookie_banner} onChange={(v) => setState({ ...state, cookie_banner: v })} /></div>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function IntegrationsCard({ initial, onSave }: { initial: Integrations; onSave: (v: Integrations) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Integrations>(
    {
      discord_webhook_url: initial.discord_webhook_url ?? "",
      telegram_bot_token: initial.telegram_bot_token ?? "",
      telegram_chat_id: initial.telegram_chat_id ?? "",
      stripe_enabled: initial.stripe_enabled ?? false,
      sendgrid_from: initial.sendgrid_from ?? "",
    },
    onSave,
  );
  return (
    <Card icon={<Plug className="h-5 w-5" />} title="Intégrations plateformes" description="Webhooks, bots et services externes.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label="Webhook Discord (annonce nouveau chapitre)"><input className={inputCls} placeholder="https://discord.com/api/webhooks/…" value={state.discord_webhook_url} onChange={(e) => setState({ ...state, discord_webhook_url: e.target.value })} /></Field></div>
        <Field label="Bot Telegram token"><input className={inputCls} value={state.telegram_bot_token} onChange={(e) => setState({ ...state, telegram_bot_token: e.target.value })} /></Field>
        <Field label="Telegram chat ID"><input className={inputCls} value={state.telegram_chat_id} onChange={(e) => setState({ ...state, telegram_chat_id: e.target.value })} /></Field>
        <Field label="Expéditeur SendGrid / Resend"><input className={inputCls} placeholder="noreply@heavenscans.com" value={state.sendgrid_from} onChange={(e) => setState({ ...state, sendgrid_from: e.target.value })} /></Field>
        <div className="pt-6"><Toggle label="Paiements Stripe" description="Activer le tunnel Premium." checked={state.stripe_enabled} onChange={(v) => setState({ ...state, stripe_enabled: v })} /></div>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function NotificationsCard({ initial, onSave }: { initial: Notifications; onSave: (v: Notifications) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Notifications>(
    {
      email_new_chapter: initial.email_new_chapter ?? true,
      email_weekly_digest: initial.email_weekly_digest ?? false,
      push_enabled: initial.push_enabled ?? false,
      discord_ping_new_chapter: initial.discord_ping_new_chapter ?? true,
    },
    onSave,
  );
  return (
    <Card icon={<Bell className="h-5 w-5" />} title="Notifications" description="Emails et push envoyés aux lecteurs.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Email nouveau chapitre" checked={state.email_new_chapter} onChange={(v) => setState({ ...state, email_new_chapter: v })} />
        <Toggle label="Digest hebdomadaire" checked={state.email_weekly_digest} onChange={(v) => setState({ ...state, email_weekly_digest: v })} />
        <Toggle label="Notifications push navigateur" checked={state.push_enabled} onChange={(v) => setState({ ...state, push_enabled: v })} />
        <Toggle label="Ping Discord automatique" checked={state.discord_ping_new_chapter} onChange={(v) => setState({ ...state, discord_ping_new_chapter: v })} />
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function ContentCard({ initial, onSave }: { initial: Content; onSave: (v: Content) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Content>(
    {
      mature_content_allowed: initial.mature_content_allowed ?? true,
      require_login_to_read: initial.require_login_to_read ?? false,
      auto_moderate_comments: initial.auto_moderate_comments ?? true,
      forbidden_words: initial.forbidden_words ?? "",
      default_series_status: initial.default_series_status ?? "ongoing",
    },
    onSave,
  );
  return (
    <Card icon={<ShieldCheck className="h-5 w-5" />} title="Politique de contenu" description="Modération et règles éditoriales.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Autoriser contenu mature" checked={state.mature_content_allowed} onChange={(v) => setState({ ...state, mature_content_allowed: v })} />
        <Toggle label="Lecture réservée aux membres" checked={state.require_login_to_read} onChange={(v) => setState({ ...state, require_login_to_read: v })} />
        <Toggle label="Modération auto commentaires" checked={state.auto_moderate_comments} onChange={(v) => setState({ ...state, auto_moderate_comments: v })} />
        <Field label="Statut par défaut nouvelles séries">
          <select className={inputCls} value={state.default_series_status} onChange={(e) => setState({ ...state, default_series_status: e.target.value })}>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminé</option>
            <option value="hiatus">Pause</option>
          </select>
        </Field>
        <div className="sm:col-span-2"><Field label="Mots bannis (séparés par virgules)"><textarea rows={2} className={inputCls} value={state.forbidden_words} onChange={(e) => setState({ ...state, forbidden_words: e.target.value })} /></Field></div>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function ReaderCard({ initial, onSave }: { initial: Reader; onSave: (v: Reader) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Reader>(
    {
      default_direction: initial.default_direction ?? "vertical",
      default_quality: initial.default_quality ?? "high",
      preload_pages: Number(initial.preload_pages ?? 3),
      infinite_scroll: initial.infinite_scroll ?? true,
    },
    onSave,
  );
  return (
    <Card icon={<BookOpen className="h-5 w-5" />} title="Lecteur" description="Comportement par défaut du reader.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Direction par défaut">
          <select className={inputCls} value={state.default_direction} onChange={(e) => setState({ ...state, default_direction: e.target.value })}>
            <option value="vertical">Vertical (webtoon)</option>
            <option value="ltr">Gauche → droite</option>
            <option value="rtl">Droite → gauche (manga)</option>
          </select>
        </Field>
        <Field label="Qualité images">
          <select className={inputCls} value={state.default_quality} onChange={(e) => setState({ ...state, default_quality: e.target.value })}>
            <option value="low">Basse (data saver)</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="original">Originale</option>
          </select>
        </Field>
        <Field label="Pages préchargées"><input type="number" min="0" max="10" className={inputCls} value={state.preload_pages} onChange={(e) => setState({ ...state, preload_pages: Number(e.target.value) })} /></Field>
        <div className="pt-6"><Toggle label="Scroll infini" checked={state.infinite_scroll} onChange={(v) => setState({ ...state, infinite_scroll: v })} /></div>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function HomepageCard({ initial, onSave }: { initial: Homepage; onSave: (v: Homepage) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Homepage>(
    {
      show_hero: initial.show_hero ?? true,
      show_genres: initial.show_genres ?? true,
      show_popular: initial.show_popular ?? true,
      show_latest: initial.show_latest ?? true,
      show_favorites: initial.show_favorites ?? true,
      show_stats: initial.show_stats ?? true,
      show_faq: initial.show_faq ?? true,
      show_discord: initial.show_discord ?? true,
    },
    onSave,
  );
  return (
    <Card icon={<LayoutDashboard className="h-5 w-5" />} title="Sections de la homepage" description="Affiche ou masque chaque bloc de la page d'accueil.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Hero céleste" checked={state.show_hero} onChange={(v) => setState({ ...state, show_hero: v })} />
        <Toggle label="Genres" checked={state.show_genres} onChange={(v) => setState({ ...state, show_genres: v })} />
        <Toggle label="Populaires cette semaine" checked={state.show_popular} onChange={(v) => setState({ ...state, show_popular: v })} />
        <Toggle label="Derniers chapitres" checked={state.show_latest} onChange={(v) => setState({ ...state, show_latest: v })} />
        <Toggle label="Favoris des lecteurs" checked={state.show_favorites} onChange={(v) => setState({ ...state, show_favorites: v })} />
        <Toggle label="Stats communauté" checked={state.show_stats} onChange={(v) => setState({ ...state, show_stats: v })} />
        <Toggle label="FAQ" checked={state.show_faq} onChange={(v) => setState({ ...state, show_faq: v })} />
        <Toggle label="Bloc Discord" checked={state.show_discord} onChange={(v) => setState({ ...state, show_discord: v })} />
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function AnnouncementCard({ initial, onSave }: { initial: Announcement; onSave: (v: Announcement) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Announcement>(
    {
      enabled: initial.enabled ?? false,
      message: initial.message ?? "",
      level: initial.level ?? "info",
      link_url: initial.link_url ?? "",
      link_label: initial.link_label ?? "",
    },
    onSave,
  );
  return (
    <Card icon={<Megaphone className="h-5 w-5" />} title="Bannière d'annonce" description="Message global affiché en haut du site.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="pt-1"><Toggle label="Activer la bannière" checked={state.enabled} onChange={(v) => setState({ ...state, enabled: v })} /></div>
        <Field label="Niveau">
          <select className={inputCls} value={state.level} onChange={(e) => setState({ ...state, level: e.target.value })}>
            <option value="info">Info</option>
            <option value="success">Succès</option>
            <option value="warning">Attention</option>
            <option value="danger">Urgent</option>
          </select>
        </Field>
        <div className="sm:col-span-2"><Field label="Message"><input className={inputCls} value={state.message} onChange={(e) => setState({ ...state, message: e.target.value })} /></Field></div>
        <Field label="Lien"><input className={inputCls} value={state.link_url} onChange={(e) => setState({ ...state, link_url: e.target.value })} /></Field>
        <Field label="Libellé du lien"><input className={inputCls} value={state.link_label} onChange={(e) => setState({ ...state, link_label: e.target.value })} /></Field>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function ThemeCard({ initial, onSave }: { initial: Theme; onSave: (v: Theme) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Theme>(
    { primary: initial.primary ?? "#6D4AFF", accent: initial.accent ?? "#4DA6FF", background: initial.background ?? "#050816", gold: initial.gold ?? "#F5B041" },
    onSave,
  );
  const color = (k: keyof Theme, label: string) => (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input type="color" className="h-10 w-14 cursor-pointer rounded border border-border bg-background" value={state[k]} onChange={(e) => setState({ ...state, [k]: e.target.value })} />
        <input className={inputCls} value={state[k]} onChange={(e) => setState({ ...state, [k]: e.target.value })} />
      </div>
    </Field>
  );
  return (
    <Card icon={<Palette className="h-5 w-5" />} title="Thème & couleurs" description="Palette céleste utilisée sur tout le site.">
      <div className="grid gap-4 sm:grid-cols-2">
        {color("primary", "Violet royal")}
        {color("accent", "Bleu céleste")}
        {color("background", "Fond profond")}
        {color("gold", "Or divin")}
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function LegalCard({ initial, onSave }: { initial: Legal; onSave: (v: Legal) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Legal>(
    {
      terms_url: initial.terms_url ?? "/terms",
      privacy_url: initial.privacy_url ?? "/privacy",
      dmca_email: initial.dmca_email ?? "",
      company_name: initial.company_name ?? "",
      company_address: initial.company_address ?? "",
    },
    onSave,
  );
  return (
    <Card icon={<Scale className="h-5 w-5" />} title="Mentions légales" description="Infos entreprise et pages légales.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom légal"><input className={inputCls} value={state.company_name} onChange={(e) => setState({ ...state, company_name: e.target.value })} /></Field>
        <Field label="Email DMCA"><input className={inputCls} value={state.dmca_email} onChange={(e) => setState({ ...state, dmca_email: e.target.value })} /></Field>
        <Field label="URL Conditions"><input className={inputCls} value={state.terms_url} onChange={(e) => setState({ ...state, terms_url: e.target.value })} /></Field>
        <Field label="URL Confidentialité"><input className={inputCls} value={state.privacy_url} onChange={(e) => setState({ ...state, privacy_url: e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Adresse"><textarea rows={2} className={inputCls} value={state.company_address} onChange={(e) => setState({ ...state, company_address: e.target.value })} /></Field></div>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function SecurityCard({ initial, onSave }: { initial: Security; onSave: (v: Security) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Security>(
    {
      rate_limit_rpm: Number(initial.rate_limit_rpm ?? 120),
      max_upload_mb: Number(initial.max_upload_mb ?? 25),
      block_vpn: initial.block_vpn ?? false,
      require_email_verification: initial.require_email_verification ?? true,
    },
    onSave,
  );
  return (
    <Card icon={<Gauge className="h-5 w-5" />} title="Sécurité & limites" description="Rate-limit, uploads et vérifications.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Requêtes / minute / IP"><input type="number" min="10" className={inputCls} value={state.rate_limit_rpm} onChange={(e) => setState({ ...state, rate_limit_rpm: Number(e.target.value) })} /></Field>
        <Field label="Upload max (Mo)"><input type="number" min="1" className={inputCls} value={state.max_upload_mb} onChange={(e) => setState({ ...state, max_upload_mb: Number(e.target.value) })} /></Field>
        <Toggle label="Bloquer VPN/Proxy" checked={state.block_vpn} onChange={(v) => setState({ ...state, block_vpn: v })} />
        <Toggle label="Vérification email obligatoire" checked={state.require_email_verification} onChange={(v) => setState({ ...state, require_email_verification: v })} />
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function StorageCard({ initial, onSave }: { initial: Storage; onSave: (v: Storage) => Promise<void> | void }) {
  const { state, setState, dirty, saving, saved, save } = useDirtyForm<Storage>(
    {
      covers_bucket: initial.covers_bucket ?? "covers",
      pages_bucket: initial.pages_bucket ?? "chapter-pages",
      cdn_url: initial.cdn_url ?? "",
      max_pages_per_chapter: Number(initial.max_pages_per_chapter ?? 200),
    },
    onSave,
  );
  return (
    <Card icon={<HardDrive className="h-5 w-5" />} title="Stockage & CDN" description="Buckets et diffusion des images.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bucket couvertures"><input className={inputCls} value={state.covers_bucket} onChange={(e) => setState({ ...state, covers_bucket: e.target.value })} /></Field>
        <Field label="Bucket pages chapitres"><input className={inputCls} value={state.pages_bucket} onChange={(e) => setState({ ...state, pages_bucket: e.target.value })} /></Field>
        <Field label="URL CDN (optionnel)"><input className={inputCls} placeholder="https://cdn.heavenscans.com" value={state.cdn_url} onChange={(e) => setState({ ...state, cdn_url: e.target.value })} /></Field>
        <Field label="Pages max / chapitre"><input type="number" min="1" className={inputCls} value={state.max_pages_per_chapter} onChange={(e) => setState({ ...state, max_pages_per_chapter: Number(e.target.value) })} /></Field>
      </div>
      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} />
    </Card>
  );
}

function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  return (
    <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
      <header className="mb-4 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/20 text-destructive"><AlertTriangle className="h-5 w-5" /></div>
        <div>
          <h2 className="text-lg font-bold text-destructive">Zone dangereuse</h2>
          <p className="text-sm text-muted-foreground">Actions irréversibles. Réfléchis à deux fois.</p>
        </div>
      </header>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-lg border border-destructive/50 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10" onClick={() => alert("Cache vidé (à brancher)") }>Vider le cache</button>
        <button type="button" className="rounded-lg border border-destructive/50 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10" onClick={() => alert("Réindexation lancée (à brancher)")}>Réindexer la recherche</button>
        {!confirming ? (
          <button type="button" onClick={() => setConfirming(true)} className="rounded-lg bg-destructive/90 px-3 py-2 text-sm font-bold text-white">Réinitialiser tous les paramètres</button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-destructive font-semibold">Confirmer ?</span>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-lg border border-border px-3 py-1.5 text-xs">Annuler</button>
            <button type="button" onClick={() => { alert("Reset (à brancher)"); setConfirming(false); }} className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-bold text-white">Oui, réinitialiser</button>
          </div>
        )}
      </div>
    </section>
  );
}

type AdminRow = {
  user_id: string;
  role: "admin" | "super_admin" | "team" | "user";
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

function AdminsCard({ currentUserId }: { currentUserId: string | null }) {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ id: string; username: string | null; display_name: string | null; avatar_url: string | null }>>([]);
  const [searching, setSearching] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["admin", "super_admin"]);
    const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
    let profilesById = new Map<string, { username: string | null; display_name: string | null; avatar_url: string | null }>();
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", ids);
      (profs ?? []).forEach((p) => profilesById.set(p.id as string, {
        username: (p.username as string | null) ?? null,
        display_name: (p.display_name as string | null) ?? null,
        avatar_url: (p.avatar_url as string | null) ?? null,
      }));
    }
    setRows(((roles ?? []) as Array<{ user_id: string; role: AdminRow["role"] }>).map((r) => ({
      user_id: r.user_id,
      role: r.role,
      username: profilesById.get(r.user_id)?.username ?? null,
      display_name: profilesById.get(r.user_id)?.display_name ?? null,
      avatar_url: profilesById.get(r.user_id)?.avatar_url ?? null,
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const search = async (q: string) => {
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
      .limit(8);
    setResults((data ?? []) as typeof results);
    setSearching(false);
  };

  const grant = async (userId: string, role: "admin" | "super_admin") => {
    setMsg(null);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) { setMsg(error.message); return; }
    setMsg(`Rôle ${role} attribué.`);
    setQuery(""); setResults([]);
    await load();
  };

  const revoke = async (userId: string, role: AdminRow["role"]) => {
    if (userId === currentUserId) {
      if (!confirm("Retirer ton propre rôle ? Tu perdras l'accès admin.")) return;
    }
    setMsg(null);
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    if (error) { setMsg(error.message); return; }
    setMsg("Rôle retiré.");
    await load();
  };

  return (
    <Card icon={<ShieldCheck className="h-5 w-5" />} title="Administrateurs" description="Attribue ou retire les rôles admin et super_admin.">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Ajouter un administrateur</label>
          <div className="relative">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="Rechercher par pseudo ou nom d'affichage…"
                className="flex-1 bg-transparent py-2.5 text-sm outline-none"
              />
              {searching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            {results.length > 0 && (
              <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-border bg-card divide-y divide-border">
                {results.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-bold">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full rounded-full object-cover" /> : (p.username ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{p.display_name || p.username || "Sans nom"}</div>
                      <div className="truncate text-xs text-muted-foreground">@{p.username ?? "—"} · <code className="text-[10px]">{p.id.slice(0, 8)}</code></div>
                    </div>
                    <button type="button" onClick={() => grant(p.id, "admin")} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-semibold hover:border-primary hover:text-primary">
                      <UserPlus className="h-3 w-3" /> Admin
                    </button>
                    <button type="button" onClick={() => grant(p.id, "super_admin")} className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                      <Crown className="h-3 w-3" /> Super
                    </button>
                  </div>
                ))}
              </div>
            )}
            {query.trim().length >= 2 && !searching && results.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Aucun profil trouvé. L'utilisateur doit d'abord créer un compte.</p>
            )}
          </div>
        </div>

        {msg && <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs">{msg}</div>}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Admins actuels ({rows.length})</label>
            <button type="button" onClick={load} className="text-xs text-muted-foreground hover:text-foreground">Rafraîchir</button>
          </div>
          {loading ? (
            <div className="grid place-items-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun administrateur enregistré.</p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {rows.map((r) => (
                <div key={`${r.user_id}-${r.role}`} className="flex items-center gap-3 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-xs font-bold overflow-hidden">
                    {r.avatar_url ? <img src={r.avatar_url} alt="" className="h-full w-full object-cover" /> : (r.username ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {r.display_name || r.username || "Sans nom"}
                      {r.user_id === currentUserId && <span className="ml-2 text-[10px] text-muted-foreground">(toi)</span>}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">@{r.username ?? "—"}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${r.role === "super_admin" ? "bg-primary/15 text-primary" : "bg-muted text-foreground"}`}>
                    {r.role === "super_admin" ? <Crown className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                    {r.role}
                  </span>
                  <button type="button" onClick={() => revoke(r.user_id, r.role)} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Retirer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}