import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';
// api
import { useGetKhuVuc, useGetToanha, useGetKhoiCV, useGetChucvu } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
// types
import { IKhoiCV, ICalv, IGiamsat, IChucvu } from 'src/types/khuvuc';
import axios from 'axios';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
// import moment from 'moment';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type Props = {
  currentGiamsat?: IGiamsat;
};

const STORAGE_KEY = 'accessToken';

export default function GiamsatNewEditForm({ currentGiamsat }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [khoiCv, setKhoiCv] = useState<IKhoiCV[]>([]);
  const [chucvu, setChucVu] = useState<IChucvu[]>([]);

  const { khoiCV } = useGetKhoiCV();
  const { chucVu, chucVuLoading, chucVuEmpty } = useGetChucvu();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCv(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (chucVu?.length > 0) {
      setChucVu(chucVu);
    }
  }, [chucVu]);

  const NewProductSchema = Yup.object().shape({
    Hoten: Yup.string().required('Phải có tên giám sát'),
    ID_KhoiCV: Yup.string(),
    Ngaysinh: Yup.string(),
    Sodienthoai: Yup.string().required('Phone number is required'),
  });

  const defaultValues = useMemo(
    () => ({
      Hoten: currentGiamsat?.Hoten || '',
      Sodienthoai: currentGiamsat?.Sodienthoai || '',
      Gioitinh: currentGiamsat?.Gioitinh || '',
      Ngaysinh: currentGiamsat?.Ngaysinh || '',
      ID_KhoiCV: `${currentGiamsat?.ID_KhoiCV}` || '' || null || undefined,
    }),
    [currentGiamsat]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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

  const values = watch();

  useEffect(() => {
    if (currentGiamsat) {
      reset(defaultValues);
    }
  }, [currentGiamsat, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentGiamsat !== undefined) {
        await axios
          .put(
            `https://checklist.pmcweb.vn/be/api/ent_giamsat/update/${currentGiamsat.ID_Giamsat}`,
            data,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((res) => {
            reset();
            enqueueSnackbar({
              variant: 'success',
              autoHideDuration: 2000,
              message: 'Cập nhật thành công',
            });
            router.push(paths.dashboard.giamsat.root);
          })
          .catch((error) => {
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
      } else {
        axios
          .post(`https://checklist.pmcweb.vn/be/api/ent_giamsat/create`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            reset();
            enqueueSnackbar('Tạo mới thành công!');
          })
          .catch((error) => {
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
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 3000,
        message: `Lỗi gửi yêu cầu`,
      });
      // }
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={3}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên giám sát, chức vụ, ngày sinh, số điện thoại...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              {khoiCv?.length > 0 && (
                <RHFSelect
                  name="ID_KhoiCV"
                  label="Khối công việc"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {khoiCv?.map((item) => (
                    <MenuItem key={`${item?.ID_Khoi}`} value={`${item?.ID_Khoi}`}>
                      {item?.KhoiCV}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <RHFTextField name="Hoten" label="Tên giám sát" />
            <RHFTextField name="Sodienthoai" label="Số điện thoại" />
            <Stack spacing={1}>
              <Typography variant="subtitle2">Giới tính</Typography>
              <RHFRadioGroup row name="Gioitinh" spacing={2} options={USER_GENDER_OPTIONS} />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Năm sinh</Typography>
              <Controller
                name="Ngaysinh"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}
      >
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentGiamsat ? 'Tạo mới' : 'Lưu thay đổi'}
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
