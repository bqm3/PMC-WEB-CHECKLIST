import { Helmet } from 'react-helmet-async';
// sections
import { AdminPhanHeListView } from 'src/sections/phanhe/view';

// ----------------------------------------------------------------------

export default function AdminHsseListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Phân hệ</title>
            </Helmet>

            <AdminPhanHeListView />
        </>
    );
}
