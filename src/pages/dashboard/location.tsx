import { Helmet } from 'react-helmet-async';
// sections
import { LocationManagementsView } from 'src/sections/overview/location';

// ----------------------------------------------------------------------

export default function LocationManagementsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Quản lý vị trí</title>
      </Helmet>

      <LocationManagementsView />
    </>
  );
}
