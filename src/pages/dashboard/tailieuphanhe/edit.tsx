import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { TaiLieuPhanHeEditView } from 'src/sections/tailieuphanhe/view';

// ----------------------------------------------------------------------

export default function ArticleEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật tài liệu phân hệ</title>
      </Helmet>

      <TaiLieuPhanHeEditView id={`${id}`} />
    </>
  );
}
