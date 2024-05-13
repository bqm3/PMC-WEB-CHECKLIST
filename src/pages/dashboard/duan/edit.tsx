import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { DuanEditView } from 'src/sections/duan/view';

// ----------------------------------------------------------------------

export default function DuanEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật tên dự án</title>
      </Helmet>

      <DuanEditView id={`${id}`} />
    </>
  );
}
