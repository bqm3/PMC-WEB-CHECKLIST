import { Helmet } from 'react-helmet-async';
// sections
import { ChecklistCalvListView } from 'src/sections/checklist/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Checklist theo ca làm việc</title>
      </Helmet>

      <ChecklistCalvListView />
    </>
  );
}
