-- Checkpoint database schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);

-- User game interactions (ratings, lists, reviews)
create table if not exists public.user_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  game_id integer not null,
  game_title text not null,
  game_thumbnail text,
  game_genre text,
  status text not null check (status in ('played', 'want_to_play')),
  rating numeric(3,1) check (rating >= 0 and rating <= 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, game_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.user_games enable row level security;

-- Profiles policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- User games policies
create policy "Users can view their own games"
  on public.user_games for select using (auth.uid() = user_id);

create policy "Users can insert their own games"
  on public.user_games for insert with check (auth.uid() = user_id);

create policy "Users can update their own games"
  on public.user_games for update using (auth.uid() = user_id);

create policy "Users can delete their own games"
  on public.user_games for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
