import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { GiamsatEditView } from 'src/sections/giamsat/view';

// ----------------------------------------------------------------------

export default function GiamsatEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật giám sát</title>
      </Helmet>

      <GiamsatEditView id={`${id}`} />
    </>
  );
}
