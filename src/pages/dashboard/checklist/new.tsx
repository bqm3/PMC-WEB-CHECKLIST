import { Helmet } from 'react-helmet-async';
// sections
import { ArticleCreateView } from 'src/sections/hangmuc/view';

// ----------------------------------------------------------------------

export default function ArticleCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <ArticleCreateView />
    </>
  );
}
