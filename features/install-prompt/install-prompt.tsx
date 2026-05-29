'use client';

import { useEffect, useState } from 'react';

import { DISMISSED_KEY, isDismissedRecently, isStandalone } from './lib/helpers';
import { useSwRegistrar } from './model/use-sw-registrar';
import { BannerAndroid } from './ui/banner-android';
import { BannerIos } from './ui/banner-ios';
import { BannerIosOther } from './ui/banner-ios-other';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type State = 'hidden' | 'android' | 'ios' | 'ios-other';

export function InstallPrompt() {
    const [state, setState] = useState<State>(() => {
        if (isStandalone() || isDismissedRecently()) return 'hidden';
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        if (isIOS && /CriOS|FxiOS|OPiOS/.test(ua)) return 'ios-other';
        if (isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS/.test(ua)) return 'ios';
        return 'hidden';
    });
    const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useSwRegistrar();

    const dismiss = () => {
        localStorage.setItem(DISMISSED_KEY, String(Date.now()));
        setState('hidden');
    };

    const openShareSheet = () => {
        if (navigator.share) {
            navigator.share({ title: 'Dear Baby', url: window.location.href }).catch(() => {});
        }
    };

    const install = async () => {
        if (!prompt) return;
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') setState('hidden');
        setPrompt(null);
    };

    useEffect(() => {
        if (isStandalone() || isDismissedRecently()) return;
        const handler = (e: Event) => {
            e.preventDefault();
            setPrompt(e as BeforeInstallPromptEvent);
            setState('android');
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    if (state === 'hidden') return null;
    if (state === 'ios-other') return <BannerIosOther onDismiss={dismiss} />;
    if (state === 'ios') return <BannerIos onDismiss={dismiss} onShare={openShareSheet} />;
    return <BannerAndroid onDismiss={dismiss} onInstall={install} />;
}
