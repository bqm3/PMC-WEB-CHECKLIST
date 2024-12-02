import { Helmet } from 'react-helmet-async';
// sections
import { BaoCaoHangThangListView } from 'src/sections/baocaochiso/view';

// ----------------------------------------------------------------------

export default function BaoCaoListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Báo cáo chỉ số hàng tháng</title>
            </Helmet>

            <BaoCaoHangThangListView />
        </>
    );
}
