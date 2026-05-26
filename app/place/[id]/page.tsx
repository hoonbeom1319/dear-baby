import { PlaceDetail } from '@/screens/place-detail/place-detail';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PlaceDetail placeId={id} />;
}
