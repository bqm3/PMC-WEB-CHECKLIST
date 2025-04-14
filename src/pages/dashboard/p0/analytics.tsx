import { Helmet } from 'react-helmet-async';
// sections
import { P0Analytics } from 'src/sections/p0/view';

// ----------------------------------------------------------------------

export default function P0PhanQuyenPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Phân tích S0</title>
            </Helmet>

            <P0Analytics />
        </>
    );
}
