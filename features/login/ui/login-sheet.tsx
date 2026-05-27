'use client';

import { useState } from 'react';

import { getSupabaseBrowser } from '@/shared/lib';
import { Sheet } from '@/shared/ui';

type Provider = 'kakao' | 'naver' | 'apple';

type LoginSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: () => void;
    recent?: Provider;
};

type ProviderDef = {
    id: Provider;
    name: string;
    mark: string;
    style: React.CSSProperties;
} & ({ kind: 'supabase'; supabaseId: string } | { kind: 'custom'; href: string });

const PROVIDERS: ProviderDef[] = [
    { id: 'kakao', name: '카카오로 시작하기', mark: 'K', style: { background: '#FEE500', color: '#191600' }, kind: 'custom', href: '/api/auth/kakao' },
    { id: 'naver', name: '네이버로 시작하기', mark: 'N', style: { background: '#03C75A', color: '#ffffff' }, kind: 'custom', href: '/api/auth/naver' },
    { id: 'apple', name: 'Apple로 시작하기',  mark: '', style: { background: '#000000', color: '#ffffff' }, kind: 'supabase', supabaseId: 'apple' },
];

export const LoginSheet = ({ open, onOpenChange, recent = 'kakao' }: LoginSheetProps) => {
    const [loading, setLoading] = useState<Provider | null>(null);

    const handleLogin = async (provider: ProviderDef) => {
        setLoading(provider.id);

        if (provider.kind === 'custom') {
            // 네이버: 커스텀 OAuth 라우트로 리다이렉트
            window.location.href = provider.href;
            return;
        }

        // 카카오 / Apple: Supabase 네이티브 OAuth
        const supabase = getSupabaseBrowser();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider.supabaseId as Parameters<typeof supabase.auth.signInWithOAuth>[0]['provider'],
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            alert(`로그인 오류: ${error.message}\n\nSupabase 대시보드에서 해당 OAuth 프로바이더가 활성화되어 있는지 확인하세요.`);
            setLoading(null);
        }
        // 성공 시 브라우저가 리다이렉트되어 이 컴포넌트는 더 이상 실행되지 않음
    };

    return (
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
                        disabled={loading !== null}
                        onClick={() => handleLogin(provider)}
                        className="flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface p-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60">
                        <span
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                            style={provider.style}>
                            {loading === provider.id ? '…' : provider.mark}
                        </span>
                        <span className="flex-1 text-sm font-medium text-surface-foreground">{provider.name}</span>
                        {recent === provider.id && loading === null && (
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
};
