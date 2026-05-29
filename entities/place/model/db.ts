import type { AmenityId, AreaId, CategoryId } from '@/shared/config';

import type { Place, PlaceAdmin, PlaceStatus } from './types';

/** Supabase places 테이블 row (place_amenities 조인 포함). */
export type PlaceRow = {
    id: string;
    area: string;
    category: string;
    name: string;
    address: string;
    phone: string;
    age_range: string;
    description: string;
    place_amenities: { amenity_id: string }[];
    sort_order: number;
    status: string;
};

export function mapPlaceRow(row: PlaceRow): Place {
    return {
        id: row.id,
        area: row.area as AreaId,
        category: row.category as CategoryId,
        name: row.name,
        address: row.address,
        phone: row.phone,
        ageRange: row.age_range,
        description: row.description,
        amenities: (row.place_amenities ?? []).map((r) => r.amenity_id as AmenityId)
    };
}

export function mapPlaceAdminRow(row: PlaceRow): PlaceAdmin {
    return {
        ...mapPlaceRow(row),
        sortOrder: row.sort_order,
        status: row.status as PlaceStatus
    };
}
