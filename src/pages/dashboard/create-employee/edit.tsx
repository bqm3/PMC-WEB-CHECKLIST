import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { UserEditView } from 'src/sections/create-user/view';

// ----------------------------------------------------------------------

export default function DuanEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật tài khoản</title>
      </Helmet>

      <UserEditView id={`${id}`} />
    </>
  );
}
