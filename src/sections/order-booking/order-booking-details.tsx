import { useState, useCallback, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// _mock
import { ORDER_BOOKING_STATUS_OPTIONS } from 'src/_mock';
// types
import { IBookingOrderData, IBookingOrderDetail } from 'src/types/room';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
//
import OrderBookingToolbar from './order-booking-toolbar';


// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%'
  },
}));

// ----------------------------------------------------------------------

type Props = {
  order: IBookingOrderData;
  order_detail: IBookingOrderDetail[];
};

export default function InvoiceDetails({ order, order_detail }: Props) {
  const [currentStatus, setCurrentStatus] = useState(order?.status);

  useEffect(() => {
    setCurrentStatus(order?.status)
  }, [order?.status])

  const handleChangeStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus(event.target.value);
  }, []);

  const total = order?.total ?? 0; // Nếu values?.total không tồn tại, gán giá trị mặc định là 0
  const serviceCharge = order?.service_charge ?? 0;

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(total - serviceCharge)}
        </TableCell>
      </StyledTableRow>


      {
        serviceCharge !== 0 &&

        <StyledTableRow>
          <TableCell colSpan={3} />
          <TableCell sx={{ color: 'text.secondary' }}>
            <Box sx={{ mt: 2 }} />
            Service Charge
          </TableCell>
          <TableCell width={120} sx={{ typography: 'subtitle2' }}>
            <Box sx={{ mt: 2 }} />
            {fCurrency(serviceCharge)}
          </TableCell>
        </StyledTableRow>
      }

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(total)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">minh.dev.30@gmail.com</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Name Room</TableCell>

              <TableCell align="center">Count</TableCell>

              <TableCell align="left">Days Count</TableCell>

              <TableCell align="right">Price</TableCell>

              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {order_detail?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{row.room_name}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {fDate(row?.checkinDate)}  -  {fDate(row?.checkoutDate)}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="center">{row.personCount}</TableCell>

                <TableCell align="center">{row.dateCount} days</TableCell>

                <TableCell align="right">{fCurrency(row.price)} /day</TableCell>

                <TableCell align="right">{fCurrency(row.total)}</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <OrderBookingToolbar
        order={order}
        order_detail={order_detail}
        currentStatus={(currentStatus === 1 && 'check in') ||
          (currentStatus === 0 && 'paid') ||
          (currentStatus === 2 && 'overdue') ||
          (currentStatus === 3 && 'draft') ||
          'default'}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_BOOKING_STATUS_OPTIONS}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/pmc 192px-01.png"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={
                (currentStatus === 1 && 'success') ||
                (currentStatus === 0 && 'warning') ||
                (currentStatus === 2 && 'error') ||
                (currentStatus === 3 && 'default') ||
                'default'
              }
            >
              {
                (currentStatus === 1 && 'paid') ||
                (currentStatus === 0 && 'pending') ||
                (currentStatus === 2 && 'overdue') ||
                (currentStatus === 3 && 'draft') ||
                'default'
              }
            </Label>

            <Typography variant="h6">{`HD-${order?.id}`}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Information Customer
            </Typography>
            Fullname: {order?.fullname}
            <br />
            Email: {order?.email}
            <br />
            Phone: {order?.phonenumber}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Information Employee
            </Typography>
            FullName: {order?.emp_fullname}
            <br />
            Email: {order?.emp_email}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Create Date Order Booking
            </Typography>
            {fDate(order?.createdDate)}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Note
            </Typography>
            {order?.note === '' ? 'No note' : order?.note}
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}
