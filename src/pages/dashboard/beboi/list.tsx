import { Helmet } from 'react-helmet-async';
// sections
import { BeBoiListView } from 'src/sections/beboi/view';

// ----------------------------------------------------------------------

export default function BeBoiListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Báo cáo bể bơi</title>
      </Helmet>

      <BeBoiListView />
    </>
  );
}
