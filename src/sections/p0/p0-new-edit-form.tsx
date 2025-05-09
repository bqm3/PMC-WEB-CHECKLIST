import { useMemo, useEffect, useState, useCallback } from 'react';
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
import CardManagementDialog from './s0-thaydoithe-dialog';
import LoadingDialog from './base-loading-dialog';

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
  Sotheotodk: 'SL thẻ ô tô đã bàn giao',
  Sothexemaydk: 'SL thẻ xe máy đã bàn giao',
  Sltheoto: 'SL thẻ ô tô chưa sử dụng',
  Slthexemay: 'SL thẻ xe máy chưa sử dụng',
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
  Doanhthu: 'Doanh thu từ 16h hôm trước đến 16h hôm nay',
  Ghichu: 'Ghi chú',
  Sltheotophanmem: 'SL thẻ ô tô sử dụng trên phần mềm',
  Slthexemayphanmem: 'SL thẻ xe máy sử dụng trên phần mềm',
};

const fieldCategories: any = {
  'Thông tin thẻ': ['Sotheotodk', 'Sothexemaydk'],
  'Thông tin kiểm kê tại quầy': [
    'Sltheoto',
    'Sltheotophanmem',
    'Slthexemay',
    'Slthexemayphanmem',
    'Doanhthu',
  ],
  'Thông tin xe': ['Slxeoto', 'Slxeotodien', 'Slxemay', 'Slxemaydien', 'Slxedap', 'Slxedapdien'],
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
  // 'Doanh thu': ['Doanhthu'],
  'Ghi chú': ['Ghichu'],
};

const STORAGE_KEY = 'accessToken';

