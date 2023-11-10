import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RoomDetailsView } from 'src/sections/room/view';

// ----------------------------------------------------------------------

export default function TourDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Room Details</title>
      </Helmet>

      <RoomDetailsView id={`${id}`} />
    </>
  );
}
