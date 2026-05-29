import { fetchAllCourses } from '@/server/controllers/courses';

import { Home } from '@/screens/home/home';

export default async function Page() {
    const allCourses = await fetchAllCourses();
    return <Home allCourses={allCourses} />;
}
