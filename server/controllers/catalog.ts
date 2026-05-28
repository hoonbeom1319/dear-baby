'use server';

import type { Amenity, Area, Category } from '@/shared/config';

import { findAmenities, findAreas, findCategories } from '../dao/catalog';

export async function fetchAreas(): Promise<Area[]> {
    return findAreas();
}

export async function fetchCategories(): Promise<Category[]> {
    return findCategories();
}

export async function fetchAmenities(): Promise<Amenity[]> {
    return findAmenities();
}
