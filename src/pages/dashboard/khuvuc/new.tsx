import { Helmet } from 'react-helmet-async';
// sections
import { AreaCreateView } from 'src/sections/khuvuc/view';

// ----------------------------------------------------------------------

export default function AreaCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <AreaCreateView />
    </>
  );
}
