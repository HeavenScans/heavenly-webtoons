-- Roles
create type public.app_role as enum ('admin', 'team', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Series
create table public.series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type text not null default 'Manga',
  status text not null default 'Ongoing',
  genres text[] not null default '{}',
  synopsis text not null default '',
  cover_url text,
  rating numeric(3,1),
  is_premium boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.series enable row level security;

create policy "Series public read" on public.series for select using (published = true);
create policy "Staff read all series" on public.series for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'));
create policy "Staff insert series" on public.series for insert to authenticated with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'));
create policy "Staff update series" on public.series for update to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'));
create policy "Admins delete series" on public.series for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Chapters
create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references public.series(id) on delete cascade not null,
  number text not null,
  title text,
  pages text[] not null default '{}',
  is_premium boolean not null default false,
  published boolean not null default true,
  released_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (series_id, number)
);
alter table public.chapters enable row level security;

create policy "Chapters public read" on public.chapters for select using (published = true);
create policy "Staff read all chapters" on public.chapters for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'));
create policy "Staff insert chapters" on public.chapters for insert to authenticated with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'));
create policy "Staff update chapters" on public.chapters for update to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'));
create policy "Admins delete chapters" on public.chapters for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Reading history
create table public.reading_history (
  user_id uuid references auth.users(id) on delete cascade not null,
  series_slug text not null,
  chapter_number text not null,
  page integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, series_slug)
);
alter table public.reading_history enable row level security;
create policy "Users view own history" on public.reading_history for select to authenticated using (auth.uid() = user_id);
create policy "Users upsert own history" on public.reading_history for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own history" on public.reading_history for update to authenticated using (auth.uid() = user_id);
create policy "Users delete own history" on public.reading_history for delete to authenticated using (auth.uid() = user_id);

-- Comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  series_slug text not null,
  chapter_number text,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
alter table public.comments enable row level security;
create policy "Comments public read" on public.comments for select using (true);
create policy "Users insert own comments" on public.comments for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own comments" on public.comments for update to authenticated using (auth.uid() = user_id);
create policy "Authors or mods delete comments" on public.comments for delete to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'));

-- Ratings
create table public.ratings (
  user_id uuid references auth.users(id) on delete cascade not null,
  series_slug text not null,
  stars smallint not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (user_id, series_slug)
);
alter table public.ratings enable row level security;
create policy "Ratings public read" on public.ratings for select using (true);
create policy "Users insert own rating" on public.ratings for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own rating" on public.ratings for update to authenticated using (auth.uid() = user_id);
create policy "Users delete own rating" on public.ratings for delete to authenticated using (auth.uid() = user_id);

-- Storage buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('chapter-pages', 'chapter-pages', true) on conflict (id) do nothing;

-- Avatars policies
create policy "Avatars public read" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users upload own avatar" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users update own avatar" on storage.objects for update to authenticated using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own avatar" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Covers policies
create policy "Covers public read" on storage.objects for select using (bucket_id = 'covers');
create policy "Staff manage covers" on storage.objects for all to authenticated using (bucket_id = 'covers' and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'))) with check (bucket_id = 'covers' and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team')));

-- Chapter pages policies
create policy "Chapter pages public read" on storage.objects for select using (bucket_id = 'chapter-pages');
create policy "Staff manage chapter pages" on storage.objects for all to authenticated using (bucket_id = 'chapter-pages' and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team'))) with check (bucket_id = 'chapter-pages' and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'team')));

-- Trigger updated_at on series
create trigger series_updated_at before update on public.series for each row execute function public.handle_updated_at();
create trigger reading_history_updated_at before update on public.reading_history for each row execute function public.handle_updated_at();