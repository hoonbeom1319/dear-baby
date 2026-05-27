'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type State = 'hidden' | 'android' | 'ios' | 'ios-other';

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
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        const isIOSOtherBrowser = isIOS && /CriOS|FxiOS|OPiOS/.test(ua);
        const isSafari = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS/.test(ua);
        if (isIOSOtherBrowser) setState('ios-other');
        else if (isSafari) setState('ios');

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const dismiss = () => {
        localStorage.setItem(DISMISSED_KEY, String(Date.now()));
        setState('hidden');
    };

    const openShareSheet = async () => {
        if (navigator.share) {
            await navigator.share({ title: 'Dear Baby', url: window.location.href }).catch(() => {});
        }
    };

    const install = async () => {
        if (!prompt) return;
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') setState('hidden');
        setPrompt(null);
    };

    if (state === 'hidden') return null;

    if (state === 'ios-other') {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-[2000] border-t border-border bg-surface px-4 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
                style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[2000] border-t border-border bg-surface px-4 pb-safe-area-inset-bottom pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center gap-3">
                {/* 앱 아이콘 */}
                <img src="/icon.png" alt="Dear Baby" className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm" />

                <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-surface-foreground">Dear Baby</p>
                    {state === 'ios' ? (
                        <p className="mt-0.5 text-[12px] text-muted">
                            탭하면 공유 시트가 열려요 → <strong className="font-medium text-surface-foreground">홈 화면에 추가</strong>
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
                {state === 'ios' && (
                    <button
                        type="button"
                        onClick={openShareSheet}
                        className="shrink-0 rounded-lg bg-primary-400 px-3 py-2 text-xs font-semibold text-white active:opacity-80">
                        <ShareIcon className="h-4 w-4" />
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

function ShareIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className ?? 'inline h-3.5 w-3.5'} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
        </svg>
    );
}
