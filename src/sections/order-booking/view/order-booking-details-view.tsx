import { useEffect, useState } from 'react';
// api
import { useGetOrderDetail } from 'src/api/order';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _invoices } from 'src/_mock';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import OrderBookingDetail from '../order-booking-details';



// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OrderBookingDetailView({ id }: Props) {
  const settings = useSettingsContext();
  const [tableDataOrder, setTableDataOrder] = useState<any>();
  const { order, orderLoading, orderEmpty } = useGetOrderDetail(id)

  useEffect(() => {
    if (order) {
      setTableDataOrder(order)
    }
  }, [order])
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={`Detail Order Booking HD-${order?.data?.id}`}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Detail Order Booking',
            href: paths.dashboard.orderBooking.root,
          },
          { name: `HD-${order?.data?.id}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {
        orderLoading !== true &&
        <OrderBookingDetail order={tableDataOrder?.data} order_detail={tableDataOrder?.order_detail} />
      }

    </Container>
  );
}
