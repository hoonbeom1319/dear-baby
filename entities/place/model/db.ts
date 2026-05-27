import type { AmenityId, AreaId, CategoryId } from '@/shared/config';

import type { Place, PlaceAdmin, PlaceStatus } from './types';

/** Supabase places 테이블 row. */
export type PlaceRow = {
    id: string;
    area: string;
    category: string;
    name: string;
    address: string;
    phone: string;
    age_range: string;
    description: string;
    amenities: string[];
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
        amenities: row.amenities as AmenityId[],
    };
}

export function mapPlaceAdminRow(row: PlaceRow): PlaceAdmin {
    return {
        ...mapPlaceRow(row),
        sortOrder: row.sort_order,
        status: row.status as PlaceStatus,
    };
}
