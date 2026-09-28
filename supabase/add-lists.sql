-- Run this in Supabase SQL Editor to add Lists feature and public read access

-- Lists table
create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

-- List games table
create table if not exists public.list_games (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists on delete cascade,
  game_id integer not null,
  game_title text not null,
  game_thumbnail text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.lists enable row level security;
alter table public.list_games enable row level security;

-- Lists policies
create policy "Lists are viewable by everyone"
  on public.lists for select using (true);
create policy "Users can insert their own lists"
  on public.lists for insert with check (auth.uid() = user_id);
create policy "Users can update their own lists"
  on public.lists for update using (auth.uid() = user_id);
create policy "Users can delete their own lists"
  on public.lists for delete using (auth.uid() = user_id);

-- List games policies
create policy "List games are viewable by everyone"
  on public.list_games for select using (true);
create policy "Users can insert their own list games"
  on public.list_games for insert with check (
    auth.uid() in (select user_id from public.lists where id = list_id)
  );
create policy "Users can delete their own list games"
  on public.list_games for delete using (
    auth.uid() in (select user_id from public.lists where id = list_id)
  );

-- Allow public read on user_games (for community ratings)
create policy "User games are viewable by everyone"
  on public.user_games for select using (true);
