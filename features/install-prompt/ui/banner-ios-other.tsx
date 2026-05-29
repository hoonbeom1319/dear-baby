'use client';

import { Icon } from '@/shared/ui';

type Props = { onDismiss: () => void };

export function BannerIosOther({ onDismiss }: Props) {
    return (
        <div
            className="fixed right-0 bottom-0 left-0 z-[2000] border-t border-border bg-surface px-4 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
            <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Dear Baby" className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm" />
                <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-surface-foreground">앱으로 설치하려면</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                        iPhone은 <strong className="font-medium text-surface-foreground">Safari</strong>로 열어야 홈 화면에 추가할 수 있어요
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="닫기"
                    className="shrink-0 rounded-full p-1.5 text-muted hover:bg-neutral-100"
                >
                    <Icon name="x" size={14} />
                </button>
            </div>
        </div>
    );
}
