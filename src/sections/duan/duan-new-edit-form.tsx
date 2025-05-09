import * as Yup from 'yup';
import axios from 'axios';
import { useMemo, useEffect, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
// _mock
import { _tags, _roles, _mapContact } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
import { IDuan } from 'src/types/khuvuc';

// ----------------------------------------------------------------------

type Props = {
  currentDuan?: IDuan;
};


const STORAGE_KEY = 'accessToken';

export default function GiamsatNewEditForm({ currentDuan }: Props) {

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [phanLoai, setPhanloai] = useState([])
  const [chiNhanh, setChinhanh] = useState([])
  const [linhVuc, setLinhvuc] = useState([])
  const [loaiHinh, setLoaihinh] = useState([])
  const [nhom, setNhom] = useState([])

  const [image, setImage] = useState<any>(null);

  const NewProductSchema = Yup.object().shape({
    Duan: Yup.string().required('Phải có tên dự án'),
    ID_Loaihinh: Yup.string().required('Phải loại hình dự án'),
    ID_Nhom: Yup.mixed<any>().nullable().required('Khong'),
    Percent: Yup.number()
      .typeError("Giá trị phải là một số") // Thông báo lỗi nếu không phải số
      .min(0, "Giá trị phải lớn hơn hoặc bằng 0")
      .max(100, "Giá trị phải nhỏ hơn hoặc bằng 100"),
    Diachi: Yup.mixed<any>().nullable(),
    Vido: Yup.mixed<any>().nullable(),
    Kinhdo: Yup.mixed<any>().nullable(),
    P0: Yup.mixed<any>().nullable(),
    HSSE: Yup.mixed<any>().nullable(),
    BeBoi: Yup.mixed<any>().nullable(),
    Xathai: Yup.mixed<any>().nullable(),

    Logo: Yup.mixed<any>().nullable().required('Khong'),
    ID_Phanloai: Yup.string().required('Phải phân loại dự án'),
    ID_Linhvuc: Yup.string().required('Phải có lĩnh vực dự án'),
    ID_Chinhanh: Yup.string().required('Phải có chi nhánh dự án'),
    Ngaybatdau: Yup.mixed<any>().nullable().required('Phải có bắt đầu'),
    Ngayketthuc: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .typeError('Ngày không hợp lệ'),

  });

  const defaultValues = useMemo(
    () => ({
      Duan: currentDuan?.Duan || '',
      ID_Nhom: currentDuan?.ID_Nhom || '',
      ID_Chinhanh: currentDuan?.ID_Chinhanh || '',
      ID_Linhvuc: currentDuan?.ID_Linhvuc || '',
      ID_Loaihinh: currentDuan?.ID_Loaihinh || '',
      ID_Phanloai: currentDuan?.ID_Phanloai || '',
      Percent: currentDuan?.Percent || 0,
      Ngaybatdau: currentDuan?.Ngaybatdau || new Date(),
      Ngayketthuc: currentDuan?.Ngayketthuc || null,
      Diachi: currentDuan?.Diachi || '',
      Vido: currentDuan?.Vido || '',
      Kinhdo: currentDuan?.Kinhdo || '',
      Logo: currentDuan?.Logo || '',
      P0: `${currentDuan?.P0}` === "1" ? "1" : "0",
      HSSE: `${currentDuan?.HSSE}` === "1" ? "1" : "0",
      BeBoi: `${currentDuan?.BeBoi}` === "1" ? "1" : "0",
      Xathai: `${currentDuan?.Xathai}` === "1" ? "1" : "0",

    }),
    [currentDuan]
  );

  useEffect(() => {
    const resPhanloai = async () => {
      await axios.get(`${process.env.REACT_APP_HOST_API}/ent_phanloai/all`).then((res) => {
        setPhanloai(res.data.data)
      })
    }
    const resChinhanh = async () => {
      await axios.get(`${process.env.REACT_APP_HOST_API}/ent_chinhanh/all`).then((res) => {
        setChinhanh(res.data.data)
      })
    }
    const resLinhvuc = async () => {
      await axios.get(`${process.env.REACT_APP_HOST_API}/ent_linhvuc/all`).then((res) => {
        setLinhvuc(res.data.data)
      })
    }
    const resLoaihinh = async () => {
      await axios.get(`${process.env.REACT_APP_HOST_API}/ent_loaihinh/all`).then((res) => {
        setLoaihinh(res.data.data)
      })
    }
    const resNhom = async () => {
      await axios.get(`${process.env.REACT_APP_HOST_API}/ent_nhom/all`).then((res) => {
        setNhom(res.data.data)
      })
    }
    resPhanloai()
    resChinhanh()
    resLoaihinh()
    resNhom()
    resLinhvuc()
  }, []);


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
    if (currentDuan) {
      reset(defaultValues);
    }
  }, [currentDuan, defaultValues, reset]);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setValue('Logo', file);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append('ID_Nhom', data?.ID_Nhom);
    formData.append('ID_Linhvuc', data?.ID_Linhvuc);
    formData.append('ID_Loaihinh', data?.ID_Loaihinh);
    formData.append('ID_Chinhanh', data?.ID_Chinhanh);
    formData.append('ID_Phanloai', data?.ID_Phanloai);
    formData.append('Duan', data?.Duan);
    formData.append('Percent', `${data?.Percent}`);
    formData.append('Ngaybatdau', data?.Ngaybatdau);
    if (data?.Ngayketthuc) {
      formData.append('Ngayketthuc', new Date(data.Ngayketthuc).toISOString());
    }

    formData.append('Diachi', data?.Diachi);
    formData.append('Vido', data?.Vido);
    formData.append('Kinhdo', data?.Kinhdo);
    formData.append('Logo', data?.Logo);
    formData.append('P0', data?.P0);
    formData.append('HSSE', data?.HSSE);
    formData.append('BeBoi', data?.BeBoi);

    try {
      if (currentDuan !== undefined) {
        // Sending a PUT request with FormData
        await axios
          .put(`${process.env.REACT_APP_HOST_API}/ent_duan/update/${currentDuan.ID_Duan}`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data', // Set correct Content-Type
            },
          })
          .then((res) => {
            // reset();
            enqueueSnackbar({
              variant: 'success',
              autoHideDuration: 4000,
              message: 'Cập nhật thành công',
            });
            // router.push(paths.dashboard.duan.root);
          })
          .catch((error) => {
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
      } else {
        // Sending a POST request with FormData
        axios
          .post(`${process.env.REACT_APP_HOST_API}/ent_duan/create`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data', // Set correct Content-Type
            },
          })
          .then((res) => {
            reset();
            enqueueSnackbar({
              variant: 'success',
              autoHideDuration: 4000,
              message: 'Tạo mới thành công!',
            });
          })
          .catch((error) => {
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
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: `Lỗi gửi yêu cầu`,
      });
    }
  });

  const renderPlaceholder = (
    <Box gap={2}>
      <Button
        variant="contained"
        component="label"
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </Button>

      {image && (
        <Box mt={2} textAlign="center">
          <Typography variant="subtitle1">Image Preview:</Typography>
          <Box
            component="img"
            src={image}
            alt="Selected"
            sx={{ width: 200, height: 200, objectFit: 'cover', mt: 1 }}
          />
        </Box>
      )}

    </Box>
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={2}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên dự án, thông tin
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={10}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Stack spacing={1.5}>
                {nhom && nhom?.length > 0 && (
                  <RHFSelect
                    name="ID_Nhom"
                    label="Nhóm dự án"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {nhom?.map((item: any) => (
                      <MenuItem key={item?.ID_Nhom} value={item?.ID_Nhom}>
                        {item?.Tennhom}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack spacing={1.5}>
                {chiNhanh && chiNhanh?.length > 0 && (
                  <RHFSelect
                    name="ID_Chinhanh"
                    label="Chi nhánh"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {chiNhanh?.map((item: any) => (
                      <MenuItem key={item?.ID_Chinhanh} value={item?.ID_Chinhanh}>
                        {item?.Tenchinhanh}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </Box>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <Stack spacing={1.5}>
                {linhVuc && linhVuc?.length > 0 && (
                  <RHFSelect
                    name="ID_Linhvuc"
                    label="Lĩnh vực dự án"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {linhVuc?.map((item: any) => (
                      <MenuItem key={item?.ID_Linhvuc} value={item?.ID_Linhvuc}>
                        {item?.Linhvuc}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack spacing={1.5}>
                {loaiHinh && loaiHinh?.length > 0 && (
                  <RHFSelect
                    name="ID_Loaihinh"
                    label="Loại hình"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {loaiHinh?.map((item: any) => (
                      <MenuItem key={item?.ID_Loaihinh} value={item?.ID_Loaihinh}>
                        {item?.Loaihinh}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack spacing={1.5}>
                {phanLoai && phanLoai?.length > 0 && (
                  <RHFSelect
                    name="ID_Phanloai"
                    label="Phân loại"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {phanLoai?.map((item: any) => (
                      <MenuItem key={item?.ID_Phanloai} value={item?.ID_Phanloai}>
                        {item?.Phanloai}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </Box>
            <RHFTextField name="Duan" label="Tên dự án" />
            <RHFTextField name="Diachi" label="Địa chỉ" />
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <DatePicker
                label="Ngày bắt đầu"
                value={new Date(values.Ngaybatdau)}
                onChange={(newValue: any) => setValue('Ngaybatdau', newValue)}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={values.Ngayketthuc ? new Date(values.Ngayketthuc) : null}
                onChange={(newValue: any) => setValue('Ngayketthuc', newValue)}
              />

            </Box>
            <RHFTextField name="Vido" label="Vĩ độ" />
            <RHFTextField name="Kinhdo" label="Kinh độ" />
            <RHFTextField type='number' name="Percent" label="Tỉ lệ thông báo" />
            <RHFTextField name="Logo" label="Đường dẫn logo dự án" />
            {renderPlaceholder}
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(4, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              <FormControlLabel
                control={
                  <Controller
                    name="P0"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        checked={value === "1"}
                        onChange={(e) => onChange(e.target.checked ? '1' : "0")}
                      />
                    )}
                  />
                }
                label="P0"
              />

              <FormControlLabel
                control={
                  <Controller
                    name="HSSE"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        checked={value === "1"}
                        onChange={(e) => onChange(e.target.checked ? '1' : "0")}
                      />
                    )}
                  />
                }
                label="HSSE"
              />

              <FormControlLabel
                control={
                  <Controller
                    name="BeBoi"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        checked={value === "1"}
                        onChange={(e) => onChange(e.target.checked ? '1' : "0")}
                      />
                    )}
                  />
                }
                label="Bể bơi"
              />
              <FormControlLabel
                control={
                  <Controller
                    name="Xathai"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        checked={value === "1"}
                        onChange={(e) => onChange(e.target.checked ? '1' : "0")}
                      />
                    )}
                  />
                }
                label="Xả thải"
              />
            </Box>
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
          {!currentDuan ? 'Tạo mới' : 'Lưu thay đổi'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderActions}
        </Grid>
      </FormProvider>
      {/* <ContactMap contacts={_mapContact} /> */}

    </>
  );
}
