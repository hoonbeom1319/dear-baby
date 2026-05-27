-- 유저 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url   TEXT,
    provider     TEXT,                -- 'kakao' | 'naver' | 'apple'
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 신규 가입 시 자동으로 profiles 행 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    BEGIN
        INSERT INTO public.profiles (id, display_name, avatar_url, provider)
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data ->> 'full_name',
            NEW.raw_user_meta_data ->> 'avatar_url',
            NEW.raw_user_meta_data ->> 'provider'
        )
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- 프로필 저장 실패해도 로그인 흐름은 계속
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 본인만 수정 가능
CREATE POLICY "profiles_own_write" ON profiles
    FOR ALL USING (auth.uid() = id);

-- 프로필 조회는 누구나 가능 (어드민 등에서 이름 표시용)
CREATE POLICY "profiles_read_public" ON profiles
    FOR SELECT USING (true);
