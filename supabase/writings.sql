-- Saved creative writing and essays.
-- Run this once in Supabase (SQL Editor → New query → paste → Run).
-- Until it's run, the site still works and saves writing on each device only.

create table if not exists public.writings (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null,
  prompt text not null,
  text text not null default '',
  parts jsonb,
  settings jsonb not null default '{}'::jsonb,
  feedback text,
  word_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists writings_user_idx on public.writings (user_id, updated_at desc);

alter table public.writings enable row level security;

-- Students can only see and change their own writing.
create policy "Own writing: read" on public.writings for select using (auth.uid() = user_id);
create policy "Own writing: insert" on public.writings for insert with check (auth.uid() = user_id);
create policy "Own writing: update" on public.writings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own writing: delete" on public.writings for delete using (auth.uid() = user_id);
