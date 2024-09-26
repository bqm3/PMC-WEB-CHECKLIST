import { Helmet } from 'react-helmet-async';
// sections
import { ChiaCaCreateView } from 'src/sections/chiacahangmuc/view';

// ----------------------------------------------------------------------

export default function GiamsatCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Thiết lập hạng mục trong ca</title>
      </Helmet>

      <ChiaCaCreateView />
    </>
  );
}
