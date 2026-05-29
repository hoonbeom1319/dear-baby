import { fetchCoursesByStop } from '@/server/controllers/courses';
import { fetchPlaceById } from '@/server/controllers/places';

import { PlaceDetail } from '@/screens/place-detail/place-detail';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [place, relatedCourses] = await Promise.all([fetchPlaceById(id), fetchCoursesByStop(id)]);
    return <PlaceDetail place={place} relatedCourses={relatedCourses} />;
}
