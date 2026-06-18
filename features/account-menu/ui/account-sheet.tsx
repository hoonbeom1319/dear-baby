'use client';

import { Icon } from '@/shared/ui';

import { Sheet } from '@/hbds/overlay/sheet';

type AccountSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    displayName: string | null;
    avatarUrl: string | null;
    version: string;
    onLogout: () => void;
};

/**
 * 지도 홈 아바타 → 계정 시트. 프로필(이름·아바타) + 로그아웃 + 앱 버전.
 * 데이터·로그아웃 동작은 상위(screens/home)가 주입한다(LoginSheet와 같은 dumb feature 패턴).
 */
export function AccountSheet({ open, onOpenChange, displayName, avatarUrl, version, onLogout }: AccountSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} title="내 계정">
            <div className="flex items-center gap-3 pb-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50 text-primary-600">
                    {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : <Icon name="user" size={24} stroke={1.9} />}
                </span>
                <p className="min-w-0 truncate text-[16px] font-bold text-surface-foreground">{displayName?.trim() || '우리 가족'}</p>
            </div>

            <button
                type="button"
                onClick={onLogout}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] border border-border text-[15px] font-semibold text-surface-foreground transition-colors hover:bg-neutral-50"
            >
                <Icon name="logout" size={18} stroke={1.9} />
                로그아웃
            </button>

            <p className="mt-4 text-center text-[12px] text-muted tabular-nums">버전 {version}</p>
        </Sheet>
    );
}
