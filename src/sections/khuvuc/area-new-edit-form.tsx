import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  _tags,
  _roles,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// api
import { useGetKhuVuc, useGetToanha, useGetKhoiCV } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
// types
import { IKhuvuc, IToanha, IKhoiCV } from 'src/types/khuvuc';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  currentArea?: IKhuvuc;
};

const STORAGE_KEY = 'accessToken';

export default function AreaNewEditForm({ currentArea }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [toaNha, setToanha] = useState<IToanha[]>([]);

  const [khoiCv, setKhoiCv] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { toanha, toanhaLoading, toanhaEmpty } = useGetToanha();

  const { khoiCV } = useGetKhoiCV();

  useEffect(() => {
    if (toanha?.length > 0) {
      setToanha(toanha);
    }
  }, [toanha]);

  const NewProductSchema = Yup.object().shape({
    Tenkhuvuc: Yup.string().required('Phải có tên khu vực'),
  });

  const defaultValues = useMemo(
    () => ({
      Tenkhuvuc: currentArea?.Tenkhuvuc || '',
      ID_Toanha: currentArea?.ID_Toanha || null,
      MaQrCode: currentArea?.MaQrCode || '',
      Sothutu: currentArea?.Sothutu || '',
      Makhuvuc: currentArea?.Makhuvuc || '',
      ID_KhoiCVs: currentArea?.ID_KhoiCVs || [],
    }),
    [currentArea]
  );

  useEffect(() => {
    if (khoiCV?.length > 0) {
      const transformedData = khoiCV.map((item) => ({
        value: item.ID_KhoiCV,
        label: item.KhoiCV,
      }));
      setKhoiCv(transformedData);
    }
  }, [khoiCV]);

  
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentArea) {
      reset(defaultValues);
    }
  }, [currentArea, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentArea !== undefined) {
        await axios
          .put(`http://localhost:6868/api/v2/ent_khuvuc/update/${currentArea.ID_Khuvuc}`, data, {
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
            router.push(paths.dashboard.khuvuc.root);
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
          .post(`http://localhost:6868/api/v2/ent_khuvuc/create`, data, {
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
            Tên khu vực, Mã Qr Code...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              {toaNha?.length > 0 && (
                <RHFSelect
                  name="ID_Toanha"
                  label="Tòa nhà"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {toaNha?.map((item) => (
                    <MenuItem key={item?.ID_Toanha} value={item?.ID_Toanha}>
                      {item?.Toanha}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <Stack spacing={1.5}>
              {loading === false ? (
                <>
                  {khoiCv && khoiCv?.length > 0 ? (
                    <RHFMultiSelect
                      checkbox
                      name="ID_KhoiCVs"
                      label="Chọn các khối cho khu vực"
                      options={khoiCv}
                    />
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </Stack>

            <RHFTextField name="Tenkhuvuc" label="Tên khu vực" />
            <RHFTextField name="MaQrCode" label="Mã Qr Code" />
            <RHFTextField name="Sothutu" label="Số thứ tự" />
            <RHFTextField name="Makhuvuc" label="Mã khu vực" />

           
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
          {!currentArea ? 'Tạo mới' : 'Lưu thay đổi'}
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
