import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
import {
  useGetChinhanh,
  useGetChucVu,
  useGetChucvu,
  useGetDuan,
  useGetKhoiCV,
  useGetNhompb,
} from 'src/api/khuvuc';
import { IChinhanh, IChucVu, INhompb } from 'src/types/scan';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUser;
};

const STORAGE_KEY = 'accessToken';

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [toggleChecklist, setToggleChecklist] = useState(true);
  const [toggleQlts, setToggleQlts] = useState(false);

  const [KhoiCV, setKhoiCV] = useState<IKhoiCV[]>([]);
  const [Duan, setDuan] = useState<IDuan[]>([]);
  const [Chucvu, setChucvu] = useState<IChucvu[]>([]);
  const [NhomPB, setNhomPB] = useState<INhompb[]>([]);
  const [ChucVu, setChucVu] = useState<IChucVu[]>([]);
  const [ChiNhanh, setChiNhanh] = useState<IChinhanh[]>([]);

  const { khoiCV } = useGetKhoiCV();
  const { chucVu, chucVuLoading, chucVuEmpty } = useGetChucvu();
  const { duan, duanLoading, duanEmpty } = useGetDuan();

  const { nhompb } = useGetNhompb();
  const { chucvu } = useGetChucVu();
  const { chinhanh } = useGetChinhanh();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCV(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (`${currentUser?.Permission}` === '3') {
      setToggleQlts(true);
    }
  }, [currentUser]);

  useEffect(() => {
    if (nhompb?.length > 0) {
      setNhomPB(nhompb);
    }
    if (chucvu?.length > 0) {
      setChucVu(chucvu);
    }
    if (chinhanh?.length > 0) {
      setChiNhanh(chinhanh);
    }
  }, [nhompb, chucvu, chinhanh]);

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
  });

  const defaultValues = useMemo(
    () => ({
      UserName: currentUser?.UserName || '',
      Emails: currentUser?.Emails || '',
      Password: currentUser?.Password || '',
      Permission: currentUser?.Permission || null || '',
      ID_Duan: currentUser?.ID_Duan || null || '',
      ID_KhoiCV: currentUser?.ID_KhoiCV || null || '',
      ID_Nhompb: currentUser?.ID_Nhompb || null || '',
      ID_Chucvu: currentUser?.ID_Chucvu || null || '',
      ID_Chinhanh: currentUser?.ID_Chinhanh || null || '',
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

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser !== undefined) {
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
            router.push(paths.dashboard.createUser.list);
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
        if (toggleQlts === true) {
          await axios
            .post(`https://checklist.pmcweb.vn/pmc-assets/api/ent_user/register`, data, {
              headers: {
                Accept: 'application/json',
              },
            })
            .then((res) => {
              reset();
              enqueueSnackbar('Tạo tài khoản thành công!');
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
        }
        if (toggleChecklist === true) {
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
        }
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
        message: `Lỗi gửi yêu cầu`,
      });
      // }
    }
  });

  const renderPrimary = (
    <Grid xs={12} md={12}>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={0.5} marginBottom={2}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={toggleChecklist}
                  value={toggleChecklist}
                  onChange={() => setToggleChecklist(!toggleChecklist)}
                />
              }
              label="Checklist"
            />
          </FormGroup>
        </Stack>

        {/* Checklist  */}
        {toggleChecklist === true && (
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
            marginTop={3}
          >
            {KhoiCV?.length > 0 && (
              <RHFSelect
                fullWidth
                name="ID_KhoiCV"
                label="Khối công việc"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                disabled={!toggleChecklist}
              >
                {KhoiCV?.map((option) => (
                  <MenuItem key={option.ID_Khoi} value={option.ID_Khoi}>
                    {option.KhoiCV}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
            {Duan?.length > 0 && (
              <RHFSelect
                fullWidth
                name="ID_Duan"
                label="Dự án"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                disabled={!toggleChecklist}
              >
                {Duan?.map((option) => (
                  <MenuItem key={option.ID_Duan} value={option.ID_Duan}>
                    {option.Duan}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}

            {Chucvu?.length > 0 && (
              <RHFSelect
                fullWidth
                name="Permission"
                label="Chức vụ"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                disabled={!toggleChecklist}
              >
                {Chucvu?.map((option) => (
                  <MenuItem key={option.ID_Chucvu} value={option.ID_Chucvu}>
                    {option.Chucvu}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          </Box>
        )}

        {`${currentUser?.Permission}` === '3' && (
          <>
            <Stack direction="row" alignItems="center" spacing={0.5} marginTop={2}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={toggleQlts}
                      value={toggleQlts}
                      onChange={() => setToggleQlts(!toggleQlts)}
                    />
                  }
                  label="Quản lý tài sản"
                />
              </FormGroup>
            </Stack>

            {/* Quan ly tai san  */}
            {toggleQlts === true && (
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
                marginTop={3}
              >
                {NhomPB?.length > 0 && (
                  <RHFSelect
                    fullWidth
                    name="ID_Nhompb"
                    label="Nhóm phòng ban"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    disabled={!toggleQlts}
                  >
                    {NhomPB?.map((option) => (
                      <MenuItem key={option.ID_Nhompb} value={option.ID_Nhompb}>
                        {option.Nhompb}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}

                {ChiNhanh?.length > 0 && (
                  <RHFSelect
                    fullWidth
                    name="ID_Chinhanh"
                    label="Chi nhánh"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    disabled={!toggleQlts}
                  >
                    {ChiNhanh?.map((option) => (
                      <MenuItem key={option.ID_Chinhanh} value={option.ID_Chinhanh}>
                        {option.Tenchinhanh}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}

                {ChucVu?.length > 0 && (
                  <RHFSelect
                    fullWidth
                    name="ID_Chucvu"
                    label="Chức vụ"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    disabled={!toggleQlts}
                  >
                    {ChucVu?.map((option) => (
                      <MenuItem key={option.ID_Chucvu} value={option.ID_Chucvu}>
                        {option.Chucvu}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Box>
            )}
          </>
        )}

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
          marginTop={3}
        >
          <RHFTextField name="UserName" label="Tài khoản" />
          <RHFTextField name="Emails" label="Email" />

          {!currentUser && <RHFTextField name="Password" label="Mật khẩu" />}
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!currentUser ? 'Tạo mới' : 'Lưu thay đổi'}
          </LoadingButton>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderPrimary}
      </Grid>
    </FormProvider>
  );
}
