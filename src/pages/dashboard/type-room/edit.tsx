import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { TypeRoomEditView } from 'src/sections/type-room/view';

// ----------------------------------------------------------------------

export default function TypeRoomEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật loại phòng</title>
      </Helmet>

      <TypeRoomEditView id={`${id}`} />
    </>
  );
}
