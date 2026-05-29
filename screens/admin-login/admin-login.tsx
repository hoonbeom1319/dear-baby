'use client';

import { useRouter } from 'next/navigation';

/**
 * 관리자 로그인 (PRD A-1). 사용자 소셜 로그인을 재사용하고 User의 '관리자 여부'로 권한 식별.
 * 사이드바 없는 전체 화면 카드.
 */
export const AdminLogin = () => {
    const router = useRouter();

    return (
        <div className="flex min-h-dvh items-center justify-center bg-neutral-50 p-8">
            <div className="w-[400px] max-w-full rounded-2xl border border-border bg-surface p-8 shadow-lg">
                <div className="mb-2.5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-neutral-900 text-sm font-bold tracking-[-0.02em] text-white">
                        db
                    </span>
                    <div>
                        <div className="text-lg font-bold tracking-[-0.02em] text-surface-foreground">Dear Baby Admin</div>
                        <div className="mt-0.5 text-xs text-muted">운영자 대시보드</div>
                    </div>
                </div>

                <p className="my-4 mb-6 text-[13px] leading-relaxed text-muted">
                    운영자 권한이 있는 계정만 들어올 수 있어요.
                    <br />
                    소셜 로그인 후 권한이 자동으로 확인됩니다.
                </p>

                <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="mb-2 flex h-11 w-full items-center justify-center rounded-[9px] text-sm font-semibold"
                    style={{ background: '#FEE500', color: '#191600' }}>
                    카카오로 로그인
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="flex h-11 w-full items-center justify-center rounded-[9px] border border-border bg-surface text-sm font-medium text-surface-foreground transition-colors hover:bg-neutral-50">
                    네이버로 로그인
                </button>

                <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
                    사용자 소셜 로그인 재사용. User 엔터티의
                    <br />
                    &lsquo;관리자 여부&rsquo; 플래그로 권한을 식별해요. <span className="text-primary-600">(A-1)</span>
                </p>
            </div>
        </div>
    );
};
