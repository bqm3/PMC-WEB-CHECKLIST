import { Helmet } from 'react-helmet-async';
// sections
import { ToanhaListView } from 'src/sections/toanha/view';

// ----------------------------------------------------------------------

export default function ToanhaListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách tòa nhà</title>
      </Helmet>

      <ToanhaListView />
    </>
  );
}
