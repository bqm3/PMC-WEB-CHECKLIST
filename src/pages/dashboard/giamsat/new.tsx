import { Helmet } from 'react-helmet-async';
// sections
import { GiamsatCreateView } from 'src/sections/giamsat/view';

// ----------------------------------------------------------------------

export default function GiamsatCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <GiamsatCreateView />
    </>
  );
}
