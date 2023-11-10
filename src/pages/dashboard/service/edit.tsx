import { Helmet } from 'react-helmet-async';
// sections
import { ServiceEditPage } from 'src/sections/service/view';
// routes
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function TypeRoomEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Room service updates</title>
      </Helmet>

      <ServiceEditPage id={`${id}`} />
    </>
  );
}
