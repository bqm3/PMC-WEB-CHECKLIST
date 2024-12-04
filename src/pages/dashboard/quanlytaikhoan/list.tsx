import { Helmet } from 'react-helmet-async';
// sections
import { UserListView } from 'src/sections/quanlytaikhoan/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Danh sách tài khoản</title>
      </Helmet>

      <UserListView />
    </>
  );
}
