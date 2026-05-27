import { AdminCourses } from '@/screens/admin-courses/admin-courses';

import { fetchAllCourses } from '@/server/actions/courses';
import { fetchAllPlacesAdmin } from '@/server/actions/places';

export default async function Page() {
    const [courses, places] = await Promise.all([fetchAllCourses(), fetchAllPlacesAdmin()]);
    return <AdminCourses initialCourses={courses} allPlaces={places} />;
}
