import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RoomEditView } from 'src/sections/room/view';

// ----------------------------------------------------------------------

export default function RoomEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Room Edit</title>
      </Helmet>

      <RoomEditView id={`${id}`} />
    </>
  );
}
