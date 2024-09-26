import { Helmet } from 'react-helmet-async';
// sections
import { SuCoListView } from 'src/sections/sucongoai/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Sự cố ngoài</title>
      </Helmet>

      <SuCoListView />
    </>
  );
}
