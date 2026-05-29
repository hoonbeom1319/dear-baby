import { fetchAllPlacesAdmin } from '@/server/controllers/places';

import { AdminPlaces } from '@/screens/admin-places/admin-places';

export default async function Page() {
    const places = await fetchAllPlacesAdmin();
    return <AdminPlaces initialPlaces={places} />;
}
