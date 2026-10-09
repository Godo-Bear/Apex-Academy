-- AI memory: saved AI tutor chats, and the short notes the AI remembers about each student.
-- Run once in the Supabase SQL editor.
create table if not exists public.ai_chats (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New chat',
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_chats_user_idx on public.ai_chats (user_id, updated_at desc);

create table if not exists public.ai_memory (
  user_id uuid primary key references auth.users (id) on delete cascade,
  enabled boolean not null default true,
  items jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.ai_chats enable row level security;
alter table public.ai_memory enable row level security;

-- Students can only see and change their own chats and memories.
create policy "Own AI chats: read" on public.ai_chats for select using (auth.uid() = user_id);
create policy "Own AI chats: insert" on public.ai_chats for insert with check (auth.uid() = user_id);
create policy "Own AI chats: update" on public.ai_chats for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own AI chats: delete" on public.ai_chats for delete using (auth.uid() = user_id);

create policy "Own AI memory: read" on public.ai_memory for select using (auth.uid() = user_id);
create policy "Own AI memory: insert" on public.ai_memory for insert with check (auth.uid() = user_id);
create policy "Own AI memory: update" on public.ai_memory for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own AI memory: delete" on public.ai_memory for delete using (auth.uid() = user_id);
