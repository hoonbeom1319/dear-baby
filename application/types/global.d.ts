/** 카카오 Maps SDK — https://dapi.kakao.com/v2/maps/sdk.js 로드 시 window.kakao */
declare global {
    interface Window {
        kakao: typeof kakao;
    }
}

export {};
