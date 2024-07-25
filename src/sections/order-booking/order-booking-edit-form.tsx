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
import { IBookingOrderData, IBookingOrderDetail } from 'src/types/room';
// _mock
import { _addressBooks } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
// components
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
//
import OrderBookingEditDetails from './order-booking-edit-details';
import OrderBookingEditAddress from './order-booking-edit-address';
import OrderBookingEditStatusDate from './order-booking-edit-status-date';


// ----------------------------------------------------------------------

type Props = {
  order: IBookingOrderData;
  order_detail: IBookingOrderDetail;
};

export default function OrderBookingEditForm({ order, order_detail }: Props) {


  const router = useRouter();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const NewInvoiceSchema = Yup.object().shape({
  });

  const defaultValues = useMemo(
    () => ({
      id: order?.id || '',
      createdDate: order?.createdDate || new Date(),
      count: order?.count || 0,
      status: order?.status || 0,
      total: order?.total || 0,
      service_charge: order?.service_charge || 0,
      note: order?.note || '',
      employee: order?.employee,
      od_detail: order?.od_detail || '',
      email: order?.email || '',
      phonenumber: order?.phonenumber || '',
      fullname: order?.fullname || '',
      emp_fullname: order?.emp_fullname || '',
      emp_email: order?.emp_email || '',
      order_details: order_detail || [
        {
          checkinDate: new Date(),
          checkoutDate: new Date(),
          statusDetail: '',
          dateCount: '',
          total: '',
          room_name: '',
        }
      ]

    }),
    [order, order_detail]
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
      router.push(paths.dashboard.orderBooking.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    console.log('data', data)
    loadingSend.onTrue();

    try {

      await axios.put(
        `https://be-nodejs-project.vercel.app/api/orders/status`,
        {
          user, data
        }
      );
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.orderBooking.root);
      enqueueSnackbar({
        variant: 'success',
        autoHideDuration: 2000,
        message: 'Update Success!',
      });
    } catch (error) {
      console.error(error);
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
          {order && order_detail ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

