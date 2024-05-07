import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ChecklistEditView } from 'src/sections/checklist/view';

// ----------------------------------------------------------------------

export default function ArticleEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật Checklist</title>
      </Helmet>

      <ChecklistEditView id={`${id}`} />
    </>
  );
}
