import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { BeBoiEditView } from 'src/sections/beboi/view';

// ----------------------------------------------------------------------

export default function BeBoiEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật bể bơi</title>
      </Helmet>

      <BeBoiEditView date={`${id}`} />
    </>
  );
}
