import { Helmet } from 'react-helmet-async';
// sections
import { BeBoiAnalyticsView } from 'src/sections/beboi/view';

// ----------------------------------------------------------------------

export default function AdminBeBoiListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Báo cáo bể bơi</title>
            </Helmet>

            <BeBoiAnalyticsView />
        </>
    );
}
