import { Helmet } from 'react-helmet-async';
// sections
import { RoomNewView } from 'src/sections/room/view';

// ----------------------------------------------------------------------

export default function TourCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Room New</title>
      </Helmet>

      <RoomNewView />
    </>
  );
}
