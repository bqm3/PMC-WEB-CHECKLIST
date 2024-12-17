import * as Yup from 'yup';
import axios from 'axios';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
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
// import CheckIcon from '@mui/icons-material/Check';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles, _mapContact } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
// types
import { IHSSE } from 'src/types/khuvuc';

// ----------------------------------------------------------------------

type Props = {
  currentHSSE?: IHSSE;
};

type ValidField =
  | 'Dien_cu_dan'
  | 'Dien_cdt'
  | 'Nuoc_cu_dan'
  | 'Nuoc_cdt'
  | 'Xa_thai'
  | 'Rac_sh'
  | 'Muoi_dp'
  | 'PAC'
  | 'NaHSO3'
  | 'NaOH'
  | 'Mat_rd'
  | 'Polymer_Anion'
  | 'Chlorine_bot'
  | 'Chlorine_vien'
  | 'Methanol'
  | 'Dau_may'
  | 'Tui_rac240'
  | 'Tui_rac120'
  | 'Tui_rac20'
  | 'Tui_rac10'
  | 'Tui_rac5'
  | 'giayvs_235'
  | 'giaivs_120'
  | 'giay_lau_tay'
  | 'hoa_chat'
  | 'nuoc_rua_tay'
  | 'nhiet_do'
  | 'nuoc_bu'
  | 'clo'
  | 'PH'
  | 'Poolblock'
  | 'trat_thai'
  | 'pHMINUS'
  | 'axit'
  | 'PN180'
  | 'chiSoCO2'
  | 'clorin';

const STORAGE_KEY = 'accessToken';

