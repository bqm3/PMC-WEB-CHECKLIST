import { Helmet } from 'react-helmet-async';
// sections
import { DuanCreateView } from 'src/sections/duan/view';

// ----------------------------------------------------------------------

export default function DuanCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới dự án</title>
      </Helmet>

      <DuanCreateView />
    </>
  );
}
