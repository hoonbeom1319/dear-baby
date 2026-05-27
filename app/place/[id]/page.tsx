import { PlaceDetail } from '@/screens/place-detail/place-detail';

import { fetchCoursesByStop } from '@/server/actions/courses';
import { fetchPlaceById } from '@/server/actions/places';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [place, relatedCourses] = await Promise.all([fetchPlaceById(id), fetchCoursesByStop(id)]);
    return <PlaceDetail place={place} relatedCourses={relatedCourses} />;
}
