import { Helmet } from 'react-helmet-async';
// sections
import { ServiceListView } from 'src/sections/service/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: List Services</title>
      </Helmet>

      <ServiceListView />
    </>
  );
}
