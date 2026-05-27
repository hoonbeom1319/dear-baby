-- 즐겨찾기 (로그인 사용자만)
CREATE TABLE IF NOT EXISTS favorites (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id   UUID        NOT NULL REFERENCES places(id)    ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, place_id)
);

-- 정보 제보 (비회원도 가능)
CREATE TABLE IF NOT EXISTS reports (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id   UUID        NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  reason     TEXT        NOT NULL,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  status     TEXT        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'applied', 'ignored')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports   ENABLE ROW LEVEL SECURITY;

-- 즐겨찾기: 본인만 CRUD
CREATE POLICY "favorites_own" ON favorites FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 제보: 누구나 INSERT, 조회는 service role만
CREATE POLICY "reports_insert_anyone" ON reports FOR INSERT WITH CHECK (true);
