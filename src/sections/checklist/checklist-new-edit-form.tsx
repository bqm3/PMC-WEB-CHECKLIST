import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles } from 'src/_mock';
// api
import {
  useGetKhuVuc,
  useGetToanha,
  useGetKhoiCV,
  useGetTang,
  useGetHangMuc,
  useGetCalv,
} from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';
// types
import { IToanha, IChecklist } from 'src/types/khuvuc';
import axios from 'axios';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  currentChecklist?: IChecklist;
};

const STORAGE_KEY = 'accessToken';

export default function ChecklistNewEditForm({ currentChecklist }: Props) {
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const { khoiCV } = useGetKhoiCV();
  const { tang, tangLoading, tangEmpty } = useGetTang();
  const { hangMuc, hangMucLoading, hangMucEmpty } = useGetHangMuc();

  const [Calv, setCalv] = useState<any>([]);
  const [khuVuc, setKhuVuc] = useState<any>([]);
  const [toaNha, setToaNha] = useState<IToanha[]>([]);
  const [HangMuc, setHangMuc] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { khuvuc, khuvucLoading, khuvucEmpty } = useGetKhuVuc();
  const { toanha, toanhaLoading, toanhaEmpty } = useGetToanha();
  const { calv } = useGetCalv();

  useEffect(() => {
    if (toanha?.length > 0) {
      setToaNha(toanha);
    }
  }, [toanha]);

  const NewProductSchema = Yup.object().shape({
    Checklist: Yup.string().required('Phải có tên checklist'),
    ID_KhoiCV: Yup.string(),
    ID_Khuvuc: Yup.string(),
    ID_Toanha: Yup.string(),
    isCheck: Yup.string(),
    isImportant: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      Checklist: currentChecklist?.Checklist || '',
      Giatridinhdanh: currentChecklist?.Giatridinhdanh || '',
      Giatrinhan: currentChecklist?.Giatrinhan || '',
      MaQrCode: currentChecklist?.MaQrCode || '',
      Sothutu: currentChecklist?.Sothutu || '',
      isCheck: currentChecklist?.isCheck || '0',
      isImportant: currentChecklist?.isImportant || '0',
      Maso: currentChecklist?.Maso || '',
      Ghichu: currentChecklist?.Ghichu || '',
      Tieuchuan: currentChecklist?.Tieuchuan || '',
      ID_KhoiCV: currentChecklist?.ent_hangmuc?.ID_KhoiCV || null || '',
      ID_Khuvuc: currentChecklist?.ent_hangmuc?.ent_khuvuc?.ID_Khuvuc || null || '',
      ID_Toanha: currentChecklist?.ent_hangmuc?.ent_khuvuc?.ID_Toanha || null || '',
      ID_Hangmuc: currentChecklist?.ID_Hangmuc || null,
      ID_Tang: currentChecklist?.ID_Tang || null,
      sCalv: currentChecklist?.sCalv || [],
    }),
    [currentChecklist]
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
    // Set loading state to true at the beginning
    setLoading(true);

    // Declare an array to hold the filtered or full list of calv items
    let filteredCalv;

    if (values.ID_KhoiCV) {
      // Filter the calv array based on ID_KhoiCV from values
      filteredCalv = calv?.filter((item) => item.ID_KhoiCV === values.ID_KhoiCV) || [];
    } else {
      // Use the full calv array if ID_KhoiCV is not provided
      filteredCalv = calv;
    }
    const sCalvArray = Array.isArray(defaultValues.sCalv)
      ? defaultValues.sCalv
      : [defaultValues.sCalv];

    // Merge sCalv with the list of ID_Calv from filteredCalv
    const mergedIDCalv = sCalvArray.concat(filteredCalv?.map((item) => item.ID_Calv));

    // Remove duplicates by creating a Set and converting it back to an array
    const uniqueIDCalv = Array.from(new Set(mergedIDCalv));

    // Create a new array with the desired structure: { value: ID_Calv, label: Tenca }
    const newArray = uniqueIDCalv
      .map((idCalv) => {
        // Find the corresponding item in the filteredCalv array
        const item = calv.find((iTem) => iTem.ID_Calv === idCalv);

        // If the item is found, return an object with the desired structure
        if (item) {
          return {
            value: item.ID_Calv,
            label: `${item.Tenca} - ${item.ent_khoicv.KhoiCV}`,
          };
        }

        // If the item is not found, return null or handle it as needed
        return null;
      })
      .filter((item) => item !== null);

    // Update the state with the new array
    setCalv(newArray);

    // Set loading state to false at the end
    setLoading(false);
  }, [values.ID_KhoiCV, calv, defaultValues.sCalv]);

  useEffect(() => {
    let filteredToanha;
    // Filter the hangMuc array based on ID_KhoiCV from values
    if (values.ID_Toanha && values.ID_KhoiCV) {
      filteredToanha =
        khuvuc?.filter(
          (item: any) =>
            item.ID_Toanha === values.ID_Toanha &&
            (values.ID_KhoiCV ? item.ID_KhoiCVs.includes(values.ID_KhoiCV) : true)
        ) || [];

      // Create a new array with the desired structure: { ID_Hangmuc: ID_Hangmuc, Hangmuc: item }
    } else {
      filteredToanha = khuvuc;
    }
    const newArray = filteredToanha?.map((item: any) => ({
      ID_Khuvuc: item.ID_Khuvuc,
      Khuvuc: item,
    }));

    // Update the state with the new array
    setKhuVuc(newArray);
  }, [values.ID_Toanha, values.ID_KhoiCV, khuvuc]);

  useEffect(() => {
    let filteredKhoiCV;

    if (values.ID_KhoiCV) {
      // Filter the hangMuc array based on ID_KhoiCV from values
      filteredKhoiCV = hangMuc?.filter((item) => item.ID_KhoiCV === values.ID_KhoiCV) || [];
      if (values.ID_Khuvuc) {
        filteredKhoiCV = filteredKhoiCV.filter((item) => item.ID_Khuvuc === values.ID_Khuvuc);
      }
    } else {
      // Use the full hangMuc array if ID_KhoiCV is not provided
      filteredKhoiCV = hangMuc;
    }

    // Create a new array with the desired structure: { ID_Hangmuc: ID_Hangmuc, Hangmuc: item }
    const newArray = filteredKhoiCV?.map((item) => ({
      ID_Hangmuc: item.ID_Hangmuc,
      Hangmuc: item,
    }));

    // Update the state with the new array
    setHangMuc(newArray);
  }, [values.ID_KhoiCV, values.ID_Khuvuc, hangMuc]);

  useEffect(() => {
    if (currentChecklist) {
      reset(defaultValues);
    }
  }, [currentChecklist, defaultValues, reset]);

  // useEffect(() => {
  //   if (includeTaxes) {
  //     setValue('taxes', 0);
  //   } else {
  //     setValue('taxes', currentProduct?.taxes || 0);
  //   }
  // }, [currentProduct?.taxes, includeTaxes, setValue]);

  const handleChangeIncludeCheck = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue('isCheck', event.target.checked ? '1' : '0');
    },
    [setValue]
  );

  const handleChangeIncludeImportant = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue('isImportant', event.target.checked ? '1' : '0');
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentChecklist !== undefined) {
        await axios
          .put(
            `https://checklist.pmcweb.vn/be//api/ent_checklist/update/${currentChecklist.ID_Checklist}`,
            data,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((res) => {
            // reset();
            enqueueSnackbar({
              variant: 'success',
              autoHideDuration: 2000,
              message: 'Cập nhật thành công',
            });
            router.push(paths.dashboard.checklist.root);
          })
          .catch((error) => {
            if (error.response) {
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `${error.response.data.message}`,
              });
            } else if (error.request) {
              // Lỗi không nhận được phản hồi từ server
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `Không nhận được phản hồi từ máy chủ`,
              });
            } else {
              // Lỗi khi cấu hình request
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `Lỗi gửi yêu cầu`,
              });
            }
          });
      } else {
        axios
          .post(`https://checklist.pmcweb.vn/be//api/ent_checklist/create`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            // reset();
            enqueueSnackbar('Tạo mới thành công!');
          })
          .catch((error) => {
            console.log('error.response', error.response);
            if (error.response) {
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `${error.response.data.message}`,
              });
            } else if (error.request) {
              // Lỗi không nhận được phản hồi từ server
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `Không nhận được phản hồi từ máy chủ`,
              });
            } else {
              // Lỗi khi cấu hình request
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `Lỗi gửi yêu cầu`,
              });
            }
          });
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
        message: `Lỗi gửi yêu cầu`,
      });
    }
  });

  const renderPrimary = (
    <>
      {mdUp && (
        <Grid md={3}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Thuộc tính
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên checklist, Mã Qr Code, Giá trị nhận/ định danh...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Thuộc tính" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {khoiCV?.length > 0 && (
                <RHFSelect
                  name="ID_KhoiCV"
                  label="Khối công việc"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {khoiCV?.map((item) => (
                    <MenuItem key={item?.ID_Khoi} value={item?.ID_Khoi}>
                      {item?.KhoiCV}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}

              {tang?.length > 0 && (
                <RHFSelect
                  name="ID_Tang"
                  label="Tầng"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {tang?.map((item) => (
                    <MenuItem key={item?.ID_Tang} value={item?.ID_Tang}>
                      {item?.Tentang}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <RHFSelect
              name="ID_Toanha"
              label="Tòa nhà"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {toaNha?.map((item: any) => (
                <MenuItem key={item?.ID_Toanha} value={item?.ID_Toanha}>
                  {item?.Toanha}
                </MenuItem>
              ))}
            </RHFSelect>

            {khuVuc?.length > 0 && (
              <RHFSelect
                name="ID_Khuvuc"
                label="Khu vực"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {khuVuc?.map((item: any) => (
                  <MenuItem key={item?.ID_Khuvuc} value={item?.ID_Khuvuc}>
                    {item?.Khuvuc?.ent_toanha?.Toanha} ({item?.Khuvuc?.Tenkhuvuc})
                  </MenuItem>
                ))}
              </RHFSelect>
            )}

            <RHFSelect
              name="ID_Hangmuc"
              label="Hạng mục"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {HangMuc?.map((item: any) => (
                <MenuItem key={item?.ID_Hangmuc} value={item?.ID_Hangmuc}>
                  {item?.Hangmuc?.Hangmuc} ({item?.Hangmuc?.MaQrCode})
                </MenuItem>
              ))}
            </RHFSelect>

            {loading === false && (
              <>
                {Calv.length > 0 && Calv?.length > 0 ? (
                  <RHFMultiSelect checkbox name="sCalv" label="Ca làm việc" options={Calv} />
                ) : (
                  <></>
                )}
              </>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={3}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên checklist, Mã Qr Code, Giá trị nhận/ định danh...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="Checklist" label="Tên checklist *" />
            <RHFTextField name="MaQrCode" label="Mã Qr Code" />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <RHFTextField name="Sothutu" label="Số thứ tự" />
              <RHFTextField name="Maso" label="Mã số" />
            </Stack>
            <Stack>
              <RHFTextField name="Giatridinhdanh" label="Giá trị định danh" />
              <Typography style={{ paddingTop: 10 }} variant="caption" color="primary">
                Nếu không có không phải nhập
              </Typography>
            </Stack>
            <Stack>
              <RHFTextField name="Giatrinhan" label="Giá trị nhận" />
              <Typography style={{ paddingTop: 10 }} variant="caption" color="red">
                Tại ô Giá trị nhận nhập theo định dạng - Giá trị 1/Giá trị 2... (Ví dụ: Sáng/Tắt,
                Bật/Tắt, Đạt/Không đạt, On/Off,...)
              </Typography>
            </Stack>
            <RHFTextField name="Tieuchuan" label="Tiêu chuẩn kiểm tra" multiline rows={3} />
            <RHFTextField name="Ghichu" label="Ghi chú" multiline rows={3} />

            <FormControlLabel
              control={
                <Switch checked={`${values.isCheck}` === '1'} onChange={handleChangeIncludeCheck} />
              }
              label="Nhập liệu"
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );
  
  const renderActions = (
    <>
      {mdUp && <Grid md={3} />}
      <Grid xs={12} md={9} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
           control={
            <Switch checked={`${values.isImportant}` === '1'} onChange={handleChangeIncludeImportant} />
          }
          label="Quan trọng"
          sx={{ flexGrow: 1}}
        />
        
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}   sx={{ ml: 2 }}>
          {!currentChecklist ? 'Tạo mới' : 'Lưu thay đổi'}
        </LoadingButton>
      </Grid>
    </>
  );


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderPrimary}

        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
