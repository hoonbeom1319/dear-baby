import { create } from 'zustand';

/** 방금 저장한 기록 요약 — 편집기(A-3 저장)가 채우고 저장완료(A-4)가 읽는다. */
export type SavedResult = {
    placeIds: string[];
    placeNames: string[];
    date: string; // YYYY-MM-DD
};

type SavedResultStore = {
    result: SavedResult | null;
    setResult: (result: SavedResult) => void;
    clear: () => void;
};

export const useSavedResult = create<SavedResultStore>((set) => ({
    result: null,
    setResult: (result) => set({ result }),
    clear: () => set({ result: null })
}));
