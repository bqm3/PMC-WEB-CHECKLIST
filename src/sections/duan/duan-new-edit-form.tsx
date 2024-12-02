import * as Yup from 'yup';
import axios from 'axios';
import { useMemo, useEffect, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
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
import { Button, CircularProgress } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS, _mapContact } from 'src/_mock';
// api
import { useGetKhuVuc, useGetToanha, useGetKhoiCV, useGetChucvu } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
// types
import { IDuan } from 'src/types/khuvuc';

import ContactMap from './contact-map';

// ----------------------------------------------------------------------

type Props = {
  currentDuan?: IDuan;
};


const STORAGE_KEY = 'accessToken';

export default function GiamsatNewEditForm({ currentDuan }: Props) {
  const router = useRouter();

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
    Diachi: Yup.mixed<any>().nullable().required('Khong'),
    Vido: Yup.mixed<any>().nullable().required('Khong'),
    Kinhdo: Yup.mixed<any>().nullable().required('Khong'),
    Logo: Yup.mixed<any>().nullable().required('Khong'),
    ID_Phanloai: Yup.string().required('Phải phân loại dự án'),
    ID_Linhvuc: Yup.string().required('Phải có lĩnh vực dự án'),
    ID_Chinhanh: Yup.string().required('Phải có chi nhánh dự án'),
    Ngaybatdau: Yup.mixed<any>().nullable().required('Phải có bắt đầu'),
  });

  const defaultValues = useMemo(
    () => ({
      Duan: currentDuan?.Duan || '',
      ID_Nhom: currentDuan?.ID_Nhom || '',
      ID_Chinhanh: currentDuan?.ID_Chinhanh || '',
      ID_Linhvuc: currentDuan?.ID_Linhvuc || '',
      ID_Loaihinh: currentDuan?.ID_Loaihinh || '',
      ID_Phanloai: currentDuan?.ID_Phanloai || '',
      Ngaybatdau: currentDuan?.Ngaybatdau || new Date(),
      Diachi: currentDuan?.Diachi || '',
      Vido: currentDuan?.Vido || '',
      Kinhdo: currentDuan?.Kinhdo || '',
      Logo: currentDuan?.Logo || '',
    }),
    [currentDuan]
  );

  useEffect(() => {
    const resPhanloai = async () => {
      await axios.get('http://localhost:6868/api/v2/ent_phanloai/all').then((res) => {
        setPhanloai(res.data.data)
      })
    }
    const resChinhanh = async () => {
      await axios.get('http://localhost:6868/api/v2/ent_chinhanh/all').then((res) => {
        setChinhanh(res.data.data)
      })
    }
    const resLinhvuc = async () => {
      await axios.get('http://localhost:6868/api/v2/ent_linhvuc/all').then((res) => {
        setLinhvuc(res.data.data)
      })
    }
    const resLoaihinh = async () => {
      await axios.get('http://localhost:6868/api/v2/ent_loaihinh/all').then((res) => {
        setLoaihinh(res.data.data)
      })
    }
    const resNhom = async () => {
      await axios.get('http://localhost:6868/api/v2/ent_nhom/all').then((res) => {
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
    formData.append('Ngaybatdau', data?.Ngaybatdau);
    formData.append('Diachi', data?.Diachi);
    formData.append('Vido', data?.Vido);
    formData.append('Kinhdo', data?.Kinhdo);
    formData.append('Logo', data?.Logo);

    try {
      if (currentDuan !== undefined) {
        // Sending a PUT request with FormData
        await axios
          .put(`http://localhost:6868/api/v2/ent_duan/update/${currentDuan.ID_Duan}`, formData, {
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
          .post(`http://localhost:6868/api/v2/ent_duan/create`, formData, {
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
            Tên dự án
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
            <DatePicker
              label="Ngày bắt đầu"
              value={new Date(values.Ngaybatdau)}
              onChange={(newValue: any) => setValue('Ngaybatdau', newValue)}
            />
            <RHFTextField name="Vido" label="Vĩ độ" />
            <RHFTextField name="Kinhdo" label="Kinh độ" />
            <RHFTextField name="Logo" label="Đường dẫn logo dự án" />
            {renderPlaceholder}


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