export default function HSSENewEditForm({ currentHSSE }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [open, setOpen] = useState(false);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const NewProductSchema = Yup.object().shape({
    Dien_cu_dan: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Dien_cdt: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Nuoc_cu_dan: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Nuoc_cdt: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Xa_thai: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Rac_sh: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Muoi_dp: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    PAC: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    NaHSO3: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    NaOH: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Mat_rd: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Polymer_Anion: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Chlorine_bot: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Chlorine_vien: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Methanol: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Dau_may: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Tui_rac240: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Tui_rac120: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Tui_rac20: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Tui_rac10: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Tui_rac5: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    giayvs_235: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    giaivs_120: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    giay_lau_tay: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    hoa_chat: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    nuoc_rua_tay: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    nhiet_do: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    nuoc_bu: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    clo: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    PH: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    Poolblock: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    trat_thai: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    pHMINUS: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    axit: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    PN180: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    chiSoCO2: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    clorin: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),

  });

  const defaultValues = useMemo(
    () => ({
      Dien_cu_dan: currentHSSE?.Dien_cu_dan ?? 0,
      Dien_cdt: currentHSSE?.Dien_cdt ?? 0,
      Nuoc_cu_dan: currentHSSE?.Nuoc_cu_dan ?? 0,
      Nuoc_cdt: currentHSSE?.Nuoc_cdt ?? 0,
      Xa_thai: currentHSSE?.Xa_thai ?? 0,
      Rac_sh: currentHSSE?.Rac_sh ?? 0,
      Muoi_dp: currentHSSE?.Muoi_dp ?? 0,
      PAC: currentHSSE?.PAC ?? 0,
      NaHSO3: currentHSSE?.NaHSO3 ?? 0,
      NaOH: currentHSSE?.NaOH ?? 0,
      Mat_rd: currentHSSE?.Mat_rd ?? 0,
      Polymer_Anion: currentHSSE?.Polymer_Anion ?? 0,
      Chlorine_bot: currentHSSE?.Chlorine_bot ?? 0,
      Chlorine_vien: currentHSSE?.Chlorine_vien ?? 0,
      Methanol: currentHSSE?.Methanol ?? 0,
      Dau_may: currentHSSE?.Dau_may ?? 0,
      Tui_rac240: currentHSSE?.Tui_rac240 ?? 0,
      Tui_rac120: currentHSSE?.Tui_rac120 ?? 0,
      Tui_rac20: currentHSSE?.Tui_rac20 ?? 0,
      Tui_rac10: currentHSSE?.Tui_rac10 ?? 0,
      Tui_rac5: currentHSSE?.Tui_rac5 ?? 0,
      giayvs_235: currentHSSE?.giayvs_235 ?? 0,
      giaivs_120: currentHSSE?.giaivs_120 ?? 0,
      giay_lau_tay: currentHSSE?.giay_lau_tay ?? 0,
      hoa_chat: currentHSSE?.hoa_chat ?? 0,
      nuoc_rua_tay: currentHSSE?.nuoc_rua_tay ?? 0,
      nhiet_do: currentHSSE?.nhiet_do ?? 0,
      nuoc_bu: currentHSSE?.nuoc_bu ?? 0,
      clo: currentHSSE?.clo ?? 0,
      PH: currentHSSE?.PH ?? 0,
      Poolblock: currentHSSE?.Poolblock ?? 0,
      trat_thai: currentHSSE?.trat_thai ?? 0,
      pHMINUS: currentHSSE?.pHMINUS ?? 0,
      axit: currentHSSE?.axit ?? 0,
      PN180: currentHSSE?.PN180 ?? 0,
      chiSoCO2: currentHSSE?.chiSoCO2 ?? 0,
      clorin: currentHSSE?.clorin ?? 0
    }),
    [currentHSSE]
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
    if (currentHSSE) {
      reset(defaultValues);
    }
  }, [currentHSSE, defaultValues, reset]);

  const handleOpenDialog = () => {
    setOpen(true); // Mở hộp thoại
  };

  const handleCloseDialog = (confirmed: any) => {
    setOpen(false);
    if (confirmed) {
      onSubmit();
    }
  };

  useEffect(() => {
    const handleCheck = async () => {
      await axios
        .post(`https://checklist.pmcweb.vn/be/api/v2/hsse/check`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setCheckSubmit(res.data.data);
        })
        .catch((error) => {
          setCheckSubmit(false);
        });
    };
    handleCheck();
  }, [accessToken]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`https://checklist.pmcweb.vn/be/api/v2/hsse/create`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Tạo mới thành công!',
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
      });
  });

  const renderDetails = (
    <Grid xs={12} md={12}>
      <Stack spacing={3}>
        <Box>
          <Alert severity="warning">
            <Typography>
              Nên sử dụng trình duyệt Google Chrome để nhập các chỉ số để tránh gặp lỗi khi
              khai báo
            </Typography>
            <Typography>
              Đối với các chỉ số không có dữ liệu thì sẽ không cần phải nhập (Mặc định là 0)
            </Typography>
          </Alert>

        </Box>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
          }}
        >
          {[
            'Dien_cu_dan',
            'Dien_cdt',
            'Nuoc_cu_dan',
            'Nuoc_cdt',
            'Xa_thai',
            'Rac_sh',
            'Muoi_dp',
            'PAC',
            'NaHSO3',
            'NaOH',
            'Mat_rd',
            'Polymer_Anion',
            'Chlorine_bot',
            'Chlorine_vien',
            'Methanol',
            'Dau_may',
            'Tui_rac240',
            'Tui_rac120',
            'Tui_rac20',
            'Tui_rac10',
            'Tui_rac5',
            'giayvs_235',
            'giaivs_120',
            'giay_lau_tay',
            'hoa_chat',
            'nuoc_rua_tay',
            'nhiet_do',
            'nuoc_bu',
            'clo',
            'PH',
            'Poolblock',
            'trat_thai',
            'pHMINUS',
            'axit',
            'PN180',
            'chiSoCO2',
            'clorin'
          ].map((field: any) => (
            <RHFTextField
              key={field}
              value={watch(field as ValidField) === 0 ? '' : watch(field as ValidField) ?? ''}

              name={field}
              label={field.replace(/_/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase())} // Label formatting
              inputProps={{
                inputMode: 'decimal', // Cho phép nhập số thập phân
                pattern: '[0-9]*[.,]?[0-9]+', // Hỗ trợ số nguyên và số thập phân
                step: 0.01, // Chuyển step vào inputProps
              }}
              onChange={(e: any) => {
                const value = e?.target?.value?.replace(',', '.'); // Chuyển dấu phẩy thành dấu chấm
                if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                  setValue(field, value); // Lưu chuỗi thô vào state
                }
              }}
            />
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
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}
      >
        {checkSubmit === true && !currentHSSE && (
          <Button
            disabled={loading}
            variant="contained"
            size="large"
            onClick={methods.handleSubmit(handleOpenDialog)}
          >
            Tạo mới
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