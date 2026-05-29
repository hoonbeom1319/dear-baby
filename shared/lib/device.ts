const ua = () => navigator.userAgent;

export const isIOS = () => /iPad|iPhone|iPod/.test(ua());
export const isAndroid = () => /Android/.test(ua());
export const isMobile = () => isIOS() || isAndroid();
export const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
export const isWebView = () => 'ReactNativeWebView' in window;
export const isApp = () => isStandalone() || isWebView();

export type Device = 'ios-safari' | 'ios-other' | 'android' | 'desktop';

export const getDevice = (): Device => {
    if (isIOS()) return /CriOS|FxiOS|OPiOS/.test(ua()) ? 'ios-other' : 'ios-safari';
    if (isAndroid()) return 'android';
    return 'desktop';
};
