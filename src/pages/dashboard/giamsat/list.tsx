import { Helmet } from 'react-helmet-async';
// sections
import { GiamsatListView } from 'src/sections/giamsat/view';

// ----------------------------------------------------------------------

export default function GiamsatListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách giám sát</title>
      </Helmet>

      <GiamsatListView />
    </>
  );
}
