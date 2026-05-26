import type { IconName } from '@/shared/ui';

/**
 * 디자인 시안 기준의 참조 데이터 — 동네 · 카테고리 · 편의시설.
 * 자유 입력이 아니라 미리 정한 목록에서만 선택한다. (PRD 10.3)
 * Supabase 연동 시 Area / Category / Amenity 엔터티 데이터 레이어로 대체된다. (PRD 6.1)
 */
export type AreaId = 'songpa' | 'unjeong' | 'gangdong' | 'mapo';
export type CategoryId = 'all' | 'cafe' | 'rest' | 'kids' | 'mall';
export type AmenityId = 'nurse' | 'diaper' | 'chair' | 'stroll' | 'park';

export type Area = { id: AreaId; name: string };
export type Category = { id: CategoryId; name: string };
export type Amenity = { id: AmenityId; short: string; icon: IconName };

export const AREAS: Area[] = [
    { id: 'songpa', name: '송파' },
    { id: 'unjeong', name: '운정' },
    { id: 'gangdong', name: '강동' },
    { id: 'mapo', name: '마포' }
];

export const CATEGORIES: Category[] = [
    { id: 'all', name: '전체' },
    { id: 'cafe', name: '카페' },
    { id: 'rest', name: '식당' },
    { id: 'kids', name: '키즈카페' },
    { id: 'mall', name: '복합몰' }
];

export const AMENITIES: Amenity[] = [
    { id: 'nurse', short: '수유실', icon: 'amen-nurse' },
    { id: 'diaper', short: '기저귀', icon: 'amen-diaper' },
    { id: 'chair', short: '아기의자', icon: 'amen-chair' },
    { id: 'stroll', short: '유모차', icon: 'amen-stroll' },
    { id: 'park', short: '주차', icon: 'amen-park' }
];

export const getArea = (id: AreaId) => AREAS.find((area) => area.id === id);
export const getCategory = (id: CategoryId) => CATEGORIES.find((category) => category.id === id);
export const getAmenity = (id: AmenityId) => AMENITIES.find((amenity) => amenity.id === id);
