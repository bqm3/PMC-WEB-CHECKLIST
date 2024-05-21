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
import { useGetKhuVuc, useGetToanha, useGetKhoiCV, useGetDuan } from 'src/api/khuvuc';
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
import { IKhuvuc, IToanha, IKhoiCV, ITang, IDuan } from 'src/types/khuvuc';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  currentTang?: ITang;
};

const STORAGE_KEY = 'accessToken';

export default function AreaNewEditForm({ currentTang }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [Duan, setDuan] = useState<IDuan[]>([]);

  const { duan, duanLoading, duanEmpty } = useGetDuan();



  useEffect(() => {
    if (duan?.length > 0) {
      setDuan(duan);
    }
  }, [duan]);

  const NewProductSchema = Yup.object().shape({
    Tentang: Yup.string().required('Phải có tên tầng'),
  });

  const defaultValues = useMemo(
    () => ({
      Tentang: currentTang?.Tentang || '',
      ID_Duan: currentTang?.ID_Duan || null,
    }),
    [currentTang]
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
    if (currentTang) {
      reset(defaultValues);
    }
  }, [currentTang, defaultValues, reset]);



  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data', data);
     
        axios
          .post(`https://checklist.pmcweb.vn/be/api/ent_tang/create`, data, {
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
      
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 3000,
        message: `Lỗi gửi yêu cầu`,
      });
    }
  });

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={3}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Dự án, Tên tầng
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              {Duan?.length > 0 && (
                <RHFSelect
                  name="ID_Duan"
                  label="Dự án"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {Duan?.map((item) => (
                    <MenuItem key={item?.ID_Duan} value={item?.ID_Duan}>
                      {item?.Duan}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

         
            <RHFTextField name="Tentang" label="Tên các tầng"  multiline rows={4} />

            
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
          {!currentTang ? 'Tạo mới' : 'Lưu thay đổi'}
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
