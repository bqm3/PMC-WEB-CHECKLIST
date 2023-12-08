import * as Yup from 'yup';

import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUpload,
  RHFEditor,
} from 'src/components/hook-form';
import { IService, ITypeRoom } from 'src/types/room';
// _mock
import {
  _roles,
  _tags,
  STATUS_STATUS_OPTIONS
} from 'src/_mock';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
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
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      unit: currentProduct?.unit || '',
      detail: currentProduct?.detail || '',
      price: currentProduct?.price || 0,
      status: currentProduct?.status || 1,
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
            Name,detail, unit, price...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Detail</Typography>
              <RHFEditor simple name="detail" />
            </Stack>
            <RHFTextField name="unit" label="Unit" />
            <RHFTextField name="price" label="Price" />
            <RHFSelect fullWidth name="status" label="Status" InputLabelProps={{ shrink: true }} PaperPropsSx={{ textTransform: 'capitalize' }}>
              {STATUS_STATUS_OPTIONS?.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              fullWidth
              name="type_service_id"
              label="Type Service"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {tableDataTypeRoom?.map((option) => (
                <MenuItem key={option?.id} value={option?.id}>
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
