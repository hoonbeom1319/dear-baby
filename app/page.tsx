import { Home } from '@/screens/home/home';

import { fetchAllCourses } from '@/server/actions/courses';

export default async function Page() {
    const allCourses = await fetchAllCourses();
    return <Home allCourses={allCourses} />;
}
