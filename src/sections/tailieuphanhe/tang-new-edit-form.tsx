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
} from 'src/_mock';
// api
import { useGetPhanhe } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
// types
import { IKhuvuc, IToanha, IKhoiCV, ITang, IDuan, ITailieuphanhe, IPhanhe } from 'src/types/khuvuc';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  currentTang?: ITailieuphanhe;
};

const STORAGE_KEY = 'accessToken';

export default function AreaNewEditForm({ currentTang }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);
  const [phanhe, setPhanHe] = useState<IPhanhe[]>([]);
  const { phanHe } = useGetPhanhe();

  useEffect(() => {
    if (phanHe?.length > 0) {
      setPhanHe(phanHe);
    }
  }, [phanHe]);

  const NewProductSchema = Yup.object().shape({
    Duongdan: Yup.string().required('Phải có đường dẫn'),
    Tenduongdan: Yup.string().required('Phải có tên đường dẫn'),
    Ghichu: Yup.mixed().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      Duongdan: currentTang?.Duongdan || '',
      Tenduongdan: currentTang?.Tenduongdan || '',
      Ghichu: currentTang?.Ghichu || '',
      ID_Phanhe: currentTang?.ID_Phanhe || null,
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
      const isUpdate = !!currentTang?.ID_Duongdantl;
      const url = `${process.env.REACT_APP_HOST_API}/api/v2/ent_tailieuphanhe/${isUpdate ? `${currentTang.ID_Duongdantl}` : 'create'}`;
      const method = isUpdate ? 'put' : 'post';

      await axios({
        method,
        url,
        data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      reset();
      enqueueSnackbar('Thành công!');
    } catch (error) {
      if (error.response) {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: `${error.response.data.message}`,
        });
      } else if (error.request) {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: `Không nhận được phản hồi từ máy chủ`,
        });
      } else {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: `Lỗi gửi yêu cầu`,
        });
      }
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
            Đường dẫn, ghi chú
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>

            <Stack spacing={1.5}>
              {phanhe?.length > 0 && (
                <RHFSelect
                  name="ID_Phanhe"
                  label="Phân hệ"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {phanhe?.map((item) => (
                    <MenuItem key={item?.ID_Phanhe} value={item?.ID_Phanhe}>
                      {item?.Phanhe}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <RHFTextField name="Tenduongdan" label="Tên đường dẫn " />
            <RHFTextField name="Duongdan" label="Đường dẫn " />
            <RHFTextField name="Ghichu" label="Ghi chú" multiline rows={3} />
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
