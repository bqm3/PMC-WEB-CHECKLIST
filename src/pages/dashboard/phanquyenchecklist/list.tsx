import { Helmet } from 'react-helmet-async';
// sections
import { ChiaCaListView } from 'src/sections/chiacahangmuc/view';

// ----------------------------------------------------------------------

export default function GiamsatListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách ca đã gán</title>
      </Helmet>

      <ChiaCaListView />
    </>
  );
}
