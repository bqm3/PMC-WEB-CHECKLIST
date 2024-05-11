import { Helmet } from 'react-helmet-async';
// sections
import { CalvListView } from 'src/sections/calv/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Ca làm việc</title>
      </Helmet>

      <CalvListView />
    </>
  );
}
