import { Helmet } from 'react-helmet-async';
// sections
import { ServiceNewView } from 'src/sections/service/view';

// ----------------------------------------------------------------------

export default function ServiceCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new service</title>
      </Helmet>

      <ServiceNewView />
    </>
  );
}
