import { Helmet } from 'react-helmet-async';
// sections
import { GptView } from 'src/sections/gptprivacy';

// ----------------------------------------------------------------------

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title> Chính sách quyền riêng tư</title>
      </Helmet>

      <GptView />
    </>
  );
}
