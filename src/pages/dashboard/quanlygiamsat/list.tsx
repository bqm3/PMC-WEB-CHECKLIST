import { Helmet } from 'react-helmet-async';
// sections
import { GiamsatListView } from 'src/sections/quanlygiamsat/view';

// ----------------------------------------------------------------------

export default function GiamsatListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách tài khoản giám sát</title>
      </Helmet>

      <GiamsatListView />
    </>
  );
}
