import { AdminDashboard } from '@/screens/admin-dashboard/admin-dashboard';

import { fetchDashboardData } from '@/server/controllers/dashboard';

export default async function Page() {
    const data = await fetchDashboardData();
    return <AdminDashboard data={data} />;
}
