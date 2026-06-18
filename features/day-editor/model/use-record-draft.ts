import { create } from 'zustand';

/**
 * 기록 세션의 입력 핸드오프 — A-2(사진 선택)가 고른 파일을 담고, A-3(편집기)가 읽는다.
 * File[]은 URL/직렬화로 라우트를 건널 수 없어 인메모리 store로 넘긴다(세션 한정 UI 상태).
 * 편집기의 그룹·선택 등 풍부한 편집 상태는 여기 두지 않는다 — 편집기 로컬 상태의 몫.
 */
type RecordDraftStore = {
    /** A-2에서 고른 사진 원본. 빈 배열이면 사진 없이 장소만 기록(F-5). */
    files: File[];
    setFiles: (files: File[]) => void;
    reset: () => void;
};

export const useRecordDraft = create<RecordDraftStore>((set) => ({
    files: [],
    setFiles: (files) => set({ files }),
    reset: () => set({ files: [] })
}));
