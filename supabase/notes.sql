-- My notes: each student's notes, one row per note, linked to a topic (or 'general').
-- Run once in the Supabase SQL editor.
create table if not exists public.notes (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null default 'general',
  title text not null default '',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_idx on public.notes (user_id, updated_at desc);

alter table public.notes enable row level security;

-- Students can only see and change their own notes.
create policy "Own notes: read" on public.notes for select using (auth.uid() = user_id);
create policy "Own notes: insert" on public.notes for insert with check (auth.uid() = user_id);
create policy "Own notes: update" on public.notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own notes: delete" on public.notes for delete using (auth.uid() = user_id);
