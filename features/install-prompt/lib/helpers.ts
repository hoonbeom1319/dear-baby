export const DISMISSED_KEY = 'pwa_dismissed_at';
const HIDE_FOR_MS = 30 * 24 * 60 * 60 * 1000;

export function isStandalone() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as { standalone?: boolean }).standalone === true
    );
}

export function isDismissedRecently() {
    const ts = localStorage.getItem(DISMISSED_KEY);
    return ts ? Date.now() - Number(ts) < HIDE_FOR_MS : false;
}
