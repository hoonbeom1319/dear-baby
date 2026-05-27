'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type State = 'hidden' | 'android' | 'ios';

const DISMISSED_KEY = 'pwa_dismissed_at';
const HIDE_FOR_MS = 30 * 24 * 60 * 60 * 1000; // 30일

function isStandalone() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as { standalone?: boolean }).standalone === true
    );
}

function isDismissedRecently() {
    const ts = localStorage.getItem(DISMISSED_KEY);
    return ts ? Date.now() - Number(ts) < HIDE_FOR_MS : false;
}

export function InstallBanner() {
    const [state, setState] = useState<State>('hidden');
    const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        if (isStandalone() || isDismissedRecently()) return;

        // Android / Chrome / Samsung Browser
        const handler = (e: Event) => {
            e.preventDefault();
            setPrompt(e as BeforeInstallPromptEvent);
            setState('android');
        };
        window.addEventListener('beforeinstallprompt', handler);

        // iOS Safari (beforeinstallprompt 미지원)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        if (isIOS && isSafari) setState('ios');

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const dismiss = () => {
        localStorage.setItem(DISMISSED_KEY, String(Date.now()));
        setState('hidden');
    };

    const install = async () => {
        if (!prompt) return;
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') setState('hidden');
        setPrompt(null);
    };

    if (state === 'hidden') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[2000] border-t border-border bg-surface px-4 pb-safe-area-inset-bottom pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center gap-3">
                {/* 앱 아이콘 */}
                <img src="/icon.png" alt="Dear Baby" className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm" />

                <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-surface-foreground">Dear Baby</p>
                    {state === 'ios' ? (
                        <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                            하단{' '}
                            <span className="inline-flex items-center gap-0.5 font-medium text-surface-foreground">
                                <ShareIcon />
                                공유
                            </span>{' '}
                            버튼 → <strong className="font-medium text-surface-foreground">홈 화면에 추가</strong>
                        </p>
                    ) : (
                        <p className="mt-0.5 text-[12px] text-muted">홈 화면에 추가하고 앱처럼 쓰기</p>
                    )}
                </div>

                {state === 'android' && (
                    <button
                        type="button"
                        onClick={install}
                        className="shrink-0 rounded-lg bg-primary-400 px-4 py-2 text-xs font-semibold text-white active:opacity-80">
                        설치
                    </button>
                )}

                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="닫기"
                    className="shrink-0 rounded-full p-1.5 text-muted hover:bg-slate-100">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
                        <path d="M12.854 3.854a.5.5 0 0 0-.708-.708L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function ShareIcon() {
    return (
        <svg viewBox="0 0 24 24" className="inline h-3.5 w-3.5 fill-none stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
        </svg>
    );
}
