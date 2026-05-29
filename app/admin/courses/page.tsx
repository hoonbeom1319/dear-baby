import { fetchAllCourses } from '@/server/controllers/courses';
import { fetchAllPlacesAdmin } from '@/server/controllers/places';

import { AdminCourses } from '@/screens/admin-courses/admin-courses';

export default async function Page() {
    const [courses, places] = await Promise.all([fetchAllCourses(), fetchAllPlacesAdmin()]);
    return <AdminCourses initialCourses={courses} allPlaces={places} />;
}
