import { Helmet } from 'react-helmet-async';
// sections
import { AccountView } from 'src/sections/userAdmin/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Thông tin cá nhân</title>
      </Helmet>

      <AccountView />
    </>
  );
}
