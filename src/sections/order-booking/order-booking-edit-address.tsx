import { useFormContext } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _addressBooks } from 'src/_mock';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
//
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function OrderBookingEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const values = watch();

  return (
    <>
      <Stack
        spacing={2}
        sx={{ p: 3, bgcolor: 'background.neutral' }}
      >
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
                (values.status === 1 && 'success') ||
                (values.status === 0 && 'warning') ||
                (values.status === 2 && 'error') ||
                'default'
              }
            >
              {
                (values.status === 1 && 'check in') ||
                (values.status === 0 && 'paid') ||
                (values.status === 2 && 'overdue') ||
                'default'
              }
            </Label>

            <Typography variant="h6">{`HD-${values?.id}`}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Information Customer
            </Typography>
            Fullname: {values?.fullname}
            <br />
            Email: {values?.email}
            <br />
            Phone: {values?.phonenumber}
            <br />
          </Stack>



          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Create Date Order Booking
            </Typography>
            {fDate(values?.createdDate)}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Note
            </Typography>
            {values?.note === '' ? 'Không có ghi chú' : values?.note}
          </Stack>

        </Box>
      </Stack>


    </>
  );
}




