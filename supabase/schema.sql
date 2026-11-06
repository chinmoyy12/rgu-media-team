-- =====================================================================
--  RGU Media Team website — Supabase setup
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to run more than once.
-- =====================================================================

-- 1. Who may edit the site. Add your admin email(s) at the bottom of this file.
create table if not exists public.site_admins (
  email text primary key
);
alter table public.site_admins enable row level security;
-- (no policies: nobody can read or change this list from the website)

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_site_admin() to anon, authenticated;

-- 2. The live site content (a single row, id = 1).
create table if not exists public.site_content (
  id          int primary key default 1 check (id = 1),
  content     jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  text
);
alter table public.site_content enable row level security;

drop policy if exists "anyone can read site content" on public.site_content;
create policy "anyone can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "admins can create site content" on public.site_content;
create policy "admins can create site content"
  on public.site_content for insert
  to authenticated
  with check (public.is_site_admin());

drop policy if exists "admins can update site content" on public.site_content;
create policy "admins can update site content"
  on public.site_content for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- 3. Every published version is kept, so a bad edit can be rolled back.
create table if not exists public.site_content_history (
  id         bigint generated always as identity primary key,
  content    jsonb not null,
  saved_at   timestamptz not null default now(),
  saved_by   text
);
alter table public.site_content_history enable row level security;

drop policy if exists "admins can read history" on public.site_content_history;
create policy "admins can read history"
  on public.site_content_history for select
  to authenticated
  using (public.is_site_admin());

create or replace function public.record_site_content_history()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.jwt() ->> 'email', new.updated_by);
  insert into public.site_content_history (content, saved_by)
  values (new.content, new.updated_by);
  -- keep the latest 50 versions
  delete from public.site_content_history
  where id in (
    select id from public.site_content_history
    order by id desc offset 50
  );
  return new;
end;
$$;

drop trigger if exists site_content_history on public.site_content;
create trigger site_content_history
  before insert or update on public.site_content
  for each row execute function public.record_site_content_history();

-- Explicit API permissions (row-level security above still decides who may do what).
grant usage on schema public to anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;
grant select on public.site_content_history to authenticated;

-- 4. Image uploads (member photos, gallery) — a public bucket only admins can write to.
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "admins can upload site media" on storage.objects;
create policy "admins can upload site media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "admins can update site media" on storage.objects;
create policy "admins can update site media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "admins can delete site media" on storage.objects;
create policy "admins can delete site media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin());

-- 5. ADMINS — only these emails can open the editor and publish.
--    Create the same user under Authentication → Users → Add user (tick "Auto Confirm User").
insert into public.site_admins (email) values
  ('studiorgu1@rgs.edu.in')
on conflict do nothing;
