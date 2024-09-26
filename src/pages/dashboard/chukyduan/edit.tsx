import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ChukyDuanEditView } from 'src/sections/chukyduan/view';

// ----------------------------------------------------------------------

export default function ArticleEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật chu kỳ</title>
      </Helmet>

      <ChukyDuanEditView id={`${id}`} />
    </>
  );
}
