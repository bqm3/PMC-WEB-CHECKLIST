import { Helmet } from 'react-helmet-async';
// sections
import { UserCreateView } from 'src/sections/create-user/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create New Employee</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
