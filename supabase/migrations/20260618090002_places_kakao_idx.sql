-- 기록 저장(create_record_session)의 카카오 POI 중복 조회 핫패스용 복합 인덱스.
-- 조회: where user_id = ? and kakao_place_id = ?  (20260618090001_dedup_kakao_places.sql)
-- 기존 places_user_id_idx(user_id)만으로는 user로 좁힌 뒤 kakao_place_id가 순차 필터로 남는다.
-- 수동 등록 장소는 kakao_place_id가 null이고 이 조회 대상도 아니므로 partial 인덱스로 가볍게 둔다.
create index if not exists places_user_kakao_idx
  on public.places (user_id, kakao_place_id)
  where kakao_place_id is not null;
