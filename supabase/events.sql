-- Boost events the admin runs (double points, double XP, ...).
-- Run this once in Supabase (SQL Editor → New query → paste → Run).

create table if not exists public.events (
  id bigint generated always as identity primary key,
  kind text not null default 'both',        -- both | points | xp | tests | practice
  multiplier int not null default 2 check (multiplier between 2 and 5),
  title text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- Everyone who is logged in can see events.
create policy "Events: read" on public.events
  for select using (auth.role() = 'authenticated');

-- Only admins can start, change or end them.
create policy "Events: admin insert" on public.events
  for insert with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
create policy "Events: admin update" on public.events
  for update using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
create policy "Events: admin delete" on public.events
  for delete using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
