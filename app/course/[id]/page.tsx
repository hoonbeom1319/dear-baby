import { fetchCourseById } from '@/server/controllers/courses';

import { CourseDetail } from '@/screens/course-detail/course-detail';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await fetchCourseById(id);
    return <CourseDetail course={course} />;
}
