
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

INSERT INTO public.site_settings (key, value) VALUES
  ('branding', '{"site_name":"HeavenScans","tagline":"Le royaume céleste du scan","contact_email":"contact@heavenscans.com","discord_url":"https://discord.gg/heavenscans"}'::jsonb),
  ('features', '{"maintenance_mode":false,"allow_signups":true,"comments_enabled":true,"ratings_enabled":true,"auto_publish_bot":true}'::jsonb),
  ('premium', '{"reader_price":0,"premium_price":14,"ultimate_price":35,"currency":"EUR"}'::jsonb),
  ('translation', '{"pack_starter_credits":5,"pack_starter_price":2,"pack_boost_credits":15,"pack_boost_price":5,"pack_max_credits":40,"pack_max_price":12}'::jsonb)
ON CONFLICT (key) DO NOTHING;
