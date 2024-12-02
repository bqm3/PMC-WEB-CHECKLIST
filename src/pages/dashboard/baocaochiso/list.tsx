import { Helmet } from 'react-helmet-async';
// sections
import { BaoCaoListView } from 'src/sections/baocaochiso/view';

// ----------------------------------------------------------------------

export default function BaoCaoListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Báo cáo chỉ số</title>
      </Helmet>

      <BaoCaoListView />
    </>
  );
}
