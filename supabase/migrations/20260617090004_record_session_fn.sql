-- ─────────────────────────────────────────────────────────────────────────────
-- 기록 세션 원자적 생성 함수
-- 한 번의 기록 세션 = Place N개 + 각 Place 아래 Visit 1개 + 각 Visit에 Photo (PRD §5.4)
-- 세 테이블에 걸친 생성을 한 트랜잭션으로 묶어 고아 핀(Visit 없는 Place)을 방지한다.
-- 측정용 pin_created 이벤트(§4.4 F-9)도 같은 트랜잭션에서 남긴다.
--
-- p_groups 예:
-- [
--   { "name":"스타필드 하남", "lat":37.5, "lng":127.2, "source":"kakao",
--     "kakao_place_id":"123", "visited_on":"2026-06-14", "note":null,
--     "photos":[ { "storage_path":"uid/visit/a.jpg", "taken_at":"2026-06-14T10:00:00Z", "sort_order":0 } ] }
-- ]
-- 반환: 생성된 place id 배열 (지도에서 방금 박힌 핀을 바로 보여주기 위함)
-- ─────────────────────────────────────────────────────────────────────────────

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
  v_place_ids uuid[] := '{}';
begin
  for g in select * from jsonb_array_elements(p_groups)
  loop
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

    insert into public.events (user_id, type, meta)
    values (
      p_user_id,
      'pin_created',
      jsonb_build_object('place_id', v_place_id, 'visit_id', v_visit_id)
    );

    v_place_ids := array_append(v_place_ids, v_place_id);
  end loop;

  return v_place_ids;
end;
$$;
