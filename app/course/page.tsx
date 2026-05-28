import { CourseList } from '@/screens/course-list/course-list';

import { fetchAllCourses } from '@/server/controllers/courses';

export default async function Page() {
    const allCourses = await fetchAllCourses();
    return <CourseList allCourses={allCourses} />;
}
