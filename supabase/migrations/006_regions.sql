-- ── 상위 지역 테이블 ──────────────────────────────────────────────────────────

CREATE TABLE regions (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO regions VALUES
  ('seoul',    '서울', 0),
  ('gyeonggi', '경기', 1);

-- ── areas에 region_id 추가 ─────────────────────────────────────────────────

ALTER TABLE areas ADD COLUMN region_id TEXT REFERENCES regions(id);

-- ── 기존 3개 서울 구 — 이름 suffix 추가 + region_id 설정 ────────────────────

UPDATE areas SET name = '강동구', region_id = 'seoul', sort_order = 1  WHERE id = 'gangdong';
UPDATE areas SET name = '마포구', region_id = 'seoul', sort_order = 12 WHERE id = 'mapo';
UPDATE areas SET name = '송파구', region_id = 'seoul', sort_order = 17 WHERE id = 'songpa';

-- ── 서울 나머지 22개 구 추가 (가나다 순, sort_order 0~24) ─────────────────────

INSERT INTO areas (id, name, sort_order, region_id) VALUES
  ('gangnam',      '강남구',    0,  'seoul'),
  ('gangbuk',      '강북구',    2,  'seoul'),
  ('gangseo',      '강서구',    3,  'seoul'),
  ('gwanak',       '관악구',    4,  'seoul'),
  ('gwangjin',     '광진구',    5,  'seoul'),
  ('guro',         '구로구',    6,  'seoul'),
  ('geumcheon',    '금천구',    7,  'seoul'),
  ('nowon',        '노원구',    8,  'seoul'),
  ('dobong',       '도봉구',    9,  'seoul'),
  ('dongdaemun',   '동대문구',  10, 'seoul'),
  ('dongjak',      '동작구',    11, 'seoul'),
  ('seodaemun',    '서대문구',  13, 'seoul'),
  ('seocho',       '서초구',    14, 'seoul'),
  ('seongdong',    '성동구',    15, 'seoul'),
  ('seongbuk',     '성북구',    16, 'seoul'),
  ('yangcheon',    '양천구',    18, 'seoul'),
  ('yeongdeungpo', '영등포구',  19, 'seoul'),
  ('yongsan',      '용산구',    20, 'seoul'),
  ('eunpyeong',    '은평구',    21, 'seoul'),
  ('jongno',       '종로구',    22, 'seoul'),
  ('jung',         '중구',      23, 'seoul'),
  ('jungnang',     '중랑구',    24, 'seoul');

-- ── 경기 31개 시·군 추가 (가나다 순, sort_order 0~30) ───────────────────────

INSERT INTO areas (id, name, sort_order, region_id) VALUES
  ('gapyeong',    '가평군',    0,  'gyeonggi'),
  ('goyang',      '고양시',    1,  'gyeonggi'),
  ('gwacheon',    '과천시',    2,  'gyeonggi'),
  ('gwangmyeong', '광명시',    3,  'gyeonggi'),
  ('gwangju',     '광주시',    4,  'gyeonggi'),
  ('guri',        '구리시',    5,  'gyeonggi'),
  ('gunpo',       '군포시',    6,  'gyeonggi'),
  ('gimpo',       '김포시',    7,  'gyeonggi'),
  ('namyangju',   '남양주시',  8,  'gyeonggi'),
  ('dongducheon', '동두천시',  9,  'gyeonggi'),
  ('bucheon',     '부천시',    10, 'gyeonggi'),
  ('seongnam',    '성남시',    11, 'gyeonggi'),
  ('suwon',       '수원시',    12, 'gyeonggi'),
  ('siheung',     '시흥시',    13, 'gyeonggi'),
  ('ansan',       '안산시',    14, 'gyeonggi'),
  ('anseong',     '안성시',    15, 'gyeonggi'),
  ('anyang',      '안양시',    16, 'gyeonggi'),
  ('yangju',      '양주시',    17, 'gyeonggi'),
  ('yangpyeong',  '양평군',    18, 'gyeonggi'),
  ('yeoju',       '여주시',    19, 'gyeonggi'),
  ('yeoncheon',   '연천군',    20, 'gyeonggi'),
  ('osan',        '오산시',    21, 'gyeonggi'),
  ('yongin',      '용인시',    22, 'gyeonggi'),
  ('uiwang',      '의왕시',    23, 'gyeonggi'),
  ('uijeongbu',   '의정부시',  24, 'gyeonggi'),
  ('icheon',      '이천시',    25, 'gyeonggi'),
  ('paju',        '파주시',    26, 'gyeonggi'),
  ('pyeongtaek',  '평택시',    27, 'gyeonggi'),
  ('pocheon',     '포천시',    28, 'gyeonggi'),
  ('hanam',       '하남시',    29, 'gyeonggi'),
  ('hwaseong',    '화성시',    30, 'gyeonggi');

-- ── unjeong → paju 데이터 마이그레이션 ──────────────────────────────────────
-- unjeong은 파주시 내 동네명이므로 시 단위(paju)로 교체

UPDATE places  SET area = 'paju' WHERE area = 'unjeong';
UPDATE courses SET area = 'paju' WHERE area = 'unjeong';
DELETE FROM areas WHERE id = 'unjeong';

-- ── region_id NOT NULL 적용 ──────────────────────────────────────────────────

ALTER TABLE areas ALTER COLUMN region_id SET NOT NULL;

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_regions" ON regions FOR SELECT USING (true);
