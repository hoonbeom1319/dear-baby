'use client';

import { Sheet } from '@/hbds/overlay/sheet';

type ConfirmSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    onConfirm: () => void;
};

/**
 * 모바일 바텀시트 확인. 되돌릴 수 없는 삭제(장소·방문) 전에 띄운다.
 * hbds confirm은 데스크톱(min-w 500px)용이라 모바일 셸에 안 맞아 별도로 둔다.
 */
export function ConfirmSheet({ open, onOpenChange, title, description, confirmLabel = '삭제', onConfirm }: ConfirmSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} title={title} description={description}>
            <div className="mt-1 flex gap-2.5">
                <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="h-[52px] flex-1 rounded-[12px] border border-border text-[15px] font-semibold text-surface-foreground transition-colors hover:bg-neutral-50"
                >
                    취소
                </button>
                <button
                    type="button"
                    onClick={() => {
                        onConfirm();
                        onOpenChange(false);
                    }}
                    className="h-[52px] flex-1 rounded-[12px] bg-[#DC2626] text-[15px] font-bold text-white transition-colors hover:bg-[#B91C1C]"
                >
                    {confirmLabel}
                </button>
            </div>
        </Sheet>
    );
}
