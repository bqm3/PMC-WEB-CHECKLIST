import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { AreaEditView } from 'src/sections/khuvuc/view';

// ----------------------------------------------------------------------

export default function AreaEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật khu vực</title>
      </Helmet>

      <AreaEditView id={`${id}`} />
    </>
  );
}
