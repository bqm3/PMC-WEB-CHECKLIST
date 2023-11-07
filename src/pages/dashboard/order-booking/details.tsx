import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { OrderBookingDetailsView } from 'src/sections/order-booking/view';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Order Booking Details</title>
      </Helmet>

      <OrderBookingDetailsView id={`${id}`} />
    </>
  );
}
