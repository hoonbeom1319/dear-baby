'use server';

import type { Amenity, Area, Category, Region } from '@/shared/config';

import { findAmenities, findAreas, findCategories, findRegions } from '../dao/catalog';

export async function fetchRegions(): Promise<Region[]> {
    return findRegions();
}

export async function fetchAreas(): Promise<Area[]> {
    return findAreas();
}

export async function fetchCategories(): Promise<Category[]> {
    return findCategories();
}

export async function fetchAmenities(): Promise<Amenity[]> {
    return findAmenities();
}
