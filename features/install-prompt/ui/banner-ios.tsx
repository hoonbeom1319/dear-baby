'use client';

import { Share1Icon } from '@radix-ui/react-icons';

import { Icon } from '@/shared/ui';

type Props = { onDismiss: () => void; onShare: () => void };

export function BannerIos({ onDismiss, onShare }: Props) {
    return (
        <div
            className="fixed right-0 bottom-0 left-0 z-[2000] border-t border-border bg-surface px-4 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
            <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Dear Baby" className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm" />
                <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-surface-foreground">Dear Baby</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                        탭하면 공유 시트가 열려요 → <strong className="font-medium text-surface-foreground">홈 화면에 추가</strong>
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onShare}
                    aria-label="공유 시트 열기"
                    className="shrink-0 rounded-lg bg-primary-400 px-3 py-2 text-white active:opacity-80"
                >
                    <Share1Icon className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="닫기"
                    className="shrink-0 rounded-full p-1.5 text-muted hover:bg-slate-100"
                >
                    <Icon name="x" size={14} />
                </button>
            </div>
        </div>
    );
}
