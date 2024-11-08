import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { UserError } from 'src/sections/create-user/view';

// ----------------------------------------------------------------------

export default function ErrorUserList() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Tài khoản lỗi</title>
      </Helmet>

      <UserError id={`${id}`} />
    </>
  );
}
