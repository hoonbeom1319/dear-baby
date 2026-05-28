'use server';

import { revalidatePath } from 'next/cache';

import {
    deleteCourse as dao_deleteCourse,
    findAllCourses,
    findCourseById,
    findCoursesByStop,
    insertCourse,
    replaceCourseStops as dao_replaceCourseStops,
    updateCourse as dao_updateCourse
} from '../dao/courses';
import type { CourseStop, CreateCourseInput } from '../dao/courses';

export type { CourseStop, CreateCourseInput } from '../dao/courses';

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function fetchAllCourses() {
    return findAllCourses();
}

export async function fetchCourseById(id: string) {
    return findCourseById(id);
}

export async function fetchCoursesByStop(placeId: string) {
    return findCoursesByStop(placeId);
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function createCourse(input: CreateCourseInput): Promise<void> {
    await insertCourse(input);
    revalidatePath('/admin/courses');
    revalidatePath('/course');
}

export async function updateCourse(id: string, fields: Partial<Omit<CreateCourseInput, 'stops'>>): Promise<void> {
    await dao_updateCourse(id, fields);
    revalidatePath('/admin/courses');
    revalidatePath(`/course/${id}`);
}

/** 코스의 정거장 전체를 교체 (삭제 후 재삽입). */
export async function replaceCourseStops(courseId: string, stops: CourseStop[]): Promise<void> {
    await dao_replaceCourseStops(courseId, stops);
    revalidatePath('/admin/courses');
    revalidatePath(`/course/${courseId}`);
}

export async function deleteCourse(id: string): Promise<void> {
    await dao_deleteCourse(id);
    revalidatePath('/admin/courses');
    revalidatePath('/course');
}
