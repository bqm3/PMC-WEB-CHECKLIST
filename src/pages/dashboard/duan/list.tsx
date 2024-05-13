import { Helmet } from 'react-helmet-async';
// sections
import { DuanListView } from 'src/sections/duan/view';

// ----------------------------------------------------------------------

export default function DuanListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách dự án</title>
      </Helmet>

      <DuanListView />
    </>
  );
}
