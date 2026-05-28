-- ── 참조 테이블 생성 ────────────────────────────────────────────────────────

CREATE TABLE areas (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE categories (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE amenities (
  id         TEXT    PRIMARY KEY,
  short      TEXT    NOT NULL,
  icon       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ── 기준 데이터 ─────────────────────────────────────────────────────────────

INSERT INTO areas VALUES
  ('songpa',   '송파', 0),
  ('unjeong',  '운정', 1),
  ('gangdong', '강동', 2),
  ('mapo',     '마포', 3);

-- 'all'은 UI 필터 전용 — DB에 존재하지 않음
INSERT INTO categories VALUES
  ('cafe', '카페',    0),
  ('rest', '식당',    1),
  ('kids', '키즈카페', 2),
  ('mall', '복합몰',  3);

INSERT INTO amenities VALUES
  ('nurse',  '수유실',  'amen-nurse',  0),
  ('diaper', '기저귀',  'amen-diaper', 1),
  ('chair',  '아기의자', 'amen-chair',  2),
  ('stroll', '유모차',  'amen-stroll', 3),
  ('park',   '주차',    'amen-park',   4);

-- ── place_amenities 중간 테이블 ─────────────────────────────────────────────

CREATE TABLE place_amenities (
  place_id   UUID NOT NULL REFERENCES places(id)   ON DELETE CASCADE,
  amenity_id TEXT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (place_id, amenity_id)
);

-- ── 기존 amenities TEXT[] → place_amenities 행으로 마이그레이션 ───────────────

INSERT INTO place_amenities (place_id, amenity_id)
SELECT id, unnest(amenities)
FROM   places
WHERE  cardinality(amenities) > 0;

-- ── FK 제약 추가 ─────────────────────────────────────────────────────────────

ALTER TABLE places
  ADD CONSTRAINT fk_place_area     FOREIGN KEY (area)     REFERENCES areas(id),
  ADD CONSTRAINT fk_place_category FOREIGN KEY (category) REFERENCES categories(id);

ALTER TABLE courses
  ADD CONSTRAINT fk_course_area FOREIGN KEY (area) REFERENCES areas(id);

-- ── places.amenities 컬럼 제거 (place_amenities로 대체) ──────────────────────

ALTER TABLE places DROP COLUMN amenities;

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE areas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_areas"            ON areas            FOR SELECT USING (true);
CREATE POLICY "public_read_categories"       ON categories       FOR SELECT USING (true);
CREATE POLICY "public_read_amenities"        ON amenities        FOR SELECT USING (true);
CREATE POLICY "public_read_place_amenities"  ON place_amenities  FOR SELECT USING (true);
