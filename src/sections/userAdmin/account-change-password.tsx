import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';

// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .required('Cần có mật khẩu mới')
      .min(3, 'Mật khẩu phải có ít nhất 3 ký tự')
      .test(
        'no-match',
        'Mật khẩu mới phải khác với mật khẩu cũ',
        (value, { parent }) => value !== parent.currentPassword
      ),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Mật khẩu phải trùng khớp'),
  });

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      axios
        .post(`https://checklist.pmcweb.vn/be/api/ent_user/change-password`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          reset();
          enqueueSnackbar('Đổi mật khẩu thành công!');
        })
        .catch((error) => {
          console.log('error.response', error.response);
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="currentPassword"
          type={password.value ? 'text' : 'password'}
          label="Mật khẩu hiện tại"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="newPassword"
          label="Mật khẩu mới"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Mật khẩu phải tối thiểu
              3+
            </Stack>
          }
        />

        <RHFTextField
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Nhập lại mật khẩu"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Lưu thay đổi
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
