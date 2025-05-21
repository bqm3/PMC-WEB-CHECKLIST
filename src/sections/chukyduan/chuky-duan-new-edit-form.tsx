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
import { useGetKhuVuc, useGetToanha, useGetKhoiCV, useGetDuan, useGetPhanhe } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
import { IKhoiCV, ICalv, IDuanKhoiCV, IDuan, IPhanhe } from 'src/types/khuvuc';
import axios from 'axios';
import { Checkbox, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  currentCycle?: IDuanKhoiCV;
};

const STORAGE_KEY = 'accessToken';

export default function ArticleNewEditForm({ currentCycle }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [khoiCv, setKhoiCv] = useState<IKhoiCV[]>([]);
  const [PhanHe, setPhanHe] = useState<IPhanhe[]>([]);
  const [duAn, setDuan] = useState<IDuan[]>([]);

  const { khoiCV } = useGetKhoiCV();
  const { phanHe } = useGetPhanhe();
  const { duan } = useGetDuan();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCv(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (phanHe?.length > 0) {
      setPhanHe(phanHe);
    }
  }, [phanHe]);

  useEffect(() => {
    if (duan?.length > 0) {
      setDuan(duan);
    }
  }, [duan]);

  const NewProductSchema = Yup.object().shape({
    ID_Duan: Yup.string(),
    ID_KhoiCV: Yup.string(),
    ID_Phanhe: Yup.string(),
    KhoiCV: Yup.string(),
    Chuky: Yup.string().required('Phải có chu kỳ cho khối công việc'),
    Tenchuky: Yup.string(),
    Ngaybatdau: Yup.mixed<any>().nullable().required('Phải có ngày bắt đầu'),
    isQuantrong: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      ID_Duan: currentCycle?.ID_Duan || '',
      ID_KhoiCV: currentCycle?.ID_KhoiCV || '',
      ID_Phanhe: currentCycle?.ID_Phanhe || '',
      KhoiCV: currentCycle?.ent_khoicv?.KhoiCV || '',
      Chuky: currentCycle?.Chuky || '',
      Tenchuky: currentCycle?.Tenchuky || '',
      Ngaybatdau: currentCycle?.Ngaybatdau || null,
      isQuantrong: currentCycle?.isQuantrong || '0',
    }),
    [currentCycle]
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
    if (currentCycle) {
      reset(defaultValues);
    }
  }, [currentCycle, defaultValues, reset]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'ID_KhoiCV' && value.ID_KhoiCV) {
        const selectedKhoiCV = khoiCv.find((item) => `${item.ID_KhoiCV}` === `${value.ID_KhoiCV}`);
        if (selectedKhoiCV) {
          setValue('KhoiCV', selectedKhoiCV.KhoiCV);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, khoiCv]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCycle !== undefined) {
        await axios
          .put(
            `${process.env.REACT_APP_HOST_API}/ent_duan_khoicv/update/${currentCycle.ID_Duan_KhoiCV}`,
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
            router.push(paths.dashboard.chukyduan.root);
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
          .post(`${process.env.REACT_APP_HOST_API}/ent_duan_khoicv/create`, data, {
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
            Khối công việc, Dự án, Ngày bắt đầu,...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              {duAn?.length > 0 && (
                <RHFSelect
                  name="ID_Duan"
                  label="Dự án"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {duAn?.map((item) => (
                    <MenuItem key={`${item?.ID_Duan}`} value={`${item?.ID_Duan}`}>
                      {item?.Duan}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <Stack spacing={1.5}>
              {khoiCv?.length > 0 && (
                <RHFSelect
                  name="ID_KhoiCV"
                  label="Khối công việc"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {khoiCv?.map((item) => (
                    <MenuItem key={`${item?.ID_KhoiCV}`} value={`${item?.ID_KhoiCV}`}>
                      {item?.KhoiCV}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>
            <Stack spacing={1.5}>
              {PhanHe?.length > 0 && (
                <RHFSelect
                  name="ID_Phanhe"
                  label="Phân hệ"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {PhanHe?.map((item) => (
                    <MenuItem key={`${item?.ID_Phanhe}`} value={`${item?.ID_Phanhe}`}>
                      {item?.Phanhe}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>
            <input type="hidden" {...methods.register('KhoiCV')} />
            <RHFTextField name="Chuky" label="Chu kỳ" />
            <RHFTextField name="Tenchuky" label="Tên chu kỳ" />
            <RHFTextField type="date" value={values?.Ngaybatdau} name="Ngaybatdau" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={`${values.isQuantrong}` === '1'}
                  onChange={(e) => {
                    setValue('isQuantrong', e.target.checked ? '1' : '0');
                  }}
                  inputProps={{ 'aria-label': 'Bỏ checklist quan trọng' }}
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Bỏ checklist quan trọng
                </Typography>
              }
            />
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
          {!currentCycle ? 'Tạo mới' : 'Lưu thay đổi'}
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
