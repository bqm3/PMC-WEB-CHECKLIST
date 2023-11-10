import { Helmet } from 'react-helmet-async';
// sections
import { TypeServiceCreateView } from 'src/sections/type-service/view';

// ----------------------------------------------------------------------

export default function TypeServiceCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new service type</title>
      </Helmet>

      <TypeServiceCreateView />
    </>
  );
}
