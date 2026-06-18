import { compressImage } from './compress-image';

/**
 * 원본 업로드 스위치 — 의도적으로 숨긴 옵션.
 * 기본은 압축본을 올린다. 원본이 필요해지면(예: 보관용 고화질) 이 값만 true로 켜면 된다.
 */
const UPLOAD_ORIGINAL = false;

/** 업로드 직전 파일 변환. 정책을 한 곳에 모아 두 업로드 경로가 같은 규칙을 쓰게 한다. */
export async function prepareUploadFile(file: File): Promise<File> {
    if (UPLOAD_ORIGINAL) return file;
    return compressImage(file);
}
