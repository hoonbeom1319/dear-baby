import { mapCourseRow, type CourseRow } from '@/entities/course/model/db';
import type { Course } from '@/entities/course/model/types';

import type { AreaId } from '@/shared/config';

import { createSupabaseAdmin } from '../db/supabase';

const COURSE_SELECT = '*, course_stops(*)' as const;

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function findAllCourses(): Promise<Course[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('courses').select(COURSE_SELECT).order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data as CourseRow[]).map(mapCourseRow);
}

export async function findCourseById(id: string): Promise<Course | null> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('courses').select(COURSE_SELECT).eq('id', id).maybeSingle();
    if (error || !data) return null;
    return mapCourseRow(data as CourseRow);
}

/** 이 장소가 정거장으로 포함된 코스 — "함께 가면 좋은 코스"용. */
export async function findCoursesByStop(placeId: string): Promise<Course[]> {
    const supabase = createSupabaseAdmin();

    const { data: stopRows, error: stopError } = await supabase.from('course_stops').select('course_id').eq('place_id', placeId);
    if (stopError || !stopRows?.length) return [];

    const courseIds = stopRows.map((r) => r.course_id);
    const { data, error } = await supabase.from('courses').select(COURSE_SELECT).in('id', courseIds);
    if (error || !data) return [];
    return (data as CourseRow[]).map(mapCourseRow);
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export type CourseStop = { placeId: string; comment: string };

export type CreateCourseInput = {
    area: AreaId;
    title: string;
    duration: string;
    season: string;
    description: string;
    sortOrder: number;
    stops: CourseStop[];
};

export async function insertCourse(input: CreateCourseInput): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('courses')
        .insert({
            area: input.area,
            title: input.title,
            duration: input.duration,
            season: input.season,
            description: input.description,
            sort_order: input.sortOrder
        })
        .select('id')
        .single();

    if (error) throw new Error(error.message);

    if (input.stops.length > 0) {
        const { error: stopsError } = await supabase.from('course_stops').insert(
            input.stops.map((stop, i) => ({
                course_id: data.id,
                place_id: stop.placeId,
                stop_order: i,
                comment: stop.comment
            }))
        );
        if (stopsError) throw new Error(stopsError.message);
    }
}

export async function updateCourse(id: string, fields: Partial<Omit<CreateCourseInput, 'stops'>>): Promise<void> {
    const supabase = createSupabaseAdmin();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (fields.area !== undefined) patch.area = fields.area;
    if (fields.title !== undefined) patch.title = fields.title;
    if (fields.duration !== undefined) patch.duration = fields.duration;
    if (fields.season !== undefined) patch.season = fields.season;
    if (fields.description !== undefined) patch.description = fields.description;
    if (fields.sortOrder !== undefined) patch.sort_order = fields.sortOrder;

    const { error } = await supabase.from('courses').update(patch).eq('id', id);
    if (error) throw new Error(error.message);
}

/** 코스의 정거장 전체를 교체 (삭제 후 재삽입). */
export async function replaceCourseStops(courseId: string, stops: CourseStop[]): Promise<void> {
    const supabase = createSupabaseAdmin();
    await supabase.from('course_stops').delete().eq('course_id', courseId);

    if (stops.length > 0) {
        const { error } = await supabase.from('course_stops').insert(
            stops.map((stop, i) => ({
                course_id: courseId,
                place_id: stop.placeId,
                stop_order: i,
                comment: stop.comment
            }))
        );
        if (error) throw new Error(error.message);
    }
}

export async function deleteCourse(id: string): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
