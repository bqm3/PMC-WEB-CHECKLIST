import { Helmet } from 'react-helmet-async';
// sections
import { OrderBookingListView } from 'src/sections/order-booking/view';

// ----------------------------------------------------------------------

export default function OrderBookingListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order Booking List </title>
      </Helmet>

      <OrderBookingListView />
    </>
  );
}
