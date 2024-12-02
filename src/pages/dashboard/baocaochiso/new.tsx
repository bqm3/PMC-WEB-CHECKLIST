import { Helmet } from 'react-helmet-async';
// sections
import { BCCSNewForm } from 'src/sections/baocaochiso/view';

// ----------------------------------------------------------------------

export default function ArticleCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <BCCSNewForm />
    </>
  );
}
