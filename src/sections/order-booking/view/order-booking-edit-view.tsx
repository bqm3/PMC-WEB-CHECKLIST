import React from 'react';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _invoices } from 'src/_mock';

import { useGetOrderDetail } from 'src/api/order';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import OrderBookingEditForm from '../order-booking-edit-form';



// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OrderBookingEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [tableDataOrder, setTableDataOrder] = React.useState<any>();
  const { order, orderLoading, orderEmpty } = useGetOrderDetail(id)

  React.useEffect(() => {
    if (order) {
      setTableDataOrder(order)
    }
  }, [order])
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={`Update Order Booking HD-${order?.data?.id}`}
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
        orderLoading !== true && tableDataOrder?.data && tableDataOrder?.order_detail &&
        <OrderBookingEditForm order={tableDataOrder?.data} order_detail={tableDataOrder?.order_detail} />
      }

    </Container>
  );
}
