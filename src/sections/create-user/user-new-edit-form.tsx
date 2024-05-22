import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// _mock
import { USER_ROLE_STATUS_OPTIONS, USER_GENDER_OPTIONS } from 'src/_mock';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { useRouter } from 'src/routes/hooks';
// types
import { IChucvu, IDuan, IKhoiCV, IUser } from 'src/types/khuvuc';
// routes
import { paths } from 'src/routes/paths';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
  RHFRadioGroup,
} from 'src/components/hook-form';
import axios from 'axios';
import { useGetChucvu, useGetDuan, useGetKhoiCV } from 'src/api/khuvuc';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUser;
};

const STORAGE_KEY = 'accessToken';

export default function UserNewEditForm({ currentUser }: Props) {

  console.log('currentUser',currentUser)
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [KhoiCV, setKhoiCV] = useState<IKhoiCV[]>([]);
  const [Duan, setDuan] = useState<IDuan[]>([]);
  const [Chucvu, setChucvu] = useState<IChucvu[]>([]);

  const { khoiCV } = useGetKhoiCV();
  const { chucVu, chucVuLoading, chucVuEmpty } = useGetChucvu();
  const { duan, duanLoading, duanEmpty } = useGetDuan();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCV(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (duan?.length > 0) {
      setDuan(duan);
    }
  }, [duan]);

  useEffect(() => {
    if (chucVu?.length > 0) {
      setChucvu(chucVu);
    }
  }, [chucVu]);

  const NewUserSchema = Yup.object().shape({
    UserName: Yup.string().required('Tài khoản là bắt buộc'),
    Emails: Yup.string().required('Email là bắt buộc').email('Chưa đúng định dạng Email'),

    Password: Yup.string().required('Mật khẩu là bắt buộc'),
    // not required
    Permission: Yup.string(),
    ID_Duan: Yup.string(),
    ID_KhoiCV: Yup.string()
  });

  const defaultValues = useMemo(
    () => ({
      UserName: currentUser?.UserName || '',
      Emails: currentUser?.Emails || '',
      Password: currentUser?.Password || '',
      Permission: currentUser?.Permission || null || '',
      ID_Duan: currentUser?.ID_Duan || null || '',
      ID_KhoiCV: currentUser?.ID_KhoiCV || null || '' ,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if(currentUser !== undefined){
        await axios
        .put(`https://checklist.pmcweb.vn/be/api/ent_user/update/${currentUser?.ID_User}`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          reset();
          enqueueSnackbar('Cập nhật tài khoản!');
          router.push(paths.dashboard.createEmployee.list);
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
      }else {
        await axios
        .post(`https://checklist.pmcweb.vn/be/api/ent_user/register`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          reset();
          enqueueSnackbar('Tạo tài khoản thành công!');
          router.push(paths.dashboard.createEmployee.list);
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 3000,
        message: `Lỗi gửi yêu cầu`,
      });
      // }
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect
                fullWidth
                name="ID_KhoiCV"
                label="Khối công việc"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {KhoiCV.map((option) => (
                  <MenuItem key={option.ID_Khoi} value={option.ID_Khoi}>
                    {option.KhoiCV}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="ID_Duan"
                label="Dự án"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {Duan.map((option) => (
                  <MenuItem key={option.ID_Duan} value={option.ID_Duan}>
                    {option.Duan}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                fullWidth
                name="Permission"
                label="Chức vụ"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {Chucvu.map((option) => (
                  <MenuItem key={option.ID_Chucvu} value={option.ID_Chucvu}>
                    {option.Chucvu}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="UserName" label="Tài khoản" />
              <RHFTextField name="Emails" label="Email" />
              
              {
                !currentUser?.Password &&  <RHFTextField name="Password" label="Mật khẩu" /> 
              }
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentUser ? 'Tạo mới' : 'Lưu thay đổi'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
