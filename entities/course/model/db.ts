import type { AreaId } from '@/shared/config';

import type { Course } from './types';

/** Supabase course_stops 테이블 row. */
export type CourseStopRow = {
    id: string;
    course_id: string;
    place_id: string;
    stop_order: number;
    comment: string;
};

/** Supabase courses 테이블 row (course_stops 조인 포함). */
export type CourseRow = {
    id: string;
    area: string;
    title: string;
    duration: string;
    season: string;
    description: string;
    sort_order: number;
    course_stops: CourseStopRow[];
};

export function mapCourseRow(row: CourseRow): Course {
    const stops = [...(row.course_stops ?? [])].sort((a, b) => a.stop_order - b.stop_order);
    return {
        id: row.id,
        area: row.area as AreaId,
        title: row.title,
        duration: row.duration,
        season: row.season,
        description: row.description,
        stopIds: stops.map((s) => s.place_id),
        comments: stops.map((s) => s.comment),
    };
}
