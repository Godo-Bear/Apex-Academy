-- Saves game badges, best scores, the day streak and admin gifts to each account,
-- so they follow students to any device and admins can give them out.
-- Run this once in Supabase (SQL Editor → New query → paste → Run). Safe to run more than once.
alter table public.profiles add column if not exists game_data jsonb not null default '{}'::jsonb;
