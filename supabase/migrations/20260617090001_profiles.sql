-- ─────────────────────────────────────────────────────────────────────────────
-- 공통 함수 + 사용자 프로필
-- dear-baby V2 — 로그인은 V1 자산 재활용 (auth.users + profiles)
-- ─────────────────────────────────────────────────────────────────────────────

-- updated_at 자동 갱신 (여러 테이블이 공용으로 쓰는 트리거 함수)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 유저 프로필 — auth.users 와 1:1
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  provider     text,                -- 'kakao' | 'naver' | 'apple'
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 신규 가입 시 자동으로 profiles 행 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  begin
    insert into public.profiles (id, display_name, avatar_url, provider)
    values (
      new.id,
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'provider'
    )
    on conflict (id) do nothing;
  exception when others then
    null; -- 프로필 저장 실패해도 로그인 흐름은 계속
  end;
  return new;
end;
$$;

-- V1 에서 만든 트리거가 auth.users 에 남아 있을 수 있어 멱등 처리
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS — 본인 행만 (private 가족 지도, 공유 없음)
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
