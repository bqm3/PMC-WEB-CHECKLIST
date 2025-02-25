import { Helmet } from 'react-helmet-async';
// sections
import { P0CreateView } from 'src/sections/p0/view';

// ----------------------------------------------------------------------

export default function P0CreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo báo cáo S0</title>
      </Helmet>

      <P0CreateView />
    </>
  );
}
