import { Helmet } from 'react-helmet-async';
// sections
import { CalvCreateView } from 'src/sections/calv/view';

// ----------------------------------------------------------------------

export default function ArticleCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <CalvCreateView />
    </>
  );
}
