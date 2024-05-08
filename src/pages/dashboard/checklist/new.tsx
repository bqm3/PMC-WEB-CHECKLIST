import { Helmet } from 'react-helmet-async';
// sections
import { ChecklistCreateView } from 'src/sections/checklist/view';

// ----------------------------------------------------------------------

export default function ArticleCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo mới</title>
      </Helmet>

      <ChecklistCreateView />
    </>
  );
}
