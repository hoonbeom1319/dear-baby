import { fetchReportsAdmin } from '@/server/controllers/reports';

import { AdminReports } from '@/screens/admin-reports/admin-reports';

export default async function Page() {
    const initialReports = await fetchReportsAdmin();
    return <AdminReports initialReports={initialReports} />;
}
