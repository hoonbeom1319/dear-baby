'use client';

import { UAParser } from 'ua-parser-js';

/**
 * 모바일 기기 여부 확인
 * @returns 모바일/태블릿 기기 여부
 */
export const isMobile = () => {
    if (typeof navigator === 'undefined') return false;

    const { userAgent } = navigator;
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const deviceType = device.type;

    return deviceType === 'tablet' || deviceType === 'mobile' || parser.getBrowser().name === 'Samsung Browser';
};

/**
 * 운영체제 확인
 * @returns 운영체제 타입 ('IOS', 'ANDROID', 'WEB')
 */
export const checkOS = () => {
    if (typeof navigator === 'undefined') return 'WEB';

    const { userAgent } = navigator;
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    if (ua.device.type !== 'mobile' && ua.device.type !== 'tablet') return 'WEB';
    if (ua.os.name === 'iOS') return 'IOS';
    if (ua.os.name === 'Android') return 'ANDROID';

    return 'WEB';
};

/**
 * iOS 기기 여부 확인
 * @returns iOS 기기 여부
 */
export const isIOS = () => {
    if (typeof navigator === 'undefined') return false;

    const { userAgent } = navigator;
    const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    return /iPad|iPhone|iPod/i.test(userAgent) || isIpadOS;
};
