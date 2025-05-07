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
import moment from 'moment';
import { useAuthContext } from 'src/auth/hooks';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

type Props = {
  currentHSSE?: IHSSE;
};

const fieldLabels: any = {
  Dien_cu_dan: 'Điện Cư Dân',
  Dien_cdt: 'Điện CĐT',
  Nuoc_cu_dan: 'Nước Cư Dân',
  Nuoc_cdt: 'Nước CĐT',
  Xa_thai: 'Xả Thải',
  Rac_sh: 'Rác sinh hoạt',
  Muoi_dp: 'Muối điện phân (NaCl)',
  PAC: 'PAC',
  NaHSO3: 'NaHSO3',
  NaOH: 'NaOH',
  Mat_rd: 'Mật rỉ đường',
  Polymer_Anion: 'Polymer Anion',
  Chlorine_bot: 'Chlorine Bột',
  Chlorine_vien: 'Chlorine Viên',
  Methanol: 'Methanol',
  Dau_may: 'Dầu máy phát (đầu DO)',
  Tui_rac240: 'Túi rác 240L',
  Tui_rac120: 'Túi rác 120L',
  Tui_rac20: 'Túi rác 20L',
  Tui_rac10: 'Túi rác 10L',
  Tui_rac5: 'Túi rác 5L',
  giayvs_235: 'Giấy vệ sinh 235mm',
  giaivs_120: 'Giấy vệ sinh 120mm',
  giay_lau_tay: 'Giấy lau tay',
  hoa_chat: 'Hóa chất làm sạch',
  nuoc_rua_tay: 'Nước rửa tay',
  nhiet_do: 'Nhiệt Độ',
  nuoc_bu: 'Nước bù bể bơi',
  clo: 'Chỉ số Clo dư (mg/lít)',
  PH: 'Độ PH bể',
  Poolblock: 'Pool block Hóa chất',
  trat_thai: 'Trạt thải xây dựng (Xà bần)',
  pHMINUS: 'pH MINUS Hóa chất',
  axit: 'Axit HCL',
  PN180: 'PN180 chất trợ lắng',
  chiSoCO2: 'Chỉ Số CO2',
  clorin: 'Clorin 90%',
  NaOCL: 'NaOCL',
};

const fieldCategories: any = {
  'Hóa chất': [
    'PAC',
    'NaHSO3',
    'NaOH',
    'Mat_rd',
    'Polymer_Anion',
    'clorin',
    'Chlorine_bot',
    'Chlorine_vien',
    'axit',
    'pHMINUS',
    'Poolblock',
    'PN180',
    'Muoi_dp',
    'clo',
    'PH',
    'Methanol',
    'NaOCL',
  ],
  'Năng lượng': ['Dien_cu_dan', 'Dien_cdt', 'Dau_may'],
  Nước: ['Nuoc_cu_dan', 'Nuoc_cdt', 'Xa_thai', 'nuoc_bu'],

  'Chỉ số CO2 tại tầng hầm': ['chiSoCO2'],

  'Hóa chất dùng cho làm sạch': ['hoa_chat', 'nuoc_rua_tay'],
  'Rác thải': ['Rac_sh', 'trat_thai'],
  'Túi đựng rác': ['Tui_rac240', 'Tui_rac120', 'Tui_rac20', 'Tui_rac10', 'Tui_rac5'],
  Giấy: ['giayvs_235', 'giaivs_120', 'giay_lau_tay'],
  'Nhiệt độ': ['nhiet_do'],
};

const STORAGE_KEY = 'accessToken';

