import * as Yup from 'yup';

import FormProvider, {
  RHFAutocomplete,
  RHFEditor,
  RHFMultiCheckbox,
  RHFMultiSelect,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
import { IService, ITypeRoom } from 'src/types/room';
// _mock
import {
  PRODUCT_CATEGORY_GROUP_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
  _roles,
  _tags,
} from 'src/_mock';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Unstable_Grid2';
// types
import { IProductItem } from 'src/types/product';
import InputAdornment from '@mui/material/InputAdornment';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import axios from 'axios';
// routes
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { useGetTypeServices } from 'src/api/product';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IService;
};

export default function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [tableDataTypeRoom, setTableDataTypeRoom] = useState<ITypeRoom[]>([]);

  const { typeservices, typeservicesLoading, typeservicesEmpty } = useGetTypeServices();

  useEffect(() => {
    if (typeservices.length) {
      setTableDataTypeRoom(typeservices);
    }
  }, [typeservices]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên dịch vụ phải có'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      unit: currentProduct?.unit || '',
      price: currentProduct?.price || 0,
      type_service_id: currentProduct?.type_service_id || null,
    }),
    [currentProduct]
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
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('dât', data, currentProduct)
    try {
      if (currentProduct?.id !== undefined) {
        axios.put(`https://be-nodejs-project.vercel.app/api/services/${currentProduct.id}`, data).then((res) => {
          reset();
          enqueueSnackbar('Update success!');
          router.push(paths.dashboard.service.root);
        });
      } else {
        axios.post(`https://be-nodejs-project.vercel.app/api/services`, data).then((res) => {
          reset();
          enqueueSnackbar('Create success!');
          router.push(paths.dashboard.service.root);
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên loại dịch vụ...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Tên dịch vụ" />
            <RHFTextField name="unit" label="Đơn vị" />
            <RHFTextField name="price" label="Giá tiền" />

            <RHFSelect
              fullWidth
              name="type_service_id"
              label="Loại dịch vụ"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {typeservices.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Tạo Dịch Vụ' : 'Lưu thay đổi'}
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
