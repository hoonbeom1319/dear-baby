'use client';

import { useMediaQuery } from '@/shared/hooks';
import { Icon } from '@/shared/ui';

type EmptyStateProps = {
    onPick: () => void;
    onSkip: () => void;
};

/**
 * 사진을 아직 안 고른 상태. 웹은 갤러리를 못 그리므로 OS 피커를 여는 진입점이 필요하다.
 * F-5 샛길(사진 없이 장소만)도 여기서 함께 연다.
 */
export function EmptyState({ onPick, onSkip }: EmptyStateProps) {
    // 마우스 환경(PC)에서만 드래그 힌트를 보인다 — 터치 기기엔 끌어놓기 개념이 없다.
    const canDrag = useMediaQuery('(pointer: fine)');

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
            <span className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-[18px] border border-primary-100 bg-primary-50 text-primary-600">
                <Icon name="image" size={28} stroke={1.9} />
            </span>
            <h1 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#0F172A] [word-break:keep-all]">하루치 사진을 골라주세요</h1>
            <p className="mt-2.5 text-[14px] leading-[1.6] text-[#64748B] [word-break:keep-all]">
                위치·시간 정보로 장소를 자동 정리해드려요.
                <br />
                여러 장을 한 번에 고를 수 있어요.
            </p>
            <button
                type="button"
                onClick={onPick}
                className="mt-7 flex h-[54px] w-full items-center justify-center rounded-[14px] bg-primary-600 text-[16px] font-bold text-white transition-colors hover:bg-primary-700"
                style={{ boxShadow: '0 10px 22px -8px oklch(64.6% 0.222 41.116 / 0.5)' }}
            >
                사진 고르기
            </button>
            {canDrag && <p className="mt-3 text-[13px] text-[#94A3B8]">또는 사진을 이 화면에 끌어다 놓으세요</p>}
            <button type="button" onClick={onSkip} className="mt-3 text-[14px] font-medium text-[#64748B] transition-colors hover:text-[#334155]">
                사진 없이 장소만 추가
            </button>
        </div>
    );
}
