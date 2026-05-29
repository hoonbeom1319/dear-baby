import { fetchAllCourses } from '@/server/controllers/courses';

import { CourseList } from '@/screens/course-list/course-list';

export default async function Page() {
    const allCourses = await fetchAllCourses();
    return <CourseList allCourses={allCourses} />;
}