export default function HSSENewEditForm({ currentHSSE }: Props) {
  const router = useRouter();

  const { user } = useAuthContext();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [open, setOpen] = useState(false);
  const [openWarn, setOpenWarn] = useState(false);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const isToday = moment(currentHSSE?.Ngay_ghi_nhan).isSame(moment(), 'day');
  const [htmlRes, setHtmlRes] = useState('');

  const NewProductSchema = Yup.object().shape({
    Ngay_ghi_nhan: Yup.string().nullable(),
    Ghichu: Yup.string().nullable(),
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
    NaOCL: Yup.number()
      .typeError('Giá trị phải là số hợp lệ')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : parseFloat(originalValue)
      )
      .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
  });

  const defaultValues = useMemo(
    () => ({
      Ngay_ghi_nhan: currentHSSE?.Ngay_ghi_nhan ?? `${new Date()}`,
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
      clorin: currentHSSE?.clorin ?? 0,
      NaOCL: currentHSSE?.NaOCL ?? 0,
      Ghichu: currentHSSE?.Ghichu ?? '',
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
        .post(`${process.env.REACT_APP_HOST_API}/api/v2/hsse/check`, [], {
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

  const handleApiRequest = async (method: any, url: any, data: any) => {
    setLoading(true);
    try {
      const res = await axios({
        method,
        url,
        data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setHtmlRes(res?.data?.htmlResponse);
      if (res.data.htmlResponse !== null && res.data.htmlResponse !== '') {
        setOpenWarn(true);
      } else {
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: method === 'put' ? 'Cập nhật thành công!' : 'Tạo mới thành công!',
        });
      }
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
    const dataReq = {
      data,
      Ngay: currentHSSE?.Ngay_ghi_nhan,
    };
    if (user?.ent_chucvu.Role === 10) {
      if (currentHSSE) {
        await handleApiRequest(
          'put',
          `${process.env.REACT_APP_HOST_API}/api/v2/hsse/update/psh/${currentHSSE?.ID}`,
          dataReq
        );
      } else {
        await handleApiRequest('post', `${process.env.REACT_APP_HOST_API}/api/v2/hsse/create/psh`, data);
      }
    } else if (currentHSSE) {
      await handleApiRequest(
        'put',
        `${process.env.REACT_APP_HOST_API}/api/v2/hsse/update/${currentHSSE?.ID}`,
        dataReq
      );
    } else {
      await handleApiRequest('post', `${process.env.REACT_APP_HOST_API}/api/v2/hsse/create`, data);
    }
  });

  const renderDetails = (
    <Grid xs={12} md={12}>
      <Stack spacing={3}>

        <Box rowGap={3} columnGap={2} display="grid">
          {user?.ent_chucvu?.Role === 10 && (
            <>
              <RHFTextField name="Ghichu" label="Ghi chú" />

              <Controller
                name="Ngay_ghi_nhan"
                control={control}
                render={({ field }) => (
                  <RHFTextField {...field} type="date" label="Ngày ghi nhận" />
                )}
              />
            </>
          )}

          {Object.keys(fieldCategories).map((category: any) => (
            <div key={category}>
              <Typography typography="h4" sx={{ pb: 2, color: '#21409A' }}>
                {category}
              </Typography>{' '}
              {/* Display category name */}
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)" // Chia thành 4 cột
                columnGap={2}
                rowGap={3}
              >
                {fieldCategories[category]?.map((field: any) => (
                  <RHFTextField
                    key={field}
                    value={watch(field) === 0 ? '' : watch(field) ?? ''}
                    InputLabelProps={{
                      style: { fontWeight: 'normal', color: 'black' },
                    }}
                    name={field}
                    label={
                      fieldLabels[field] ||
                      field.replace(/_/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase())
                    }
                    inputProps={{
                      inputMode: 'decimal', // Cho phép nhập số thập phân
                      pattern: '[0-9]*[.,]?[0-9]+', // Hỗ trợ số nguyên và số thập phân
                      step: 0.01, // Chuyển step vào inputProps
                    }}
                    onChange={(e) => {
                      const value = e?.target?.value?.replace(',', '.'); // Chuyển dấu phẩy thành dấu chấm
                      if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                        setValue(field, value); // Lưu chuỗi thô vào state
                      }
                    }}
                  />
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
        {isToday && currentHSSE && checkSubmit === true && (
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

  const renderPSHActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}
      >
        {user?.ent_chucvu.Role === 10 && !currentHSSE && (
          <Button
            disabled={loading}
            variant="contained"
            size="large"
            onClick={methods.handleSubmit(handleOpenDialog)}
          >
            Tạo mới
          </Button>
        )}
        {user?.ent_chucvu.Role === 10 && currentHSSE && (
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
        {renderPSHActions}
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

      <Dialog
        open={openWarn}
        onClose={() => setOpenWarn(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="confirm-dialog-description"
            dangerouslySetInnerHTML={{ __html: htmlRes }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWarn(false)}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
