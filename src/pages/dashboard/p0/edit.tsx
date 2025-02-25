import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { P0EditView } from 'src/sections/p0/view';

// ----------------------------------------------------------------------

export default function P0EditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật S0</title>
      </Helmet>

      <P0EditView id={`${id}`} />
    </>
  );
}
