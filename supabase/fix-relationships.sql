-- Fix foreign key relationships so Supabase can join lists/user_games with profiles
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run

-- Fix lists table: change FK from auth.users to profiles
alter table public.lists drop constraint if exists lists_user_id_fkey;
alter table public.lists add constraint lists_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

-- Fix user_games table: change FK from auth.users to profiles
alter table public.user_games drop constraint if exists user_games_user_id_fkey;
alter table public.user_games add constraint user_games_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;
