
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
CREATE INDEX IF NOT EXISTS chapters_scheduled_at_idx ON public.chapters (scheduled_at) WHERE published = false AND scheduled_at IS NOT NULL;
