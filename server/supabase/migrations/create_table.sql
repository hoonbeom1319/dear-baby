create extension if not exists pgcrypto;

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  region_code text not null,
  sub_region text not null,
  kind text not null,
  name text not null,
  short_description text not null,
  honey_tip text null,
  address text null,
  lat double precision null,
  lng double precision null,
  map_links jsonb null,
  images text[] null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists places_region_code_idx on public.places(region_code);

create index if not exists places_sub_region_idx on public.places(sub_region);

create index if not exists places_kind_idx on public.places(kind);

create index if not exists places_created_at_idx on public.places(created_at desc);


-- updated_at 자동 업데이트
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists places_set_updated_at on public.places;
create trigger places_set_updated_at
before update on public.places
for each row
execute function public.set_updated_at();