export default function P0NewEditForm({ currentP0 }: Props) {
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [sothedk, setSothedk] = useState({
    Sotheotodk: 0,
    Sothexemaydk: 0,
  });

  const isToday = moment(currentP0?.Ngaybc).isSame(moment(), 'day');

  const isFieldEditable = (fieldName: string) => {
    if (fieldName === 'Ghichu') return true;
    if (['Sotheotodk', 'Sothexemaydk'].includes(fieldName)) return false;

    let check = false;
    if (
      `${user?.ID_KhoiCV}` === `4` &&
      ['Sltheoto', 'Slthexemay', 'Sltheotophanmem', 'Slthexemayphanmem'].includes(fieldName)
    ) {
      check = true;
    } else if (
      `${user?.ID_KhoiCV}` === `3` &&
      !['Sltheoto', 'Slthexemay', 'Sltheotophanmem', 'Slthexemayphanmem', 'Doanhthu'].includes(
        fieldName
      )
    ) {
      check = true;
    } else if (`${user?.ID_KhoiCV}` === `null`) {
      check = true;
    } else if (`${user?.isCheckketoan}` === `1` && fieldName === 'Doanhthu') {
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
      Sotheotodk: currentP0?.Sotheotodk ?? 0,
      Sothexemaydk: currentP0?.Sothexemaydk ?? 0,
      Sltheoto: currentP0?.Sltheoto ?? 0,
      Slthexemay: currentP0?.Slthexemay ?? 0,
      Sltheotophanmem: currentP0?.Sltheotophanmem ?? 0,
      Slthexemayphanmem: currentP0?.Slthexemayphanmem ?? 0,
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

  // Watch car-related values
  const watchSotheotodk = watch('Sotheotodk') || 0;
  const watchSltheoto = watch('Sltheoto') || 0;
  const watchSltheotophanmem = watch('Sltheotophanmem') || 0;

  const watchSlxeoto = watch('Slxeoto') || 0;
  const watchSlxeotodien = watch('Slxeotodien') || 0;

  // Watch motorcycle-related values
  const watchSothexemaydk = watch('Sothexemaydk') || 0;
  const watchSlthexemay = watch('Slthexemay') || 0;
  const watchSlthexemayphanmem = watch('Slthexemayphanmem') || 0;

  const watchSlxemay = watch('Slxemay') || 0;
  const watchSlxemaydien = watch('Slxemaydien') || 0;

  // Calculate totals for validation
  const totalCars = Number(watchSltheoto) + Number(watchSltheotophanmem);
  const totalMotorcycles = Number(watchSlthexemay) + Number(watchSlthexemayphanmem);

  const totalCars1 = Number(watchSltheoto) + Number(watchSlxeoto) + Number(watchSlxeotodien);
  const totalMotorcycles1 =
    Number(watchSlthexemay) + Number(watchSlxemay) + Number(watchSlxemaydien);

  // Check for validation errors
  const hasCarCardBalanceError = Number(watchSotheotodk) !== totalCars;
  const hasMotorcycleCardBalanceError = Number(watchSothexemaydk) !== totalMotorcycles;

  const hasCarCardBalanceError1 = Number(watchSotheotodk) !== totalCars1;
  const hasMotorcycleCardBalanceError1 = Number(watchSothexemaydk) !== totalMotorcycles1;

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

  const handleOpenCardDialog = () => {
    setCardDialogOpen(true);
  };

  const handleCloseCardDialog = () => {
    setCardDialogOpen(false);
  };

  useEffect(() => {
    const handleCheck = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_HOST_API}/p0/check`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCheckSubmit(res.data.data);
      } catch (error) {
        setCheckSubmit(false);
      }
    };
    handleCheck();
  }, [accessToken]);

  const getSoThe = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST_API}/s0-thaydoithe/${user?.ID_Duan}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.data) {
        setValue('Sotheotodk', res.data.data.sltheoto || 0);
        setValue('Sothexemaydk', res.data.data.slthexemay || 0);
        setSothedk({
          Sotheotodk: res.data.data.sltheoto || 0,
          Sothexemaydk: res.data.data.slthexemay || 0,
        });
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: 'Có lỗi xảy ra',
      });
    }
  }, [user?.ID_Duan, accessToken, setValue, enqueueSnackbar]);

  useEffect(() => {
    getSoThe();
  }, [getSoThe]);

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
        `${process.env.REACT_APP_HOST_API}/p0/update/${currentP0?.ID_P0}`,
        dataReq
      );
    } else {
      await handleApiRequest('post', `${process.env.REACT_APP_HOST_API}/p0/create`, data);
    }
  });

  // eslint-disable-next-line react/no-unstable-nested-components
  const VehicleCardBalanceAlert = () => {
    const isKhoiCV3 = user?.ID_KhoiCV === 3;

    // Determine which error flags to use based on user type
    const carError = isKhoiCV3 ? hasCarCardBalanceError1 : hasCarCardBalanceError;
    const motorcycleError = isKhoiCV3 ? hasMotorcycleCardBalanceError1 : hasMotorcycleCardBalanceError;

    // Only render if there's an error
    if (!carError && !motorcycleError) return null;

    return (
      <Box>
        <Alert severity="error">
          {carError && (
            <>
              <Typography fontWeight="bold">
                Cảnh báo: Số lượng thẻ xe ô tô không khớp
              </Typography>
              <Typography>
                {isKhoiCV3 ? (
                  <>Tổng thẻ xe ô tô chưa sử dụng ({watchSltheoto}) + xe ô tô thường ({watchSlxeoto}) +
                    xe ô tô điện ({watchSlxeotodien}) = {totalCars}</>
                ) : (
                  <>Tổng thẻ xe ô tô chưa sử dụng ({watchSltheoto}) + thẻ ô tô sử dụng trên phần
                    mềm({watchSltheotophanmem}) = {totalCars}</>
                )}
              </Typography>
              <Typography>Thẻ ô tô đã bàn giao = {watchSotheotodk}</Typography>
            </>
          )}

          {motorcycleError && (
            <>
              <Typography fontWeight="bold">
                Cảnh báo: Số lượng thẻ xe máy không khớp
              </Typography>
              <Typography>
                {isKhoiCV3 ? (
                  <>Tổng thẻ xe chưa sử dụng ({watchSlthexemay}) + xe máy thường ({watchSlxemay}) +
                    xe máy điện ({watchSlxemaydien}) = {totalMotorcycles}</>
                ) : (
                  <>Tổng thẻ xe chưa sử dụng ({watchSlthexemay}) + thẻ xe máy sử dụng trên phần mềm
                    ({watchSlthexemayphanmem}) = {totalMotorcycles}</>
                )}
              </Typography>
              <Typography>Thẻ xe máy đã bàn giao = {watchSothexemaydk}</Typography>
            </>
          )}

          <>
            <Typography fontWeight="bold">
              Hướng dẫn nhập liệu
            </Typography>
            <Typography>
              - Chỉ giám đốc nhập Thông tin thẻ
              <br />
              - Dịch vụ nhập Thông tin kiểm kê tại quầy
              <br />
              - Kế toán nhập doanh thu <br />
              - An ninh nhập thông tin xe, sự cố và ghi chú
            </Typography>

          </>

        </Alert>
      </Box>
    );
  };

  const renderDetails = (
    <Grid xs={12} md={12}>
      <Stack spacing={3}>

        {VehicleCardBalanceAlert()}

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
      {(`${user?.ent_chucvu?.Role}` === `1` || `${user?.ent_chucvu?.Role}` === `10`) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Button
            disabled={loading}
            variant="contained"
            size="large"
            color="primary"
            onClick={handleOpenCardDialog}
          >
            Thay đổi SL thẻ đã bàn giao
          </Button>
        </div>
      )}

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

      <CardManagementDialog
        open={cardDialogOpen}
        getSoThe={getSoThe}
        onClose={handleCloseCardDialog}
        onSubmit={handleCloseCardDialog}
        currentValues={sothedk}
        setIsLoading={setIsLoading}
      />

      <LoadingDialog open={isLoading} message="Đang cập nhật" description="Vui lòng chờ" />
    </FormProvider>
  );
}
