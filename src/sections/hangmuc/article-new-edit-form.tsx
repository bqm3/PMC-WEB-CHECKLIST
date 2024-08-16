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
import { IKhuvuc, IToanha, IKhoiCV, IHangMuc } from 'src/types/khuvuc';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  currentArticle?: IHangMuc;
};

const STORAGE_KEY = 'accessToken';

export default function ArticleNewEditForm({ currentArticle }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const [khuVuc, setKhuVuc] = useState<any>([]);
  const [toaNha, setToaNha] = useState<IToanha[]>([]);
  const [KhoiCV, setKhoiCV] = useState<IKhoiCV[]>([]);

  const { khuvuc, khuvucLoading, khuvucEmpty } = useGetKhuVuc();
  const { toanha, toanhaLoading, toanhaEmpty } = useGetToanha();
  const { khoiCV } = useGetKhoiCV();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCV(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (toanha?.length > 0) {
      setToaNha(toanha);
    }
  }, [toanha]);

  const NewProductSchema = Yup.object().shape({
    Hangmuc: Yup.string().required('Phải có tên hạng mục'),
    ID_Toanha: Yup.string(),
    ID_KhoiCV: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      Hangmuc: currentArticle?.Hangmuc || '',
      Tieuchuankt: currentArticle?.Tieuchuankt || '',
      MaQrCode: currentArticle?.MaQrCode || '',
      ID_Khuvuc: currentArticle?.ID_Khuvuc || null,
      ID_KhoiCV: currentArticle?.ID_KhoiCV || null || '',
      ID_Toanha: currentArticle?.ent_khuvuc?.ID_Toanha || null || '',
    }),
    [currentArticle]
  );

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
    let filteredToanha = khuvuc;
  
    // If either ID_Toanha or ID_KhoiCV is present, filter the array
    if (values.ID_Toanha || values.ID_KhoiCV) {
      filteredToanha = khuvuc?.filter((item: any) => {
        const matchToanha = values.ID_Toanha ? `${item.ID_Toanha}` === `${values.ID_Toanha}` : true;
        const matchKhoiCV = values.ID_KhoiCV ? item.ID_KhoiCVs.includes(values.ID_KhoiCV) : true;
        return matchToanha && matchKhoiCV;
      }) || [];
    }
  
    // Create a new array with the desired structure: { ID_Khuvuc: ID_Khuvuc, Khuvuc: item }
    const newArray = filteredToanha?.map((item: any) => ({
      ID_Khuvuc: item.ID_Khuvuc,
      Khuvuc: item,
    }));
  
    // Update the state with the new array
    setKhuVuc(newArray);
  }, [values.ID_Toanha, values.ID_KhoiCV, khuvuc]);
  
  
  

  useEffect(() => {
    if (currentArticle) {
      reset(defaultValues);
    }
  }, [currentArticle, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentArticle !== undefined) {
        await axios
          .put(
            `https://checklist.pmcweb.vn/be/api/ent_hangmuc/update/${currentArticle.ID_Hangmuc}`,
            data,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((res) => {
            // reset();
            enqueueSnackbar({
                variant: 'success',
                autoHideDuration: 2000,
                message: 'Cập nhật thành công'
              });
            router.push(paths.dashboard.hangmuc.root);
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
          .post(`https://checklist.pmcweb.vn/be/api/ent_hangmuc/create`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            // reset();
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
            Tên hạng mục, Mã Qr Code, Tiêu chuẩn kiểm tra...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {/* <Stack> */}
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
              {/* </Stack> */}

              {/* <Stack> */}
              {KhoiCV?.length > 0 && (
                <RHFSelect
                  name="ID_KhoiCV"
                  label="Khối công việc"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {KhoiCV?.map((item) => (
                    <MenuItem key={item?.ID_Khoi} value={item?.ID_Khoi}>
                      {item?.KhoiCV}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
              {/* </Stack> */}
            </Stack>

            <Stack spacing={1.5}>
              {khuVuc?.length > 0 && (
                <RHFSelect
                  name="ID_Khuvuc"
                  label="Khu vực"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {khuVuc?.map((item: any) => (
                    <MenuItem key={item?.ID_Khuvuc} value={item?.ID_Khuvuc}>
                      {item?.Khuvuc?.Tenkhuvuc}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <RHFTextField name="Hangmuc" label="Tên hạng mục" />
            <RHFTextField name="MaQrCode" label="Mã Qr Code" />

            <RHFTextField name="Tieuchuankt" label="Tiêu chuẩn kiểm tra" multiline rows={4} />
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
          {!currentArticle ? 'Tạo mới' : 'Lưu thay đổi'}
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
