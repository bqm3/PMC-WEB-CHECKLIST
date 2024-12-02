import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { BCCSEditForm } from 'src/sections/baocaochiso/view';

// ----------------------------------------------------------------------

export default function BaoCaoEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật</title>
      </Helmet>

      <BCCSEditForm id={`${id}`} />
    </>
  );
}
