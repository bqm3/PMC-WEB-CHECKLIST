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
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles } from 'src/_mock';
// api
import { useGetKhuVuc, useGetToanha, useGetKhoiCV } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
import { IKhoiCV, ICalv } from 'src/types/khuvuc';
import axios from 'axios';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
// import moment from 'moment';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type Props = {
  currentCalv?: ICalv;
};

const STORAGE_KEY = 'accessToken';

export default function ArticleNewEditForm({ currentCalv }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [khoiCv, setKhoiCv] = useState<IKhoiCV[]>([]);

  const { khoiCV } = useGetKhoiCV();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCv(khoiCV);
    }
  }, [khoiCV]);

  const NewProductSchema = Yup.object().shape({
    Tenca: Yup.string().required('Phải có tên làm việc'),
    ID_KhoiCV: Yup.string(),
    Giobatdau: Yup.mixed<any>().nullable().required('Phải có giờ bắt đầu'),
    Gioketthuc: Yup.mixed<any>().nullable().required('Phải có giờ kết thúc'),
  });

  const defaultValues = useMemo(
    () => ({
      Tenca: currentCalv?.Tenca || '',
      ID_KhoiCV: `${currentCalv?.ID_KhoiCV}` || '' || null || undefined,
      Giobatdau: currentCalv?.Giobatdau || null || undefined,
      Gioketthuc: currentCalv?.Gioketthuc || undefined,
    }),
    [currentCalv]
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
    if (currentCalv) {
      reset(defaultValues);
    }
  }, [currentCalv, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCalv !== undefined) {
        await axios
          .put(`https://checklist.pmcweb.vn/be//api/ent_calv/update/${currentCalv.ID_Calv}`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            reset();
            enqueueSnackbar({
                variant: 'success',
                autoHideDuration: 2000,
                message: 'Cập nhật thành công'
              });
            router.push(paths.dashboard.calv.root);
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
        axios
          .post(`https://checklist.pmcweb.vn/be//api/ent_calv/create`, data, {
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

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={3}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên ca làm việc, giờ bắt đầu, giờ kết thúc,...
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

            <RHFTextField name="Tenca" label="Tên ca làm việc" />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Giờ kiểm tra</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <RHFTextField type="time" value={values?.Giobatdau || '23:59'} name="Giobatdau" />
                <RHFTextField type="time" value={values?.Gioketthuc || '23:59'} name="Gioketthuc" />
              </Stack>
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
          {!currentCalv ? 'Tạo mới' : 'Lưu thay đổi'}
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
