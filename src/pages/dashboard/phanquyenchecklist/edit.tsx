import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ChiaCaEditView } from 'src/sections/chiacahangmuc/view';

// ----------------------------------------------------------------------

export default function GiamsatEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật hạng mục đã gán</title>
      </Helmet>

      <ChiaCaEditView id={`${id}`} />
    </>
  );
}
