-- ─────────────────────────────────────────────────────────────────────────────
-- 사진 스토리지 — private 버킷 + 서명 URL
-- 경로 규칙: {user_id}/{visit_id}/{filename}
--   → 최상위 폴더(user_id)로 소유권을 가른다.
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  false,                              -- private — 조회 시 서명 URL 발급
  10485760,                           -- 10MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

-- 본인 폴더({user_id}/...) 아래 객체만 접근 가능
create policy "photos_select_own" on storage.objects
  for select using (
    bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos_update_own" on storage.objects
  for update using (
    bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos_delete_own" on storage.objects
  for delete using (
    bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
