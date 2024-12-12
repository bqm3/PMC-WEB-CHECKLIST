import { Helmet } from 'react-helmet-async';
// sections
import { HSSEPhanQuyenView } from 'src/sections/hsse/view';

// ----------------------------------------------------------------------

export default function HHSEPhanQuyenPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Phân quyền HSSE</title>
            </Helmet>

            <HSSEPhanQuyenView />
        </>
    );
}
