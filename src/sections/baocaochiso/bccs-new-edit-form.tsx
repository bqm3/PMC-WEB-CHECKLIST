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
import { useGetKhuVuc, useGetToanha, useGetKhoiCV, useGetLoaiCS } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
import { IKhoiCV, ICalv, ILoaiChiSo, IHangMucChiSo } from 'src/types/khuvuc';
import axios from 'axios';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
// import moment from 'moment';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type Props = {
  currentLoaiCS?: IHangMucChiSo;
};

const STORAGE_KEY = 'accessToken';

export default function ChiSoNewEditForm({ currentLoaiCS }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [loaics, setLoaiCS] = useState<ILoaiChiSo[]>([]);

  const { loaiCS } = useGetLoaiCS();

  useEffect(() => {
    if (loaiCS?.length > 0) {
      setLoaiCS(loaiCS);
    }
  }, [loaiCS]);

  const NewProductSchema = Yup.object().shape({
    Ten_Hangmuc_Chiso: Yup.string().required('Phải có tên chỉ số'),
    ID_LoaiCS: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      Ten_Hangmuc_Chiso: currentLoaiCS?.Ten_Hangmuc_Chiso || '',
      ID_LoaiCS: `${currentLoaiCS?.ID_LoaiCS}` || '' || null || undefined,
      ID_Duan: `${currentLoaiCS?.ID_Duan}` || '' || null || undefined,
      Heso: currentLoaiCS?.Heso || '',
      Donvi: currentLoaiCS?.Donvi || '',
      isDelete: currentLoaiCS?.isDelete || '0',
    }),
    [currentLoaiCS]
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
    if (currentLoaiCS) {
      reset(defaultValues);
    }
  }, [currentLoaiCS, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentLoaiCS !== undefined) {
        await axios
          .put(
            `${process.env.REACT_APP_HOST_API}/api/v2/hangmuc-chiso/update/${currentLoaiCS.ID_Hangmuc_Chiso}`,
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
              autoHideDuration: 4000,
              message: 'Cập nhật thành công',
            });
            router.push(paths.dashboard.baocaochiso.root);
          })
          .catch((error) => {
            if (error.response) {
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 4000,
                message: `${error.response.data.message}`,
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
      } else {
        axios
          .post(`${process.env.REACT_APP_HOST_API}/api/v2/hangmuc-chiso/create`, data, {
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
                autoHideDuration: 4000,
                message: `${error.response.data.message}`,
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
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
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
            Tên loại chỉ số, đơn vị, hệ số...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              {loaics?.length > 0 && (
                <RHFSelect
                  name="ID_LoaiCS"
                  label="Loại chỉ số"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {loaics?.map((item) => (
                    <MenuItem key={`${item?.ID_LoaiCS}`} value={`${item?.ID_LoaiCS}`}>
                      {item?.TenLoaiCS}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <RHFTextField name="Ten_Hangmuc_Chiso" label="Tên hạng mục chỉ số" />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Giá trị</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <RHFTextField type='number' name="Heso" label="Hệ số" />
                <RHFTextField name="Donvi" label="Đơn vị" />
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
          {!currentLoaiCS ? 'Tạo mới' : 'Lưu thay đổi'}
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
