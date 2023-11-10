import { Helmet } from 'react-helmet-async';
// sections
import { TypeServiceListView } from 'src/sections/type-service/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: List of service types</title>
      </Helmet>

      <TypeServiceListView />
    </>
  );
}
