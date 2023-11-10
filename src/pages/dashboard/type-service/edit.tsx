import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { TypeServiceEditView } from 'src/sections/type-service/view';

// ----------------------------------------------------------------------

export default function TypeServiceEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Update service type</title>
      </Helmet>

      <TypeServiceEditView id={`${id}`} />
    </>
  );
}
