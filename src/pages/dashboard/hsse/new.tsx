import { Helmet } from 'react-helmet-async';
// sections
import { HSSECreateView } from 'src/sections/hsse/view';

// ----------------------------------------------------------------------

export default function HSSECreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo báo cáo HSSE</title>
      </Helmet>

      <HSSECreateView />
    </>
  );
}
