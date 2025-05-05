import { Helmet } from 'react-helmet-async';
// sections
import { BeBoiPhanQuyenView } from 'src/sections/beboi/view';

// ----------------------------------------------------------------------

export default function BeBoiPhanQuyenPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Phân quyền bể bơi</title>
            </Helmet>

            <BeBoiPhanQuyenView />
        </>
    );
}
