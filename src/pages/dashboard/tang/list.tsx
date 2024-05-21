import { Helmet } from 'react-helmet-async';
// sections
import { TangListView } from 'src/sections/tang/view';

// ----------------------------------------------------------------------

export default function TangListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Khu vực</title>
      </Helmet>

      <TangListView />
    </>
  );
}
