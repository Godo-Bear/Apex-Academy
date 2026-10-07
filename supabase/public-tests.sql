-- Public tests: tests students share so everyone with an account can find and take them.
-- Run once in the Supabase SQL editor.
create table if not exists public.public_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  author text not null default '',
  title text not null check (char_length(title) between 3 and 80),
  description text not null default '' check (char_length(description) <= 300),
  subject text not null default 'Other',
  questions jsonb not null,
  question_count integer not null default 0 check (question_count between 1 and 60),
  minutes integer not null default 0 check (minutes between 0 and 180),
  plays integer not null default 0,
  created_at timestamptz not null default now(),
  check (pg_column_size(questions) < 300000)
);

create index if not exists public_tests_created_idx on public.public_tests (created_at desc);

alter table public.public_tests enable row level security;

-- Everyone who is logged in can see and take public tests.
create policy "Public tests: read" on public.public_tests
  for select using (auth.role() = 'authenticated');
-- You can share tests as yourself (starting with 0 plays).
create policy "Public tests: share" on public.public_tests
  for insert with check (auth.uid() = user_id and plays = 0);
-- You can remove your own tests; admins can remove any.
create policy "Public tests: remove" on public.public_tests
  for delete using (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Counts a play when someone starts a public test.
create or replace function public.public_test_played(test_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.public_tests set plays = plays + 1 where id = test_id;
$$;
grant execute on function public.public_test_played(uuid) to authenticated;
