export const DISMISSED_KEY = 'pwa_dismissed_at';
const HIDE_FOR_MS = 24 * 60 * 60 * 1000;

export const isDismissedRecently = () => {
    const ts = localStorage.getItem(DISMISSED_KEY);
    return ts ? Date.now() - Number(ts) < HIDE_FOR_MS : false;
};
