'use client';

import { Sheet } from '@/shared/ui';

type Provider = 'kakao' | 'naver' | 'apple';

type LoginSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** OAuth 완료 콜백. 호출 시 원래 보던 화면으로 복귀 + 대기 동작 수행. (PRD 7.5) */
    onComplete: () => void;
    /** 마지막 로그인 수단 — "최근 로그인" 라벨만 붙는다. 버튼 순서는 고정. (PRD F-12) */
    recent?: Provider;
};

const PROVIDERS: { id: Provider; name: string; mark: string; style: React.CSSProperties }[] = [
    { id: 'kakao', name: '카카오로 시작하기', mark: 'K', style: { background: '#FEE500', color: '#191600' } },
    { id: 'naver', name: '네이버로 시작하기', mark: 'N', style: { background: '#03C75A', color: '#ffffff' } },
    { id: 'apple', name: 'Apple로 시작하기', mark: '', style: { background: '#000000', color: '#ffffff' } }
];

export const LoginSheet = ({ open, onOpenChange, onComplete, recent = 'kakao' }: LoginSheetProps) => (
    <Sheet
        open={open}
        onOpenChange={onOpenChange}
        title="로그인이 필요해요"
        description={
            <>
                즐겨찾기는 기기 간 동기화되어요.
                <br />
                1초면 시작할 수 있어요.
            </>
        }>
        <div className="flex flex-col gap-2">
            {PROVIDERS.map((provider) => (
                <button
                    key={provider.id}
                    type="button"
                    onClick={onComplete}
                    className="flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface p-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50">
                    <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={provider.style}>
                        {provider.mark}
                    </span>
                    <span className="flex-1 text-sm font-medium text-surface-foreground">{provider.name}</span>
                    {recent === provider.id && (
                        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            최근 로그인
                        </span>
                    )}
                </button>
            ))}
        </div>
        <p className="mt-3.5 text-center text-[11px] leading-relaxed text-muted">
            시작과 동시에 <span className="underline">이용약관</span>과 <span className="underline">개인정보 처리방침</span>에 동의하게 됩니다
        </p>
    </Sheet>
);
