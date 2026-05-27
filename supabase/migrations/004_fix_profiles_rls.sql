-- profiles RLS 정책 수정
-- 트리거(handle_new_user)는 auth.uid()가 NULL인 컨텍스트에서 실행되므로
-- INSERT 정책을 별도로 분리해야 함

DROP POLICY IF EXISTS "profiles_own_write" ON profiles;
DROP POLICY IF EXISTS "profiles_read_public" ON profiles;

-- 조회: 누구나 (어드민, 앱 내 이름 표시 등)
CREATE POLICY "profiles_select" ON profiles
    FOR SELECT USING (true);

-- 삽입: 트리거·서비스 롤에서 자유롭게 (실제 보안은 id → auth.users FK가 담당)
CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT WITH CHECK (true);

-- 수정·삭제: 본인만
CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete" ON profiles
    FOR DELETE USING (auth.uid() = id);
