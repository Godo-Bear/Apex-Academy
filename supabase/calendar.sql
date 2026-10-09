-- Calendar: each student's tests, assignments, reminders and notes on a date (Notes & calendar page).
-- Run once in the Supabase SQL editor.
create table if not exists public.calendar_events (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  title text not null default '',
  kind text not null default 'test',
  subject text not null default '',
  topic_id text,
  details text not null default '',
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calendar_events_user_idx on public.calendar_events (user_id, date);

alter table public.calendar_events enable row level security;

-- Students can only see and change their own calendar.
create policy "Own calendar: read" on public.calendar_events for select using (auth.uid() = user_id);
create policy "Own calendar: insert" on public.calendar_events for insert with check (auth.uid() = user_id);
create policy "Own calendar: update" on public.calendar_events for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own calendar: delete" on public.calendar_events for delete using (auth.uid() = user_id);
