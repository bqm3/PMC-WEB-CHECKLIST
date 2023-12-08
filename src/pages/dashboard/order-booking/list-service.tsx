import { Helmet } from 'react-helmet-async';
// sections
import { ServiceBookingListView } from 'src/sections/order-booking/view';

// ----------------------------------------------------------------------

export default function OrderBookingListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order Service List </title>
      </Helmet>

      <ServiceBookingListView />
    </>
  );
}
