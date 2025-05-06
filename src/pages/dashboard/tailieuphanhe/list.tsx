import { Helmet } from 'react-helmet-async';
// sections
import { TangListView } from 'src/sections/tailieuphanhe/view';

// ----------------------------------------------------------------------

export default function TangListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tài liệu phân hệ</title>
      </Helmet>

      <TangListView />
    </>
  );
}
