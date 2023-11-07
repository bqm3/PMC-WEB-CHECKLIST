import { Helmet } from 'react-helmet-async';
// sections
import { RoomListView } from 'src/sections/room/view';

// ----------------------------------------------------------------------

export default function TourListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Danh Sách Phòng</title>
      </Helmet>

      <RoomListView />
    </>
  );
}
