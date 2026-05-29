'use server';

import { revalidatePath } from 'next/cache';

import { deleteCourse, findAllCourses, findCourseById, findCoursesByStop, insertCourse, replaceCourseStops, updateCourse } from '../dao/courses';

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

export async function createCourse(input: Parameters<typeof insertCourse>[0]): Promise<void> {
    await insertCourse(input);
    revalidatePath('/admin/courses');
    revalidatePath('/course');
}

export async function modifyCourse(id: string, fields: Parameters<typeof updateCourse>[1]): Promise<void> {
    await updateCourse(id, fields);
    revalidatePath('/admin/courses');
    revalidatePath(`/course/${id}`);
}

export async function modifyCourseStops(courseId: string, stops: Parameters<typeof replaceCourseStops>[1]): Promise<void> {
    await replaceCourseStops(courseId, stops);
    revalidatePath('/admin/courses');
    revalidatePath(`/course/${courseId}`);
}

export async function removeCourse(id: string): Promise<void> {
    await deleteCourse(id);
    revalidatePath('/admin/courses');
    revalidatePath('/course');
}
