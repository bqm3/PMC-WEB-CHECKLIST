import { Helmet } from 'react-helmet-async';
// sections
import { ChecklistListView } from 'src/sections/checklist/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Checklists</title>
      </Helmet>

      <ChecklistListView />
    </>
  );
}
