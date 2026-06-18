import { SDK_URL } from './const';
import type { LatLng, Latitude, Longitude } from './type';

/**
 * 십진수도 좌표(lat –90~90, lng –180~180)를 검증해 LatLng로 만든다.
 * 범위를 벗어나면(예: ×10⁷ 원시값을 그대로 넣은 경우) null을 반환한다.
 * LatLng를 얻는 유일한 경로 — 임의 number 객체는 브랜드 때문에 타입에러가 난다.
 */
export const toLatLng = (lat: number, lng: number): LatLng | null => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return null;
    }
    return { lat: lat as Latitude, lng: lng as Longitude };
};

// SDK는 페이지에서 한 번만 주입한다. 여러 맵이 동시에 마운트돼도 이 promise를 공유한다.
let loadPromise: Promise<void> | null = null;

export const loadKakaoSdk = (): Promise<void> => {
    if (loadPromise) return loadPromise;

    loadPromise = new Promise<void>((resolve, reject) => {
        // appkey가 없으면(주로 배포 환경 env 누락) SDK URL이 appkey=undefined가 돼 조용히 실패한다 → 먼저 거른다.
        if (!process.env.NEXT_PUBLIC_KAKAO_APP_KEY) {
            reject(new Error('NEXT_PUBLIC_KAKAO_APP_KEY 누락 — 배포 환경 환경변수를 확인하세요(지도·장소 검색·역지오코딩 비활성).'));
            return;
        }
        // 이미 로드된 경우(HMR·재마운트) kakao.maps.load는 콜백을 즉시 실행한다.
        if (window.kakao?.maps) {
            window.kakao.maps.load(() => resolve());
            return;
        }
        const script = document.createElement('script');
        script.src = SDK_URL;
        script.async = true;
        // autoload=false라 스크립트 로드만으로는 부족하다. kakao.maps.load로 초기화까지 끝내야 ready.
        script.onload = () => window.kakao.maps.load(() => resolve());
        // 로드 실패는 대개 카카오 JS키 플랫폼 도메인에 현재 주소가 미등록된 경우다.
        script.onerror = () => reject(new Error('Kakao Maps SDK 로드 실패 — 카카오 콘솔 JS키 플랫폼 도메인에 현재 주소가 등록됐는지 확인하세요.'));
        document.head.appendChild(script);
    });

    return loadPromise;
};
