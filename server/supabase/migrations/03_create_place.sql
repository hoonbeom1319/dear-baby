-- ============================================================
-- categories: 장소 카테고리 마스터
-- ============================================================
create table if not exists public.categories (
  code text primary key,
  display_name text not null,
  position smallint not null default 0
);

create index if not exists categories_position_idx on public.categories(position);

alter table public.categories enable row level security;

create policy "categories_select_public"
on public.categories
for select
to public
using (true);

insert into public.categories (code, display_name, position)
values
  ('restaurant', '식당', 1),
  ('cafe', '카페', 2),
  ('play', '놀거리', 3),
  ('mall', '복합몰', 4)
on conflict (code) do nothing;


-- ============================================================
-- amenities: 시설/서비스 마스터
-- icon: Material Symbols 아이콘 이름
-- ============================================================
create table if not exists public.amenities (
  code text primary key,
  display_name text not null,
  icon text not null,
  position smallint not null default 0
);

create index if not exists amenities_position_idx on public.amenities(position);

alter table public.amenities enable row level security;

create policy "amenities_select_public"
on public.amenities
for select
to public
using (true);

insert into public.amenities (code, display_name, icon, position)
values
  ('baby_chair',     '아기의자',   'chair_alt',              1),
  ('stroller_aisle', '유모차통로', 'width_wide',             2),
  ('nursing_room',   '수유실',     'child_care',             3),
  ('diaper_table',   '기저귀대',   'baby_changing_station',  4),
  ('microwave',      '전자레인지', 'microwave',              5),
  ('floor_seating',  '좌식공간',   'weekend',                6),
  ('kids_menu',      '키즈메뉴',   'restaurant_menu',        7),
  ('free_parking',   '주차무료',   'local_parking',          8)
on conflict (code) do nothing;


-- ============================================================
-- places: 장소 메인
-- region_code      → regions.code (level 1, 시/도)
-- sub_region_code  → regions.code (level 2, 시/군/구)
-- map_links        예: {"kakao": "...", "naver": "...", "tmap": "..."}
-- images           이미지 URL 배열 (첫 번째가 hero)
-- ============================================================
create extension if not exists pgcrypto;

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  region_code char(8) not null references public.regions(code) on delete restrict,
  sub_region_code char(8) not null references public.regions(code) on delete restrict,
  category_code text not null references public.categories(code) on delete restrict,
  name text not null,
  subtitle text null,
  headline text null,
  description text null,
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
create index if not exists places_sub_region_code_idx on public.places(sub_region_code);
create index if not exists places_category_code_idx on public.places(category_code);
create index if not exists places_created_at_idx on public.places(created_at desc);

alter table public.places enable row level security;

create policy "places_select_public"
on public.places
for select
to public
using (true);

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


-- ============================================================
-- place_amenities: 장소 ↔ 시설 (있는 시설만 행으로 저장)
-- 행이 있으면 "있음", 없으면 "없음"
-- ============================================================
create table if not exists public.place_amenities (
  place_id uuid not null references public.places(id) on delete cascade,
  amenity_code text not null references public.amenities(code) on delete restrict,
  primary key (place_id, amenity_code)
);

create index if not exists place_amenities_amenity_code_idx on public.place_amenities(amenity_code);

alter table public.place_amenities enable row level security;

create policy "place_amenities_select_public"
on public.place_amenities
for select
to public
using (true);
