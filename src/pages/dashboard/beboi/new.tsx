import { Helmet } from 'react-helmet-async';
// sections
import { BeBoiCreateView } from 'src/sections/beboi/view';

// ----------------------------------------------------------------------

export default function BeBoiCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tạo báo cáo bể bơi</title>
      </Helmet>

      <BeBoiCreateView />
    </>
  );
}
