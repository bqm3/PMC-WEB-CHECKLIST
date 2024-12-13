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
  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
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
    Dien_cu_dan: Yup.number(),
    Dien_cdt: Yup.number(),
    Nuoc_cu_dan: Yup.number(),
    Nuoc_cdt: Yup.number(),
    Xa_thai: Yup.number(),
    Rac_sh: Yup.number(),
    Muoi_dp: Yup.number(),
    PAC: Yup.number(),
    NaHSO3: Yup.number(),
    NaOH: Yup.number(),
    Mat_rd: Yup.number(),
    Polymer_Anion: Yup.number(),
    Chlorine_bot: Yup.number(),
    Chlorine_vien: Yup.number(),
    Methanol: Yup.number(),
    Dau_may: Yup.number(),
    Tui_rac240: Yup.number(),
    Tui_rac120: Yup.number(),
    Tui_rac20: Yup.number(),
    Tui_rac10: Yup.number(),
    Tui_rac5: Yup.number(),
    giayvs_235: Yup.number(),
    giaivs_120: Yup.number(),
    giay_lau_tay: Yup.number(),
    hoa_chat: Yup.number(),
    nuoc_rua_tay: Yup.number(),
    nhiet_do: Yup.number(),
    nuoc_bu: Yup.number(),
    clo: Yup.number(),
    PH: Yup.number(),
    Poolblock: Yup.number(),
    trat_thai: Yup.number(),
    pHMINUS: Yup.number(),
    axit: Yup.number(),
    PN180: Yup.number(),
    chiSoCO2: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      Dien_cu_dan: currentHSSE?.Dien_cu_dan || 0,
      Dien_cdt: currentHSSE?.Dien_cdt || 0,
      Nuoc_cu_dan: currentHSSE?.Nuoc_cu_dan || 0,
      Nuoc_cdt: currentHSSE?.Nuoc_cdt || 0,
      Xa_thai: currentHSSE?.Xa_thai || 0,
      Rac_sh: currentHSSE?.Rac_sh || 0,
      Muoi_dp: currentHSSE?.Muoi_dp || 0,
      PAC: currentHSSE?.PAC || 0,
      NaHSO3: currentHSSE?.NaHSO3 || 0,
      NaOH: currentHSSE?.NaOH || 0,
      Mat_rd: currentHSSE?.Mat_rd || 0,
      Polymer_Anion: currentHSSE?.Polymer_Anion || 0,
      Chlorine_bot: currentHSSE?.Chlorine_bot || 0,
      Chlorine_vien: currentHSSE?.Chlorine_vien || 0,
      Methanol: currentHSSE?.Methanol || 0,
      Dau_may: currentHSSE?.Dau_may || 0,
      Tui_rac240: currentHSSE?.Tui_rac240 || 0,
      Tui_rac120: currentHSSE?.Tui_rac120 || 0,
      Tui_rac20: currentHSSE?.Tui_rac20 || 0,
      Tui_rac10: currentHSSE?.Tui_rac10 || 0,
      Tui_rac5: currentHSSE?.Tui_rac5 || 0,
      giayvs_235: currentHSSE?.giayvs_235 || 0,
      giaivs_120: currentHSSE?.giaivs_120 || 0,
      giay_lau_tay: currentHSSE?.giay_lau_tay || 0,
      hoa_chat: currentHSSE?.hoa_chat || 0,
      nuoc_rua_tay: currentHSSE?.nuoc_rua_tay || 0,
      nhiet_do: currentHSSE?.nhiet_do || 0,
      nuoc_bu: currentHSSE?.nuoc_bu || 0,
      clo: currentHSSE?.clo || 0,
      PH: currentHSSE?.PH || 0,
      Poolblock: currentHSSE?.Poolblock || 0,
      trat_thai: currentHSSE?.trat_thai || 0,
      pHMINUS: currentHSSE?.pHMINUS || 0,
      axit: currentHSSE?.axit || 0,
      PN180: currentHSSE?.PN180 || 0,
      chiSoCO2: currentHSSE?.chiSoCO2 || 0,
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
      await axios.post(`http://localhost:6868/api/v2/hsse/check`, [], {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          setCheckSubmit(res.data.data)
        })
        .catch((error) => {
          setCheckSubmit(false)
        });
    }
    handleCheck()
  }, [accessToken])


  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    await axios
      .post(`http://localhost:6868/api/v2/hsse/create`, data, {
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
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
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
  })

  const renderDetails = (
    <Grid xs={12} md={12}>
      <Stack spacing={3}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
          }}
        >
          <RHFTextField
            value={watch('Dien_cu_dan') ?? 0}
            name="Dien_cu_dan"
            label="Điện cư dân"
            type="number"
          />
          <RHFTextField
            value={watch('Dien_cdt') ?? 0}
            name="Dien_cdt"
            label="Điện chủ đầu tư"
            type="number"
          />
          <RHFTextField
            value={watch('Nuoc_cu_dan') ?? 0}
            name="Nuoc_cu_dan"
            label="Nước cư dân"
            type="number"
          />
          <RHFTextField
            value={watch('Nuoc_cdt') ?? 0}
            name="Nuoc_cdt"
            label="Nước chủ đầu tư"
            type="number"
          />
          <RHFTextField
            value={watch('Xa_thai') ?? 0}
            name="Xa_thai"
            label="Nước xả thải"
            type="number"
          />
          <RHFTextField
            value={watch('Rac_sh') ?? 0}
            name="Rac_sh"
            label="Rác sinh hoạt"
            type="number"
          />
          <RHFTextField
            value={watch('Muoi_dp') ?? 0}
            name="Muoi_dp"
            label="Muối điện phân"
            type="number"
          />
          <RHFTextField value={watch('PAC') ?? 0} name="PAC" label="PAC" type="number" />
          <RHFTextField value={watch('NaHSO3') ?? 0} name="NaHSO3" label="NaHSO3" type="number" />
          <RHFTextField value={watch('NaOH') ?? 0} name="NaOH" label="NaOH" type="number" />
          <RHFTextField
            value={watch('Mat_rd') ?? 0}
            name="Mat_rd"
            label="Mật rỉ đường"
            type="number"
          />
          <RHFTextField
            value={watch('Polymer_Anion') ?? 0}
            name="Polymer_Anion"
            label="Polymer Anion"
            type="number"
          />
          <RHFTextField
            value={watch('Chlorine_bot') ?? 0}
            name="Chlorine_bot"
            label="Chlorine bột"
            type="number"
          />
          <RHFTextField
            value={watch('Chlorine_vien') ?? 0}
            name="Chlorine_vien"
            label="Chlorine viên"
            type="number"
          />
          <RHFTextField
            value={watch('Methanol') ?? 0}
            name="Methanol"
            label="Methanol"
            type="number"
          />
          <RHFTextField
            value={watch('Dau_may') ?? 0}
            name="Dau_may"
            label="Dầu máy phát"
            type="number"
          />
          <RHFTextField
            value={watch('Tui_rac240') ?? 0}
            name="Tui_rac240"
            label="Túi rác 240L"
            type="number"
          />
          <RHFTextField
            value={watch('Tui_rac120') ?? 0}
            name="Tui_rac120"
            label="Túi rác 120L"
            type="number"
          />
          <RHFTextField
            value={watch('Tui_rac20') ?? 0}
            name="Tui_rac20"
            label="Túi rác 20L"
            type="number"
          />
          <RHFTextField
            value={watch('Tui_rac10') ?? 0}
            name="Tui_rac10"
            label="Túi rác 10L"
            type="number"
          />
          <RHFTextField
            value={watch('Tui_rac5') ?? 0}
            name="Tui_rac5"
            label="Túi rác 5L"
            type="number"
          />
          <RHFTextField
            value={watch('giayvs_235') ?? 0}
            name="giayvs_235"
            label="Giấy vệ sinh 235mm"
            type="number"
          />
          <RHFTextField
            value={watch('giaivs_120') ?? 0}
            name="giaivs_120"
            label="Giấy vệ sinh 120mm"
            type="number"
          />
          <RHFTextField
            value={watch('giay_lau_tay') ?? 0}
            name="giay_lau_tay"
            label="Giấy lau tay"
            type="number"
          />
          <RHFTextField
            value={watch('hoa_chat') ?? 0}
            name="hoa_chat"
            label="Hóa chất làm sạch"
            type="number"
          />
          <RHFTextField
            value={watch('nuoc_rua_tay') ?? 0}
            name="nuoc_rua_tay"
            label="Nước rửa tay"
            type="number"
          />
          <RHFTextField
            value={watch('nhiet_do') ?? 0}
            name="nhiet_do"
            label="Nhiệt độ"
            type="number"
          />
          <RHFTextField
            value={watch('nuoc_bu') ?? 0}
            name="nuoc_bu"
            label="Nước bù bể"
            type="number"
          />
          <RHFTextField value={watch('clo') ?? 0} name="clo" label="Clo" type="number" />
          <RHFTextField value={watch('PH') ?? 0} name="PH" label="Nồng độ PH" type="number" />
          <RHFTextField
            value={watch('Poolblock') ?? 0}
            name="Poolblock"
            label="Poolblock"
            type="number"
          />
          <RHFTextField
            value={watch('trat_thai') ?? 0}
            name="trat_thai"
            label="Chất thải"
            type="number"
          />
          <RHFTextField
            value={watch('pHMINUS') ?? 0}
            name="pHMINUS"
            label="pH Minus"
            type="number"
          />
          <RHFTextField value={watch('axit') ?? 0} name="axit" label="Axit" type="number" />
          <RHFTextField value={watch('PN180') ?? 0} name="PN180" label="PN180" type="number" />
          <RHFTextField
            value={watch('chiSoCO2') ?? 0}
            name="chiSoCO2"
            label="Chỉ số CO2"
            type="number"
          />
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
        {
          checkSubmit === true && !currentHSSE &&
          <Button
            disabled={loading}
            variant="contained" size="large"
            onClick={methods.handleSubmit(handleOpenDialog)}
          >
            Tạo mới
          </Button>
        }
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
          <DialogContentText>
            Bạn có chắc chắn muốn gửi không?
          </DialogContentText>
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
