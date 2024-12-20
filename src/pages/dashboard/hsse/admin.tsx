import { Helmet } from 'react-helmet-async';
// sections
import { AdminHSSEListView } from 'src/sections/hsse/view';

// ----------------------------------------------------------------------

export default function AdminHsseListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Báo cáo HSSE</title>
            </Helmet>

            <AdminHSSEListView />
        </>
    );
}
