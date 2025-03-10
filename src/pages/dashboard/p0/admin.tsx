import { Helmet } from 'react-helmet-async';
// sections
import { AdminP0ListView } from 'src/sections/p0/view';

// ----------------------------------------------------------------------

export default function AdminP0ListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Báo cáo S0</title>
            </Helmet>

            <AdminP0ListView />
        </>
    );
}
