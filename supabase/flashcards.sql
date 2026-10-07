-- Flashcards: each student's flashcard decks, saved to their account (one row per student).
-- Run once in the Supabase SQL editor.
create table if not exists public.flashcards (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.flashcards enable row level security;

-- Students can only see and change their own flashcards.
create policy "Own flashcards: read" on public.flashcards for select using (auth.uid() = user_id);
create policy "Own flashcards: insert" on public.flashcards for insert with check (auth.uid() = user_id);
create policy "Own flashcards: update" on public.flashcards for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own flashcards: delete" on public.flashcards for delete using (auth.uid() = user_id);
