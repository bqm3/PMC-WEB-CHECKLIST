import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { CalvEditView } from 'src/sections/calv/view';

// ----------------------------------------------------------------------

export default function ArticleEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật hạng mục</title>
      </Helmet>

      <CalvEditView id={`${id}`} />
    </>
  );
}
