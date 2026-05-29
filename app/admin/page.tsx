import { fetchDashboardData } from '@/server/controllers/dashboard';

import { AdminDashboard } from '@/screens/admin-dashboard/admin-dashboard';

export default async function Page() {
    const data = await fetchDashboardData();
    return <AdminDashboard data={data} />;
}
