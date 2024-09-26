import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { GiamsatEditView } from 'src/sections/quanlygiamsat/view';

// ----------------------------------------------------------------------

export default function GiamsatEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật khu vực giám sát</title>
      </Helmet>

      {/* <GiamsatEditView id={`${id}`} /> */}
    </>
  );
}
