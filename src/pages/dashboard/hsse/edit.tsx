import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { HSSEEditView } from 'src/sections/hsse/view';

// ----------------------------------------------------------------------

export default function HSSEEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật HSSE</title>
      </Helmet>

      <HSSEEditView id={`${id}`} />
    </>
  );
}
