import { CourseDetail } from '@/screens/course-detail/course-detail';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CourseDetail courseId={id} />;
}
