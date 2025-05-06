import { Helmet } from 'react-helmet-async';
// sections
import { TangCreateView } from 'src/sections/tailieuphanhe/view';

// ----------------------------------------------------------------------

export default function AreaCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <TangCreateView />
    </>
  );
}
