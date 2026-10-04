-- Announcements the admin sends to everyone.
-- Run this once in Supabase (SQL Editor → New query → paste → Run).

create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  message text not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  active boolean not null default true
);

alter table public.announcements enable row level security;

-- Everyone who is logged in can read announcements.
create policy "Announcements: read" on public.announcements
  for select using (auth.role() = 'authenticated');

-- Only admins can send, change or remove them.
create policy "Announcements: admin insert" on public.announcements
  for insert with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
create policy "Announcements: admin update" on public.announcements
  for update using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
create policy "Announcements: admin delete" on public.announcements
  for delete using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
