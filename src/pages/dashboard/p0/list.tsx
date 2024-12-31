import { Helmet } from 'react-helmet-async';
// sections
import { P0ListView } from 'src/sections/p0/view';

// ----------------------------------------------------------------------

export default function DuanListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Báo cáo P0</title>
      </Helmet>

      <P0ListView />
    </>
  );
}
