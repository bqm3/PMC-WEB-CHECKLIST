import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// routes
import { useRouter } from 'src/routes/hooks';
// types
import { IChucvu, IDuan, IKhoiCV, IUser } from 'src/types/khuvuc';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
  RHFRadioGroup,
} from 'src/components/hook-form';
import axios from 'axios';
import {
  useGetChucvu,
  useGetDuan,
  useGetKhoiCV,
} from 'src/api/khuvuc';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUser;
};

const STORAGE_KEY = 'accessToken';

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [KhoiCV, setKhoiCV] = useState<IKhoiCV[]>([]);
  const [Duan, setDuan] = useState<IDuan[]>([]);
  const [Chucvu, setChucvu] = useState<IChucvu[]>([]);

  const { khoiCV } = useGetKhoiCV();
  const { chucVu, chucVuLoading, chucVuEmpty } = useGetChucvu();
  const { duan, duanLoading, duanEmpty } = useGetDuan();


  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCV(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (duan?.length > 0) {
      setDuan(duan);
    }
  }, [duan]);

  useEffect(() => {
    if (chucVu?.length > 0) {
      setChucvu(chucVu);
    }
  }, [chucVu]);

  const NewUserSchema = Yup.object().shape({
    UserName: Yup.string().required('Tài khoản là bắt buộc'),
    Email: Yup.string().required('Email là bắt buộc').email('Chưa đúng định dạng Email'),
    Hoten: Yup.string().required('Phải có họ tên'),
    Sodienthoai: Yup.string().required('Phải có số điện thoại'),
    Ngaysinh: Yup.mixed<any>().nullable().required('Phải có ngày sinh'),
    // not required
  });


  const defaultValues = useMemo(
    () => ({
      UserName: currentUser?.UserName || '',
      Email: currentUser?.Email || '',
      Password: '',
      ID_Chucvu: currentUser?.ID_Chucvu || null || '',
      Hoten: currentUser?.Hoten || '',
      Sodienthoai: currentUser?.Sodienthoai || '',
      Gioitinh: currentUser?.Gioitinh || '',
      Ngaysinh: currentUser?.Ngaysinh || new Date() || null || undefined,
      ID_Duan: currentUser?.ID_Duan || null || '',
      ID_KhoiCV: currentUser?.ID_KhoiCV || null || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser !== undefined) {
        await axios
          .put(`http://localhost:6868/api/v2/ent_user/update/${currentUser?.ID_User}`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            reset();
            enqueueSnackbar('Cập nhật tài khoản!');
            router.push(paths.dashboard.createUser.list);
          })
          .catch((error) => {
            if (error.response) {
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `${error.response.data.message}`,
              });
            } else if (error.request) {
              // Lỗi không nhận được phản hồi từ server
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `Không nhận được phản hồi từ máy chủ`,
              });
            } else {
              // Lỗi khi cấu hình request
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `Lỗi gửi yêu cầu`,
              });
            }
          });
      } else {
          await axios
            .post(`http://localhost:6868/api/v2/ent_user/register`, data, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then((res) => {
              reset();
              enqueueSnackbar('Tạo tài khoản thành công!');
            })
            .catch((error) => {
              if (error.response) {
                enqueueSnackbar({
                  variant: 'error',
                  autoHideDuration: 2000,
                  message: `${error.response.data.message}`,
                });
              } else if (error.request) {
                // Lỗi không nhận được phản hồi từ server
                enqueueSnackbar({
                  variant: 'error',
                  autoHideDuration: 2000,
                  message: `Không nhận được phản hồi từ máy chủ`,
                });
              } else {
                // Lỗi khi cấu hình request
                enqueueSnackbar({
                  variant: 'error',
                  autoHideDuration: 2000,
                  message: `Lỗi gửi yêu cầu`,
                });
              }
            });
        
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
        message: `Lỗi gửi yêu cầu`,
      });
      // }
    }
  });

  console.log('currentUser', currentUser)

  const renderPrimary = (
    <Grid xs={12} md={12}>
      <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
            marginTop={3}
          >
            {KhoiCV?.length > 0 && (
              <RHFSelect
                fullWidth
                name="ID_KhoiCV"
                label="Khối công việc"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {KhoiCV?.map((option) => (
                  <MenuItem key={option.ID_KhoiCV} value={option.ID_KhoiCV}>
                    {option.KhoiCV}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
            {Duan?.length > 0 && (
              <RHFSelect
                fullWidth
                name="ID_Duan"
                label="Dự án"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {Duan?.map((option) => (
                  <MenuItem key={option.ID_Duan} value={option.ID_Duan}>
                    {option.Duan}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}

            {Chucvu?.length > 0 && (
              <RHFSelect
                fullWidth
                name="ID_Chucvu"
                label="Chức vụ"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {Chucvu?.map((option) => (
                  <MenuItem key={option.ID_Chucvu} value={option.ID_Chucvu}>
                    {option.Chucvu}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          </Box>

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
          marginTop={3}
        >
          <RHFTextField name="UserName" label="Tài khoản" />
          <RHFTextField name="Email" label="Email" />
          <RHFTextField name="Hoten" label="Họ tên" />
          <RHFTextField name="Sodienthoai" label="Số điện thoại" />
          <Stack spacing={1}>
            <Typography variant="subtitle2">Giới tính</Typography>
            <RHFRadioGroup row name="Gioitinh" spacing={2} options={USER_GENDER_OPTIONS} />
          </Stack>
          <DatePicker
            label="Ngày sinh"
            value={new Date(values.Ngaysinh)}
            onChange={(newValue: any) => setValue('Ngaysinh', newValue)}
          />

          {currentUser === undefined && <RHFTextField name="Password" label="Mật khẩu" />}

          {`${currentUser?.ID_Chucvu}` === '4' && <RHFTextField name="Password" label="Mật khẩu" />}
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!currentUser ? 'Tạo mới' : 'Lưu thay đổi'}
          </LoadingButton>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderPrimary}
      </Grid>
    </FormProvider>
  );
}
