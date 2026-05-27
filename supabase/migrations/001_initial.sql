-- places: 아기와 갈 수 있는 장소
CREATE TABLE IF NOT EXISTS places (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  area        TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  name        TEXT        NOT NULL,
  address     TEXT        NOT NULL DEFAULT '',
  phone       TEXT        NOT NULL DEFAULT '',
  age_range   TEXT        NOT NULL DEFAULT '',
  description TEXT        NOT NULL DEFAULT '',
  amenities   TEXT[]      NOT NULL DEFAULT '{}',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  status      TEXT        NOT NULL DEFAULT 'review'
                          CHECK (status IN ('public', 'review')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- courses: 큐레이터가 수동으로 묶은 외출 시퀀스
CREATE TABLE IF NOT EXISTS courses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  area        TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  duration    TEXT        NOT NULL DEFAULT '',
  season      TEXT        NOT NULL DEFAULT '사계절',
  description TEXT        NOT NULL DEFAULT '',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- course_stops: 코스에 속한 정거장 (장소 + 순서 + 큐레이터 코멘트)
CREATE TABLE IF NOT EXISTS course_stops (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID    NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  place_id   UUID    NOT NULL REFERENCES places(id)  ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  comment    TEXT    NOT NULL DEFAULT '',
  UNIQUE (course_id, stop_order)
);

-- RLS 활성화
ALTER TABLE places       ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_stops ENABLE ROW LEVEL SECURITY;

-- 공개 장소는 누구나 조회 가능
CREATE POLICY "public_read_places"
  ON places FOR SELECT USING (status = 'public');

-- 코스·정거장은 누구나 조회 가능
CREATE POLICY "public_read_courses"
  ON courses FOR SELECT USING (true);

CREATE POLICY "public_read_course_stops"
  ON course_stops FOR SELECT USING (true);
