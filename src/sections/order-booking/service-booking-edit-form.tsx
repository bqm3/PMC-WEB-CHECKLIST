import { useMemo } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// types
import { IBookingOrderData, IBookingOrderDetail, IBookingService } from 'src/types/room';
// _mock
import { _addressBooks } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
// components
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
//
import OrderBookingEditDetails from './service-booking-edit-details';
import OrderBookingEditAddress from './service-booking-edit-address';
import OrderBookingEditStatusDate from './service-booking-edit-status-date';


// ----------------------------------------------------------------------

type Props = {
  tableDataOrder: IBookingService;
};

export default function OrderBookingEditForm({ tableDataOrder }: Props) {


  const router = useRouter();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const NewInvoiceSchema = Yup.object().shape({
  });

  const defaultValues = useMemo(
    () => ({
      id: tableDataOrder?.id || '',
      createdAt: tableDataOrder?.createdAt || new Date(),
      updatedAt: tableDataOrder?.updatedAt || new Date(),
      room_id: tableDataOrder?.room_id || 0,
      active: tableDataOrder?.active || 0,
      quantity: tableDataOrder?.quantity || 0,
      service_id: tableDataOrder?.service_id || 0,
      order_id: tableDataOrder?.order_id || 0,
      name: tableDataOrder?.name || '',
      price: tableDataOrder?.price,
      fullname: tableDataOrder?.fullname || '',
      email: tableDataOrder?.email || '',
      customer_id: tableDataOrder?.customer_id || '',


    }),
    [tableDataOrder]
  );


  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.orderBooking.list);
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {

    loadingSend.onTrue();

    try {

      await axios.put(
        // `https://be-nodejs-project.vercel.app/api/room_service/status`,
        `https://be-nodejs-project.vercel.app/api/room_service/status`,
        // `https://be-nodejs-project.vercel.app/api/room_service/status`,
        {
          user, data
        }
      );
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.orderBooking.list);
      enqueueSnackbar({
        variant: 'success',
        autoHideDuration: 2000,
        message: 'Update Success!',
      });
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
        message: 'Update Faild',
      });
      loadingSend.onFalse();
    }
  });

  return (
    <FormProvider methods={methods}>
      <Card>
        <OrderBookingEditAddress />

        <OrderBookingEditStatusDate />

        <OrderBookingEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {tableDataOrder ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

