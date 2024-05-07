import { Helmet } from 'react-helmet-async';
// sections
import { ArticleListView } from 'src/sections/hangmuc/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Hạng mục</title>
      </Helmet>

      <ArticleListView />
    </>
  );
}
