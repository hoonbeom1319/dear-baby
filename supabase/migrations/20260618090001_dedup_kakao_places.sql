-- ─────────────────────────────────────────────────────────────────────────────
-- 같은 카카오 장소(POI)는 Place 하나로 — 방문만 누적
--
-- 버그: create_record_session 이 기록할 때마다 무조건 새 Place 를 INSERT 해서,
-- 같은 카카오 장소를 두 번 기록하면 같은 좌표에 Place 2개(각 방문 1)가 겹쳐 박혔다.
-- → 지도 도트가 "1"로만 보이고(둘이 포개짐), 핀 클릭이 한쪽으로 쏠려 선택이 안 됐다.
-- 스키마 의도(척추: Place 1:N Visit, 같은 장소에 여러 방문이 쌓인다)와 어긋난 구현.
--
-- 이 마이그레이션:
--   ① 이미 박힌 중복 카카오 Place 를 하나(가장 먼저 만든 것)로 병합
--   ② create_record_session 이 같은 (user_id, kakao_place_id) 면 Place 를
--      재사용하고 Visit 만 추가하도록 교체
--
-- 둘 다 멱등(중복이 없으면 ①은 no-op). manual(자유 입력) 장소는 kakao_place_id 가
-- 없으므로 병합 대상이 아니다 — 동명·동좌표라도 별개 핀으로 둔다.
-- ─────────────────────────────────────────────────────────────────────────────

-- ① 기존 중복 카카오 Place 병합 ───────────────────────────────────────────────
-- 정본 = 같은 (user_id, kakao_place_id) 중 가장 먼저 생성된 Place.
-- 비정본 Place 의 visit 을 정본으로 옮긴 뒤, 빈 비정본 Place 를 삭제한다.
-- (photos 는 visit_id 참조라 visit 이 옮겨가면 그대로 따라간다.)

update public.visits v
set place_id = c.canonical_id
from (
  select
    id,
    first_value(id) over (
      partition by user_id, kakao_place_id
      order by created_at, id
    ) as canonical_id
  from public.places
  where source = 'kakao'
    and nullif(kakao_place_id, '') is not null
) c
where v.place_id = c.id
  and c.id <> c.canonical_id;

-- 옮기고 나서 비어버린 비정본 Place 삭제 (정본만 rn=1 로 남김)
delete from public.places p
using (
  select
    id,
    row_number() over (
      partition by user_id, kakao_place_id
      order by created_at, id
    ) as rn
  from public.places
  where source = 'kakao'
    and nullif(kakao_place_id, '') is not null
) d
where p.id = d.id
  and d.rn > 1;

-- ② create_record_session 교체 — 같은 카카오 POI 면 Place 재사용 ───────────────
create or replace function public.create_record_session(
  p_user_id uuid,
  p_groups  jsonb
)
returns uuid[]
language plpgsql
as $$
declare
  g           jsonb;
  v_place_id  uuid;
  v_visit_id  uuid;
  v_is_new    boolean;
  v_place_ids uuid[] := '{}';
begin
  for g in select * from jsonb_array_elements(p_groups)
  loop
    v_place_id := null;
    v_is_new   := false;

    -- 카카오 장소면 같은 POI 가 이미 있는지 먼저 본다 (같은 트랜잭션의 직전 그룹 포함).
    if (g->>'source') = 'kakao' and nullif(g->>'kakao_place_id', '') is not null then
      select id
        into v_place_id
        from public.places
       where user_id = p_user_id
         and kakao_place_id = g->>'kakao_place_id'
       limit 1;
    end if;

    -- 없으면 새 Place + 새 핀 이벤트(pin_created 는 '핀 생성'만 — 재방문은 제외).
    if v_place_id is null then
      insert into public.places (user_id, name, lat, lng, source, kakao_place_id)
      values (
        p_user_id,
        g->>'name',
        (g->>'lat')::double precision,
        (g->>'lng')::double precision,
        g->>'source',
        nullif(g->>'kakao_place_id', '')
      )
      returning id into v_place_id;

      v_is_new := true;
    end if;

    -- 방문은 항상 추가 (같은 장소 = 방문 누적).
    insert into public.visits (user_id, place_id, visited_on, note)
    values (
      p_user_id,
      v_place_id,
      (g->>'visited_on')::date,
      nullif(g->>'note', '')
    )
    returning id into v_visit_id;

    if g ? 'photos' and jsonb_typeof(g->'photos') = 'array' then
      insert into public.photos (user_id, visit_id, storage_path, taken_at, sort_order)
      select
        p_user_id,
        v_visit_id,
        ph->>'storage_path',
        nullif(ph->>'taken_at', '')::timestamptz,
        coalesce((ph->>'sort_order')::int, 0)
      from jsonb_array_elements(g->'photos') as ph
      where ph->>'storage_path' is not null;
    end if;

    if v_is_new then
      insert into public.events (user_id, type, meta)
      values (
        p_user_id,
        'pin_created',
        jsonb_build_object('place_id', v_place_id, 'visit_id', v_visit_id)
      );
    end if;

    -- 반환은 distinct place — 같은 장소를 한 세션에 두 번 담아도 "N곳"이 부풀지 않게.
    if not (v_place_id = any(v_place_ids)) then
      v_place_ids := array_append(v_place_ids, v_place_id);
    end if;
  end loop;

  return v_place_ids;
end;
$$;
