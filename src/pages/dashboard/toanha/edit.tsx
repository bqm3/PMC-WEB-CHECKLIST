import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ToanhaEditView } from 'src/sections/toanha/view';

// ----------------------------------------------------------------------

export default function ToanhaEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật tòa nhà</title>
      </Helmet>

      <ToanhaEditView id={`${id}`} />
    </>
  );
}
