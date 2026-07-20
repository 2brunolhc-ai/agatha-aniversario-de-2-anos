-- Ágatha 2 aninhos — estrutura segura para confirmações de presença
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 3 and 100),
  attendance_status text not null check (attendance_status in ('yes', 'no')),
  total_guests integer check (total_guests between 0 and 20),
  adults integer check (adults between 0 and 20),
  children integer check (children between 0 and 20),
  companion_names text check (char_length(companion_names) <= 500),
  message text check (char_length(message) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_agent text check (char_length(user_agent) <= 500),
  submission_hash text check (char_length(submission_hash) = 64),
  constraint rsvp_guest_totals_match check (
    attendance_status = 'no'
    or (
      total_guests >= 1
      and total_guests = coalesce(adults, 0) + coalesce(children, 0)
    )
  )
);

create unique index if not exists rsvps_submission_hash_unique
  on public.rsvps (submission_hash)
  where submission_hash is not null;

create index if not exists rsvps_created_at_idx
  on public.rsvps (created_at desc);

create index if not exists rsvps_attendance_status_idx
  on public.rsvps (attendance_status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_rsvps_updated_at on public.rsvps;
create trigger set_rsvps_updated_at
before update on public.rsvps
for each row execute function public.set_updated_at();

alter table public.rsvps enable row level security;

-- O formulário público usa a API do próprio site. Esta política mantém também
-- uma permissão mínima de inserção no nível do Supabase, sem permitir leituras.
drop policy if exists "public can insert valid rsvps" on public.rsvps;
create policy "public can insert valid rsvps"
on public.rsvps
for insert
to anon, authenticated
with check (
  char_length(full_name) between 3 and 100
  and attendance_status in ('yes', 'no')
  and coalesce(total_guests, 0) between 0 and 20
  and coalesce(adults, 0) between 0 and 20
  and coalesce(children, 0) between 0 and 20
);

revoke all on table public.rsvps from anon, authenticated;
grant insert on table public.rsvps to anon, authenticated;

-- Não existem políticas de SELECT, UPDATE ou DELETE para visitantes.
-- A leitura administrativa acontece somente na API do servidor, após validar
-- a sessão e o e-mail permitido, usando a service role protegida.
