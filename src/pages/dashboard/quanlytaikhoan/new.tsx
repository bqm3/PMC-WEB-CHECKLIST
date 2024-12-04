import { Helmet } from 'react-helmet-async';
// sections
import { UserCreateView } from 'src/sections/quanlytaikhoan/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tài khoản</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
