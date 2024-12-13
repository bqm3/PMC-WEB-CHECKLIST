import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// types
import axios from 'axios';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export default function ResetPassForm() {
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = localStorage.getItem(STORAGE_KEY);

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    UserName: Yup.string().required('Tên tài khoản không được để trống'),
    Password: Yup.string().required('Mật khẩu mới không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      UserName: '',
      Password: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
  } = methods;

  // Handle form submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      axios
        .put(`http://localhost:6868/api/v2/ent_user/reset-password`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setIsSubmitting(false);
          reset();
          enqueueSnackbar(`${res.data.message}`);
        })
        .catch((error) => {
          setIsSubmitting(false);
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 4000,
              message: `${error.response.data.message || "Có lỗi xảy ra"}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 4000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 4000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    } catch (error) {
      setIsSubmitting(false);
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: `Lỗi gửi yêu cầu`,
      });
    }
  });

  // Render form details
  const renderDetails = (
    <>
      <Grid xs={1} md={12}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="UserName" label="Tên tài khoản " multiline rows={4} />
            <RHFTextField name="Password" label="Mật khẩu mới " type="password" multiline rows={2} />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // Render actions (buttons)
  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}
      >
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          Cập nhật mật khẩu
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
