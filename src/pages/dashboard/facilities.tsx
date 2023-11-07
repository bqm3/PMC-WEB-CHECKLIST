import { Helmet } from 'react-helmet-async';
// sections
import { OverviewFacilitiesView } from 'src/sections/overview/file/view';

// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: File</title>
      </Helmet>

      <OverviewFacilitiesView />
    </>
  );
}
