import type { Place } from './types';

/**
 * 디자인 구현용 샘플 데이터. Supabase 연동 시 제거하고 placeQueries(api)로 대체한다.
 * 출처: Claude Design 핸드오프(Dear Baby Hi-Fi) 시안 데이터.
 */
export const PLACES: Place[] = [
    {
        id: 'p1',
        area: 'songpa',
        category: 'cafe',
        name: '올리브 베이커리 카페',
        address: '서울 송파구 올림픽로 240',
        phone: '02-1234-5678',
        ageRange: '6개월~',
        description: '넓은 통로와 별실이 있어 유모차 손님이 많아요. 평일 오전이 가장 한산합니다.',
        amenities: ['nurse', 'diaper', 'chair', 'stroll']
    },
    {
        id: 'p2',
        area: 'songpa',
        category: 'rest',
        name: '동네 한정식 — 솔밭',
        address: '서울 송파구 백제고분로 32-7',
        phone: '02-2233-4400',
        ageRange: '12개월~',
        description: '좌식 룸이 있어서 누워 노는 아기와 가기 좋아요. 룸은 예약 권장.',
        amenities: ['chair', 'park']
    },
    {
        id: 'p3',
        area: 'songpa',
        category: 'kids',
        name: '잠실 키즈빌리지',
        address: '서울 송파구 올림픽로 300 4F',
        phone: '02-3000-1234',
        ageRange: '12~48개월',
        description: '월령별 존이 나뉘어 있어요. 주말은 입장 제한이 있으니 예약 필수.',
        amenities: ['nurse', 'diaper', 'chair', 'stroll', 'park']
    },
    {
        id: 'p4',
        area: 'songpa',
        category: 'mall',
        name: '롯데월드몰 패밀리존',
        address: '서울 송파구 올림픽로 300',
        phone: '02-3213-0000',
        ageRange: '전 연령',
        description: '수유실/기저귀갈이대 모두 깨끗하게 관리되고, 유모차 대여도 가능해요.',
        amenities: ['nurse', 'diaper', 'stroll', 'park']
    },
    {
        id: 'p5',
        area: 'unjeong',
        category: 'cafe',
        name: '운정 가든 카페',
        address: '경기 파주시 와석순환로 480',
        phone: '031-940-1100',
        ageRange: '전 연령',
        description: '잔디 마당이 넓어서 걷기 시작한 아기가 뛰어다니기 좋아요.',
        amenities: ['chair', 'stroll']
    },
    {
        id: 'p6',
        area: 'unjeong',
        category: 'rest',
        name: '운정 한식당',
        address: '경기 파주시 한울로 73',
        phone: '031-940-2200',
        ageRange: '12개월~',
        description: '한 끼 든든하게. 아기 의자는 4개 있어요, 주말엔 빨리 차요.',
        amenities: ['diaper', 'chair']
    }
];

export const getPlace = (id: string) => PLACES.find((place) => place.id === id);
