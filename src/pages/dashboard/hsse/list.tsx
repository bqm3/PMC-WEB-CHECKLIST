import { Helmet } from 'react-helmet-async';
// sections
import { HSSEListView } from 'src/sections/hsse/view';

// ----------------------------------------------------------------------

export default function DuanListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Báo cáo HSSE</title>
      </Helmet>

      <HSSEListView />
    </>
  );
}
