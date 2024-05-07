import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ArticleEditView } from 'src/sections/hangmuc/view';

// ----------------------------------------------------------------------

export default function ArticleEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật hạng mục</title>
      </Helmet>

      <ArticleEditView id={`${id}`} />
    </>
  );
}
