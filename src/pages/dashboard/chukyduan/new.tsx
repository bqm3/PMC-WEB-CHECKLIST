import { Helmet } from 'react-helmet-async';
// sections
import { ChukyDuanCreateView } from 'src/sections/chukyduan/view';

// ----------------------------------------------------------------------

export default function ArticleCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <ChukyDuanCreateView />
    </>
  );
}
