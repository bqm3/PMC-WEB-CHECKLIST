import { Helmet } from 'react-helmet-async';
// sections
import { P0PhanQuyenView } from 'src/sections/p0/view';

// ----------------------------------------------------------------------

export default function P0PhanQuyenPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Phân quyền P0</title>
            </Helmet>

            <P0PhanQuyenView />
        </>
    );
}
