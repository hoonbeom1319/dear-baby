import { CourseList } from '@/screens/course-list/course-list';

import { fetchAllCourses } from '@/server/actions/courses';

export default async function Page() {
    const allCourses = await fetchAllCourses();
    return <CourseList allCourses={allCourses} />;
}
