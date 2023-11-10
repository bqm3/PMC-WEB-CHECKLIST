import { Helmet } from 'react-helmet-async';
// sections
import { TypeRoomListView } from 'src/sections/type-room/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: List of room types</title>
      </Helmet>

      <TypeRoomListView />
    </>
  );
}
