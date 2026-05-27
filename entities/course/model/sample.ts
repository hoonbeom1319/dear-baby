import type { AreaId } from '@/shared/config';

import type { Course } from './types';

/**
 * 디자인 구현용 샘플 데이터. Supabase 연동 시 제거한다.
 * 출처: Claude Design 핸드오프(Dear Baby Hi-Fi) 시안 데이터.
 */
export const COURSES: Course[] = [
    {
        id: 'c1',
        area: 'songpa',
        title: '키즈카페 → 점심 → 디저트 코스',
        duration: '약 4시간',
        season: '사계절',
        description: '오전에 에너지를 빼고 점심 먹은 뒤 카페에서 마무리. 잠실 일대로 이동 거리가 짧아요.',
        stopIds: ['p3', 'p2', 'p1'],
        comments: [
            '월 12개월 이상 추천. 1시간 정도 신나게 놀고 점심 시간 직전에 나오세요.',
            '도보 7분. 한정식 룸은 미리 전화 예약하시면 확실해요.',
            '베이커리 카페에서 한숨 돌리며 아기 낮잠 타이밍 맞추기 좋아요.'
        ]
    },
    {
        id: 'c2',
        area: 'songpa',
        title: '쇼핑몰 패밀리존 + 카페 코스',
        duration: '약 3시간',
        season: '사계절',
        description: '비 오는 날이나 더운 날에 좋은 실내 코스.',
        stopIds: ['p4', 'p1'],
        comments: [
            '패밀리존에서 1~2시간. 수유실 위치는 4층 가장 안쪽이에요.',
            '몰에서 도보 5분. 아기띠 채로 들어가도 편한 자리가 많아요.'
        ]
    },
    {
        id: 'c3',
        area: 'unjeong',
        title: '운정 야외 + 점심 코스',
        duration: '약 3시간',
        season: '봄·가을',
        description: '아기가 잔디에서 뛰어 놀고 점심 먹는 가벼운 외출.',
        stopIds: ['p5', 'p6'],
        comments: ['주말 오전 11시 전후가 가장 한산해요.', '차로 8분. 주차장에서 식당까지 평지라 유모차 끌기 좋아요.']
    }
];

export const getCourse = (id: string) => COURSES.find((course) => course.id === id);

export const listCoursesByArea = (area: AreaId) => COURSES.filter((course) => course.area === area);

/** 이 장소가 정거장으로 포함된 코스 — "함께 가면 좋은 코스"용. (PRD F-11) */
export const listCoursesByStop = (placeId: string) => COURSES.filter((course) => course.stopIds.includes(placeId));
