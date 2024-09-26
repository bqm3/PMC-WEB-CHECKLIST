import { Helmet } from 'react-helmet-async';
// sections
import { ChukyDuanListView } from 'src/sections/chukyduan/view';

// ----------------------------------------------------------------------

export default function ChukyListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Chu kỳ checklist các dự án</title>
      </Helmet>

      <ChukyDuanListView />
    </>
  );
}
