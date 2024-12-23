import { useMemo, useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// types
import { IP0, IUser } from 'src/types/khuvuc';
import moment from 'moment';

type Props = {
  currentP0?: IP0;
};

const fieldLabels: any = {
  Slxeoto: 'Xe ô tô thường',
  Slxeotodien: 'Xe ô tô điện',
  Slxemaydien: 'Xe máy điện',
  Slxemay: 'Xe máy thường',
  Slxedapdien: 'Xe đạp điện',
  Slxedap: 'Xe đạp thường',
  Sltheoto: 'Thẻ xe ô tô',
  Slthexemay: 'Thẻ xe máy',
  Slscoto: 'Sự cố xe ô tô thường',
  Slscotodien: 'Sự cố xe ô tô điện',
  Slscxemaydien: 'Sự cố xe máy điện',
  Slscxemay: 'Sự cố xe máy thường',
  Slscxedapdien: 'Sự cố xe đạp điện',
  Slscxedap: 'Sự cố xe đạp thường',
  Slcongto: 'Công tơ điện',
  Doanhthu: 'Doanh thu từ 6h đến 18h',
  Ghichu: 'Ghi chú',
};

const fieldCategories: any = {
  'Thông tin xe': [
    'Slxeoto',
    'Slxeotodien',
    'Slxemay',
    'Slxemaydien',
    'Slxedap',
    'Slxedapdien',
  ],
  'Thông tin thẻ': ['Sltheoto', 'Slthexemay'],
  'Sự cố': [
    'Slscoto',
    'Slscotodien',
    'Slscxemay',
    'Slscxemaydien',
    'Slscxedap',
    'Slscxedapdien',
  ],
  'Thông tin khác': ['Slcongto', 'Doanhthu'],
  'Ghi chú': ['Ghichu'],
};

const STORAGE_KEY = 'accessToken';

export default function P0NewEditForm({ currentP0 }: Props) {
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [open, setOpen] = useState(false);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const isToday = moment(currentP0?.Ngaybc).isSame(moment(), 'day');

  const NewProductSchema = Yup.object().shape(
    Object.keys(fieldLabels).reduce((acc: any, field) => {
      if (field === 'Ghichu') {
        // 'Ghichu' is a text field
        acc[field] = Yup.string()
          .nullable()
          .max(255, 'Ghi chú không được vượt quá 255 ký tự');
      } else {
        // Other fields are numbers
        acc[field] = Yup.number()
          .typeError('Giá trị phải là số hợp lệ')
          .nullable()
          .transform((value, originalValue) =>
            String(originalValue).trim() === '' ? null : parseFloat(originalValue)
          )
          .min(0, 'Giá trị phải lớn hơn hoặc bằng 0');
      }
      return acc;
    }, {})
  );

  const defaultValues = useMemo(
    () => ({
      Slxeoto: currentP0?.Slxeoto ?? 0,
      Slxeotodien: currentP0?.Slxeotodien ?? 0,
      Slxemay: currentP0?.Slxemay ?? 0,
      Slxemaydien: currentP0?.Slxemaydien ?? 0,
      Slxedap: currentP0?.Slxedap ?? 0,
      Slxedapdien: currentP0?.Slxedapdien ?? 0,
      Sltheoto: currentP0?.Sltheoto ?? 0,
      Slthexemay: currentP0?.Slthexemay ?? 0,
      Slscoto: currentP0?.Slscoto ?? 0,
      Slscotodien: currentP0?.Slscotodien ?? 0,
      Slscxemay: currentP0?.Slscxemay ?? 0,
      Slscxemaydien: currentP0?.Slscxemaydien ?? 0,
      Slscxedap: currentP0?.Slscxedap ?? 0,
      Slscxedapdien: currentP0?.Slscxedapdien ?? 0,
      Slcongto: currentP0?.Slcongto ?? 0,
      Doanhthu: currentP0?.Doanhthu ?? 0,
      Ghichu: currentP0?.Ghichu ?? ""
    }),
    [currentP0]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
  } = methods;

  useEffect(() => {
    if (currentP0) {
      reset(defaultValues);
    }
  }, [currentP0, defaultValues, reset]);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = (confirmed: boolean) => {
    setOpen(false);
    if (confirmed) {
      onSubmit();
    }
  };

  useEffect(() => {
    const handleCheck = async () => {
      try {
        const res = await axios.get(
          `http://localhost:6868/api/v2/p0/check`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCheckSubmit(res.data.data);
      } catch (error) {
        setCheckSubmit(false);
      }
    };
    handleCheck();
  }, [accessToken]);

  const handleApiRequest = async (method: string, url: string, data: any) => {
    setLoading(true);
    try {
      await axios({
        method,
        url,
        data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      enqueueSnackbar({
        variant: 'success',
        autoHideDuration: 4000,
        message: method === 'put' ? 'Cập nhật thành công!' : 'Tạo mới thành công!',
      });
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Lỗi gửi yêu cầu';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Không nhận được phản hồi từ máy chủ';
      }
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (currentP0) {
      const dataReq = {
        data,
        Ngay: currentP0?.Ngaybc,
      };
      await handleApiRequest(
        'put',
        `http://localhost:6868/api/v2/p0/update/${currentP0?.ID_P0}`,
        dataReq
      );
    } else {
      await handleApiRequest('post', `http://localhost:6868/api/v2/p0/create`, data);
    }
  });

  const renderDetails = (
    <Grid xs={12} md={12}>
      <Stack spacing={3}>
        <Box>
          <Alert severity="warning">
            <Typography>
              Nên sử dụng trình duyệt Google Chrome để nhập các chỉ số để tránh gặp lỗi khi khai báo
            </Typography>
            <Typography>
              Đối với các chỉ số không có dữ liệu thì sẽ không cần phải nhập (Mặc định là 0)
            </Typography>
          </Alert>
        </Box>
        <Box rowGap={3} columnGap={2} display="grid">
          {Object.keys(fieldCategories).map((category) => (
            <div key={category}>
              <Typography typography="h4" sx={{ pb: 2, color: '#21409A' }}>
                {category}
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                columnGap={2}
                rowGap={3}
              >
                {fieldCategories[category]?.map((field: any) => (
                  field === 'Ghichu' ? (
                    // Render text field for 'Ghichu'
                    <RHFTextField
                      key={field}
                      value={watch(field) ?? ''}
                      InputLabelProps={{
                        style: { fontWeight: 'normal', color: 'black' },
                      }}
                      name={field}
                      label={
                        fieldLabels[field] ||
                        field.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                      }
                      inputProps={{
                        inputMode: 'text',
                      }}
                      onChange={(e) => setValue(field, e.target.value)}
                    />
                  ) : (
                    // Render number fields for other fields
                    <RHFTextField
                      key={field}
                      value={`${watch(field)}` === '0' ? '' : watch(field) ?? ''}
                      InputLabelProps={{
                        style: { fontWeight: 'normal', color: 'black' },
                      }}
                      name={field}
                      label={
                        fieldLabels[field] ||
                        field.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                      }
                      inputProps={{
                        inputMode: 'decimal',
                        pattern: '[0-9]*[.,]?[0-9]+',
                        step: 0.01,
                      }}
                      onChange={(e) => {
                        const value = e?.target?.value?.replace(',', '.');
                        if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                          setValue(field, value);
                        }
                      }}
                    />
                  )
                ))}
              </Box>
            </div>
          ))}



        </Box>
      </Stack>
    </Grid>
  );


  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column-reverse',
        }}
      >
        {checkSubmit === true && !currentP0 && (
          <Button
            disabled={loading}
            variant="contained"
            size="large"
            onClick={methods.handleSubmit(handleOpenDialog)}
          >
            Tạo mới
          </Button>
        )}
        {isToday && currentP0 && (
          <Button
            disabled={loading}
            variant="contained"
            size="large"
            onClick={methods.handleSubmit(handleOpenDialog)}
          >
            Update
          </Button>
        )}
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>

      <Dialog
        open={open}
        onClose={() => handleCloseDialog(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn gửi không?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(true)} color="primary" variant="contained">
            Đồng ý
          </Button>
          <Button onClick={() => handleCloseDialog(false)}>Hủy</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}