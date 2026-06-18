'use client';

import { Icon } from '@/shared/ui';

type SelectionBarProps = {
    count: number;
    onUnassign: () => void;
    onMove: () => void;
    onClear: () => void;
};

/** 사진 선택 중 하단 다크 바 — 빼기(미분류로) / 장소로 이동. (편집기의 핵심 인터랙션) */
export function SelectionBar({ count, onUnassign, onMove, onClear }: SelectionBarProps) {
    return (
        <div
            className="absolute inset-x-0 bottom-0 z-30 flex animate-[db-up_0.2s_ease] items-center gap-2.5 bg-[#0F172A] px-4 pt-3.5"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}
        >
            <span className="mr-auto text-[14px] font-semibold text-white">{count}장 선택됨</span>
            <button type="button" onClick={onUnassign} className="h-10 rounded-[10px] border border-[#475569] px-3.5 text-[14px] font-semibold text-[#CBD5E1]">
                빼기
            </button>
            <button type="button" onClick={onMove} className="h-10 rounded-[10px] bg-primary-600 px-4 text-[14px] font-semibold text-white">
                장소로 이동
            </button>
            <button type="button" onClick={onClear} aria-label="선택 해제" className="flex h-10 w-10 items-center justify-center text-[#94A3B8]">
                <Icon name="x" size={22} />
            </button>
        </div>
    );
}
