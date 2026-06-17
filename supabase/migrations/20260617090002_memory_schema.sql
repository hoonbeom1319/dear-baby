-- ─────────────────────────────────────────────────────────────────────────────
-- 추억 지도 핵심 스키마
--   User ─< Place ─< Visit ─< Photo      User ─< Event
--   척추: Place 1:N Visit  (같은 장소에 여러 방문이 쌓인다)
--   사진·멘트의 주인 = Visit  (Place 가 아님 — 방문마다 다르므로)
-- user_id 는 모든 테이블에 비정규화로 보관한다.
--   → RLS 정책이 join 없이 단순해지고, "내 전체 핀/방문" 조회가 직접 가능.
-- ─────────────────────────────────────────────────────────────────────────────

-- 장소 = 지도의 핀 하나
create table public.places (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  name           text not null,
  lat            double precision not null,
  lng            double precision not null,
  source         text not null check (source in ('kakao', 'manual')),  -- 카카오 POI / 자유 입력
  kakao_place_id text,                          -- 카카오 POI 일 때만 (옵션)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 방문 = "어느 날 이 장소에 갔다" (하루치 한 장소). 멘트가 여기 붙는다.
create table public.visits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  place_id   uuid not null references public.places(id) on delete cascade,
  visited_on date not null,         -- 방문 날짜 (사용자가 고름, 과거 날짜 정상)
  note       text,                  -- 멘트 (선택)
  created_at timestamptz not null default now()
);

-- 사진 = 방문에 딸린 이미지. 원본 GPS 는 저장하지 않는다 (PRD §5.3).
create table public.photos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  visit_id     uuid not null references public.visits(id) on delete cascade,
  storage_path text not null,       -- storage 'photos' 버킷 내 경로
  taken_at     timestamptz,         -- EXIF 촬영시각 (방문 날짜 자동 제안에 사용)
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- 행동 로그 = NSM 측정용 (핀 생성 / 순수 되새김 세션). PRD §2.6 / §4.4 F-9.
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('pin_created', 'recall_session')),
  occurred_at timestamptz not null default now(),
  meta        jsonb not null default '{}'::jsonb   -- 예: {"place_id": "..."}
);

-- updated_at 트리거
create trigger places_set_updated_at
  before update on public.places
  for each row execute function public.set_updated_at();

-- ── 인덱스 ───────────────────────────────────────────────────────────────────
create index places_user_id_idx        on public.places (user_id);
create index visits_place_id_idx        on public.visits (place_id);
create index visits_user_visited_idx    on public.visits (user_id, visited_on desc);
create index photos_visit_id_idx        on public.photos (visit_id);
create index events_user_type_time_idx  on public.events (user_id, type, occurred_at desc);

-- ── RLS — 모든 테이블 본인 행만 ──────────────────────────────────────────────
alter table public.places enable row level security;
alter table public.visits enable row level security;
alter table public.photos enable row level security;
alter table public.events enable row level security;

create policy "places_own" on public.places
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "visits_own" on public.visits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "photos_own" on public.photos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "events_own" on public.events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
