import { Helmet } from 'react-helmet-async';
// sections
import { TypeRoomCreateView } from 'src/sections/type-room/view';

// ----------------------------------------------------------------------

export default function ProductCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới loại phòng</title>
      </Helmet>

      <TypeRoomCreateView />
    </>
  );
}
