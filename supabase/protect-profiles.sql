-- Closes the payment loophole: stops students giving themselves paid or admin access.
-- Run this once in Supabase (SQL Editor → New query → paste → Run).
--
-- After this:
--  * Students can still save their own points, progress, name and settings.
--  * Only admins (and you in the Supabase dashboard) can change has_paid,
--    paid_until, is_admin or deleted, or change anyone else's account.
-- It's safe to run more than once.

-- Make sure the columns this protects exist.
alter table public.profiles add column if not exists paid_until timestamptz;
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists deleted boolean not null default false;

-- Is this user an admin? (security definer so it can read profiles safely)
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = uid), false);
$$;

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The Supabase dashboard / service role has no logged-in user: allow everything.
  if auth.uid() is null or public.is_admin(auth.uid()) then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  -- Students may only touch their own row.
  if tg_op = 'DELETE' then
    if old.id <> auth.uid() then
      raise exception 'You can only change your own account';
    end if;
    return old;
  end if;
  if new.id <> auth.uid() or (tg_op = 'UPDATE' and old.id <> auth.uid()) then
    raise exception 'You can only change your own account';
  end if;

  -- New accounts always start unpaid and not admin.
  if tg_op = 'INSERT' then
    new.has_paid := false;
    new.paid_until := null;
    new.is_admin := false;
    new.deleted := false;
    return new;
  end if;

  -- Updates: quietly keep the protected values as they were.
  new.has_paid := old.has_paid;
  new.paid_until := old.paid_until;
  new.is_admin := old.is_admin;
  new.deleted := old.deleted;
  return new;
end;
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
  before insert or update or delete on public.profiles
  for each row execute function public.protect_profile_fields();
