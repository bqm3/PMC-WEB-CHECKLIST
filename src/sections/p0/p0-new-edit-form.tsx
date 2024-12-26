import { useMemo, useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from 'src/auth/hooks';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
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
  Slsucokhac: 'Sự cố khác',
  Slcongto: 'Công tơ điện',
  QuansoTT: 'Quân số thực tế',
  QuansoDB: 'Quân số định biên',
  Doanhthu: 'Doanh thu từ 6h đến 18h',
  Ghichu: 'Ghi chú',
};

const fieldIds: { [key: string]: number } = {
  Slxeoto: 0,
  Slxeotodien: 1,
  Slxemaydien: 2,
  Slxemay: 3,
  Slxedapdien: 4,
  Slxedap: 5,
  Sltheoto: 6,
  Slthexemay: 7,
  Slscoto: 8,
  Slscotodien: 9,
  Slscxemaydien: 10,
  Slscxemay: 11,
  Slscxedapdien: 12,
  Slscxedap: 13,
  Slsucokhac: 14,
  Slcongto: 15,
  QuansoTT: 16,
  QuansoDB: 17,
  Doanhthu: 18,
};

const fieldCategories: any = {
  'Thông tin xe': ['Slxeoto', 'Slxeotodien', 'Slxemay', 'Slxemaydien', 'Slxedap', 'Slxedapdien'],
  'Thông tin thẻ': ['Sltheoto', 'Slthexemay'],
  'Sự cố': [
    'Slscoto',
    'Slscotodien',
    'Slscxemay',
    'Slscxemaydien',
    'Slscxedap',
    'Slscxedapdien',
    'Slsucokhac',
  ],
  'Thông tin khác': ['QuansoTT', 'QuansoDB', 'Slcongto'],
  'Doanh thu': ['Doanhthu'],
  'Ghi chú': ['Ghichu'],
};

const STORAGE_KEY = 'accessToken';

export default function P0NewEditForm({ currentP0 }: Props) {
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const isToday = moment(currentP0?.Ngaybc).isSame(moment(), 'day');

  const isFieldEditable = (fieldName: string) => {
    if (fieldName === 'Ghichu') return true;
    console.log('fieldName', fieldName);
    console.log('user?.ID_KhoiCV', user?.ID_KhoiCV);

    let check = false;
    if (`${user?.ID_KhoiCV}` === `4` && fieldName === 'Doanhthu') {
      check = true;
    } else if (`${user?.ID_KhoiCV}` === `3` && fieldName !== 'Doanhthu') {
      check = true;
    } else if (`${user?.ID_KhoiCV}` === `null`) {
      check = true;
    }
    return check;
  };

  const NewProductSchema = Yup.object().shape(
    Object.keys(fieldLabels).reduce((acc: any, field) => {
      if (field === 'Ghichu') {
        // 'Ghichu' is a text field
        acc[field] = Yup.string().nullable().max(255, 'Ghi chú không được vượt quá 255 ký tự');
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
      Slsucokhac: currentP0?.Slsucokhac ?? 0,
      QuansoTT: currentP0?.QuansoTT ?? 0,
      QuansoDB: currentP0?.QuansoDB ?? 0,
      Doanhthu: currentP0?.Doanhthu ?? 0,
      Ghichu: currentP0?.Ghichu ?? '',
    }),
    [currentP0]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

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
        const res = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/p0/check`,
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
        `https://checklist.pmcweb.vn/be/api/v2/p0/update/${currentP0?.ID_P0}`,
        dataReq
      );
    } else {
      await handleApiRequest('post', `https://checklist.pmcweb.vn/be/api/v2/p0/create`, data);
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
              <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" columnGap={2} rowGap={3}>
                {fieldCategories[category]?.map((field: any) =>
                  field === 'Ghichu' ? (
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
                        style: {
                          fontSize: '16px',
                          paddingTop: '10px',
                          paddingBottom: '10px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          textAlign: 'left',
                        },
                      }}
                      onChange={(e) => setValue(field, e.target.value)}
                      multiline
                      maxRows={6}
                    />
                  ) : (
                    // Render number fields for other fields
                    <RHFTextField
                      key={field}
                      value={watch(field) ?? ''}
                      InputLabelProps={{
                        style: {
                          fontWeight: 'normal',
                          color: isFieldEditable(field) ? 'black' : 'red',
                        },
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
                      disabled={!isFieldEditable(field)}
                    />
                  )
                )}
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
        {isToday && currentP0 && checkSubmit === true && (
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
