import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { CalvChecklistDetailsView } from 'src/sections/checklist/view';

// ----------------------------------------------------------------------

export default function CaChecklistDetailPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách checklist theo ca</title>
      </Helmet>

      <CalvChecklistDetailsView id={`${id}`} />
    </>
  );
}
