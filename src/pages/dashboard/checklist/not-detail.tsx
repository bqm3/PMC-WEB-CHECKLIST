import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { NotCalvChecklistDetailsView } from 'src/sections/checklist/view';

// ----------------------------------------------------------------------

export default function CaChecklistDetailPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách chưa checklist theo ca</title>
      </Helmet>

      <NotCalvChecklistDetailsView id={`${id}`} />
    </>
  );
}
