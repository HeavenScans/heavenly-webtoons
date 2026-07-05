
-- HeavenBot v1 workflow

-- 1) Chapters: add workflow columns
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS watermarked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

ALTER TABLE public.chapters
  DROP CONSTRAINT IF EXISTS chapters_status_check;
ALTER TABLE public.chapters
  ADD CONSTRAINT chapters_status_check
  CHECK (status IN ('draft','pending_review','scheduled','published','cancelled'));

-- Backfill existing rows: published chapters -> 'published', others -> 'draft'
UPDATE public.chapters SET status = 'published' WHERE published = true AND status = 'draft';

-- 2) bot_sources: catalog of authorized sources (prep v2, used as provenance now)
CREATE TABLE IF NOT EXISTS public.bot_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text,
  kind text NOT NULL DEFAULT 'manual' CHECK (kind IN ('manual','rss','json')),
  enabled boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bot_sources TO authenticated;
GRANT ALL ON public.bot_sources TO service_role;

ALTER TABLE public.bot_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read bot_sources"
  ON public.bot_sources FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins write bot_sources"
  ON public.bot_sources FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_bot_sources_updated_at
  BEFORE UPDATE ON public.bot_sources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed 'manual' source
INSERT INTO public.bot_sources (name, kind, enabled, notes)
VALUES ('Upload manuel', 'manual', true, 'Chapitres uploadés directement via le panneau admin')
ON CONFLICT DO NOTHING;

-- 3) chapter_audit_log: action journal
CREATE TABLE IF NOT EXISTS public.chapter_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE CASCADE,
  actor_id uuid,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chapter_audit_log_chapter_id_idx
  ON public.chapter_audit_log(chapter_id);
CREATE INDEX IF NOT EXISTS chapter_audit_log_created_at_idx
  ON public.chapter_audit_log(created_at DESC);

GRANT SELECT, INSERT ON public.chapter_audit_log TO authenticated;
GRANT ALL ON public.chapter_audit_log TO service_role;

ALTER TABLE public.chapter_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit log"
  ON public.chapter_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins insert audit log"
  ON public.chapter_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
