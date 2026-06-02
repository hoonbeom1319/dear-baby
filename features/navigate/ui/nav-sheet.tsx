'use client';

import { Sheet } from '@/hbds/overlay/sheet';
import { Icon } from '@/shared/ui';

type NavSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** 내비 앱 선택 — 딥링크는 좌표 + 장소 이름을 함께 싣는다. (PRD 부록 5단계 메모-2) */
    onPick: (appName: string) => void;
    onCopyAddress: () => void;
};

const NAV_APPS: { id: string; name: string; mark: string; meta: string; style: React.CSSProperties }[] = [
    { id: 'kakao', name: '카카오내비', mark: 'K', meta: '가장 가까운 경로', style: { background: '#FEE500', color: '#191600' } },
    { id: 'tmap', name: '티맵', mark: 'T', meta: '실시간 교통 반영', style: { background: '#1B64DA', color: '#ffffff' } },
    { id: 'naver', name: '네이버 지도', mark: 'N', meta: '도보·대중교통 같이', style: { background: '#03C75A', color: '#ffffff' } }
];

export const NavSheet = ({ open, onOpenChange, onPick, onCopyAddress }: NavSheetProps) => (
    <Sheet open={open} onOpenChange={onOpenChange} title="어떤 앱으로 갈까요?" description="미설치 시 자동으로 주소 복사로 대체돼요">
        <div className="flex flex-col gap-2">
            {NAV_APPS.map((app) => (
                <button
                    key={app.id}
                    type="button"
                    onClick={() => onPick(app.name)}
                    className="flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface p-3 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold" style={app.style}>
                        {app.mark}
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-surface-foreground">{app.name}</div>
                        <div className="text-[11px] text-muted">{app.meta}</div>
                    </div>
                    <Icon name="right" size={16} className="text-neutral-400" />
                </button>
            ))}
        </div>
        <div className="my-2 h-px bg-border" />
        <button
            type="button"
            onClick={onCopyAddress}
            className="flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface p-3 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                <Icon name="copy" size={16} stroke={2} />
            </span>
            <span className="flex-1 text-sm font-medium text-surface-foreground">주소 복사</span>
        </button>
    </Sheet>
);
