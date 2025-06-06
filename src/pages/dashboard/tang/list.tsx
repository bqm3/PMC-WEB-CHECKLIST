import { Helmet } from 'react-helmet-async';
// sections
import { TangListView } from 'src/sections/tang/view';

// ----------------------------------------------------------------------

export default function TangListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tầng</title>
      </Helmet>

      <TangListView />
    </>
  );
}
