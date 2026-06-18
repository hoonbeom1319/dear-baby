'use client';

type SaveBarProps = {
    count: number;
    disabled: boolean;
    saving: boolean;
    onSave: () => void;
};

/** 평상시 하단 저장 바 — 흰 페이드 위 CTA. 이름 있는 장소 N곳을 지도에 남긴다. */
export function SaveBar({ count, disabled, saving, onSave }: SaveBarProps) {
    return (
        <div
            className="absolute inset-x-0 bottom-0 z-20 px-4 pt-9"
            style={{
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 14px)',
                background: 'linear-gradient(180deg, rgba(241,245,249,0), #F1F5F9 36%)'
            }}
        >
            <button
                type="button"
                onClick={onSave}
                disabled={disabled || saving}
                className="h-[54px] w-full rounded-[14px] bg-primary-600 text-[16px] font-bold text-white transition-colors hover:bg-primary-700 disabled:opacity-40"
                style={{ boxShadow: '0 10px 22px -8px oklch(64.6% 0.222 41.116 / 0.5)' }}
            >
                {saving ? '저장 중…' : `저장 · 지도에 ${count}곳 남기기`}
            </button>
        </div>
    );
}
