import React from 'react';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _invoices } from 'src/_mock';

import { useGetOrderBookingServiceDetail } from 'src/api/order';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import OrderBookingEditForm from '../service-booking-edit-form';



// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OrderBookingEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [tableDataOrder, setTableDataOrder] = React.useState<any>();
  const { services, servicesLoading, servicesEmpty } = useGetOrderBookingServiceDetail(id)

  React.useEffect(() => {
    if (services) {
      setTableDataOrder(services)
    }
  }, [services])
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={`Update Service Booking S-${services?.id}`}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Detail Service Booking',
            href: paths.dashboard.orderBooking.list,
          },
          { name: `S-${services?.id}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {
        servicesLoading !== true && services &&
        <OrderBookingEditForm tableDataOrder={services} />
      }

    </Container>
  );
}
