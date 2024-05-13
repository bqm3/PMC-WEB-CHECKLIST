import { Helmet } from 'react-helmet-async';
// sections
import { ToanhaCreateView } from 'src/sections/toanha/view';

// ----------------------------------------------------------------------

export default function ToanhaCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <ToanhaCreateView />
    </>
  );
}
