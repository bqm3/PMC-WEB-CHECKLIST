import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ResetPassView } from 'src/sections/create-user/view';

// ----------------------------------------------------------------------

export default function ResetPWUserList() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Thiết lập lại mật khẩu</title>
      </Helmet>

      <ResetPassView id={`${id}`} />
    </>
  );
}
