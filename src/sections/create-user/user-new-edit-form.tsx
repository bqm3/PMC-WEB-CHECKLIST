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
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAuthContext } from 'src/auth/hooks';
// routes
import { useRouter } from 'src/routes/hooks';
// types
import { IChucvu, IDuan, IKhoiCV, IUser } from 'src/types/khuvuc';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FormProvider, { RHFTextField, RHFSelect, RHFRadioGroup } from 'src/components/hook-form';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import { useGetChucvu, useGetDuan, useGetKhoiCV, useGetNhomDuAn, useGetUserHistory } from 'src/api/khuvuc';
import TransferProjectDialog from './info-transfer-user';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUser;
};

const STORAGE_KEY = 'accessToken';

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);
  const { user, logout } = useAuthContext();

  const [KhoiCV, setKhoiCV] = useState<IKhoiCV[]>([]);
  const [Duan, setDuan] = useState<IDuan[]>([]);
  const [Chucvu, setChucvu] = useState<IChucvu[]>([]);

  const { khoiCV } = useGetKhoiCV();
  const { chucVu } = useGetChucvu();
  const { duan } = useGetDuan();
  const { userHistory } = useGetUserHistory(currentUser?.ID_User);

  const { nhomduan } = useGetNhomDuAn();
  const [oldUserName, setOldUserName] = useState("");

  useEffect(() => {
    if (currentUser) {
      setOldUserName(currentUser.UserName);
    }
  }, [currentUser]);

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
    Email: Yup.string().email('Chưa đúng định dạng Email').nullable(),
    Hoten: Yup.string().required('Phải có họ tên'),
    Ngaysinh: Yup.mixed<any>().nullable().required('Phải có ngày sinh'),
    isCheckketoan: Yup.string(),
    // not required
  });

  const defaultValues = useMemo(
    () => ({
      UserName: currentUser?.UserName || '',
      Email: currentUser?.Email || '',
      Password: currentUser?.Password || '',
      ID_Chucvu: currentUser?.ID_Chucvu || null || '',
      Hoten: currentUser?.Hoten || '',
      Sodienthoai: currentUser?.Sodienthoai || '',
      Gioitinh: currentUser?.Gioitinh || '',
      Ngaysinh: currentUser?.Ngaysinh || new Date() || null || undefined,
      ID_Duan: currentUser?.ID_Duan || null || '',
      ID_KhoiCV: currentUser?.ID_KhoiCV || null || '',
      isCheckketoan: currentUser?.isCheckketoan || '0',
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
    const selectedIds = checkedStates.flatMap((group: any) =>
      group.projects
        .filter((project: any) => project.checked)
        .map((project: any) => project.ID_Duan)
    );

    const newData = {
      ...data,
      arr_Duan: selectedIds,
      oldUserName,
    };
    try {
      if (currentUser !== undefined) {
        await axios
          .put(`${process.env.REACT_APP_HOST_API}/api/v2/ent_user/update/${currentUser?.ID_User}`, newData, {
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
                autoHideDuration: 4000,
                message: `${error.response.data.message}`,
              });
            } else if (error.request) {
              // Lỗi không nhận được phản hồi từ server
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 4000,
                message: `Không nhận được phản hồi từ máy chủ`,
              });
            } else {
              // Lỗi khi cấu hình request
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 4000,
                message: `Lỗi gửi yêu cầu`,
              });
            }
          });
      } else {
        await axios
          .post(`${process.env.REACT_APP_HOST_API}/api/v2/ent_user/register`, newData, {
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
                autoHideDuration: 4000,
                message: `${error.response.data.message}`,
              });
            } else if (error.request) {
              // Lỗi không nhận được phản hồi từ server
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 4000,
                message: `Không nhận được phản hồi từ máy chủ`,
              });
            } else {
              // Lỗi khi cấu hình request
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
      // }
    }
  });

  const [areasData, setAreasData] = useState<any>([]);
  const [checkedStates, setCheckedStates] = useState<any>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  useEffect(() => {
    if (nhomduan) {
      const arrDuan = currentUser?.arr_Duan?.split(',').map(Number); // Chuyển chuỗi arr_Duan thành mảng số

      // Cập nhật areasData
      setAreasData(nhomduan);

      // Khởi tạo trạng thái ban đầu cho các dự án với checked = false hoặc true nếu ID_Duan có trong arr_Duan
      const initialCheckedStates = nhomduan.map((area: any) => ({
        Tenchinhanh: area?.Tenchinhanh,
        projects: area.projects.map((project: any) => ({
          ID_Duan: project.ID_Duan,
          checked: arrDuan?.includes(project.ID_Duan), // Kiểm tra xem ID_Duan có trong arr_Duan không
        })),
      }));

      // Cập nhật lại trạng thái checkedStates
      setCheckedStates(initialCheckedStates);
    }
  }, [nhomduan, currentUser]); // Dependency array gồm nhomduan và currentUser

  // Handle change for parent checkboxes
  const handleParentChange = (buildingIndex: number) => (event: any) => {
    const isChecked = event.target.checked;

    const updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, index: number) =>
      index === buildingIndex
        ? {
          ...buildingCheckedStates,
          projects: buildingCheckedStates.projects.map((project: any) => ({
            ...project,
            checked: isChecked,
          })),
        }
        : buildingCheckedStates
    );

    setCheckedStates(updatedCheckedStates);

    // Update select all checked state
    setIsSelectAllChecked(
      updatedCheckedStates.every((building: any) =>
        building.projects.every((project: any) => project.checked)
      )
    );
  };

  // Handle change for individual child checkboxes
  const handleChildChange = (buildingIndex: number, projectIndex: number) => (event: any) => {
    const isChecked = event.target.checked;

    const updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, bIndex: number) =>
      bIndex === buildingIndex
        ? {
          ...buildingCheckedStates,
          projects: buildingCheckedStates.projects.map((project: any, pIndex: number) =>
            pIndex === projectIndex ? { ...project, checked: isChecked } : project
          ),
        }
        : buildingCheckedStates
    );

    setCheckedStates(updatedCheckedStates);

    // Update select all checked state
    const isAllSelected = updatedCheckedStates.every((building: any) =>
      building.projects.every((project: any) => project.checked)
    );

    setIsSelectAllChecked(isAllSelected);
  };

  // Handle select all checkbox
  const handleSelectAllChange = (event: any) => {
    const isChecked = event.target.checked;
    setIsSelectAllChecked(isChecked);

    const updatedCheckedStates = checkedStates.map((buildingCheckedStates: any) => ({
      ...buildingCheckedStates,
      projects: buildingCheckedStates.projects.map((project: any) => ({
        ...project,
        checked: isChecked,
      })),
    }));

    setCheckedStates(updatedCheckedStates);
  };

  const renderChildren = (
    <Box>
      <FormControlLabel
        title="Chọn tất cả"
        label="Chọn tất cả"
        control={
          <Checkbox
            size="medium"
            checked={isSelectAllChecked}
            onChange={handleSelectAllChange}
            indeterminate={
              checkedStates?.flat()?.some((item: any) => item?.checked) &&
              !checkedStates?.flat()?.every((item: any) => item?.checked)
            }
          />
        }
        sx={{
          '.MuiFormControlLabel-label': {
            fontWeight: 'bold',
            fontSize: '17px',
          },
          mt: 2,
          pt: 2,
        }}
      />

      <Card>
        <Stack spacing={2} flexWrap="wrap" p={2}>
          {areasData?.map((group: any, groupIndex: any) => {
            const areaCheckedStates = checkedStates[groupIndex]?.projects || [];

            const isIndeterminate =
              areaCheckedStates.some((item: any) => item.checked) &&
              !areaCheckedStates.every((item: any) => item.checked);
            const isParentChecked = areaCheckedStates.every((item: any) => item.checked);

            return (
              <Stack
                key={group?.Tenchinhanh}
                spacing={2}
                padding={2}
                border="1px solid #ccc"
                borderRadius={1}
              >
                {/* Parent Checkbox */}
                <FormControlLabel
                  title={group?.Tenchinhanh}
                  label={group?.Tenchinhanh}
                  control={
                    <Checkbox
                      size="medium"
                      checked={isParentChecked}
                      indeterminate={isIndeterminate}
                      onChange={handleParentChange(groupIndex)}
                    />
                  }
                  sx={{
                    '.MuiFormControlLabel-label': {
                      fontWeight: 'bold',
                      fontSize: '17px',
                    },
                  }}
                />

                {/* Child Checkboxes */}
                <div>
                  {group?.projects?.map((project: any, projectIndex: any) => (
                    <FormControlLabel
                      key={project.ID_Duan}
                      label={project.Duan}
                      control={
                        <Checkbox
                          size="medium"
                          checked={areaCheckedStates[projectIndex]?.checked || false}
                          onChange={handleChildChange(groupIndex, projectIndex)}
                        />
                      }
                    />
                  ))}
                </div>
              </Stack>
            );
          })}
        </Stack>
      </Card>
    </Box>
  );

  const renderPrimary = (
    <Grid xs={12} md={12}>
      <Card sx={{ p: 3 }}>
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
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {KhoiCV?.map((option) => (
                <MenuItem key={option.ID_KhoiCV} value={option.ID_KhoiCV}>
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
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
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
              name="ID_Chucvu"
              label="Chức vụ"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {Chucvu?.map((option) => (
                <MenuItem key={option.ID_Chucvu} value={option.ID_Chucvu}>
                  {option.Chucvu}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
        </Box>

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
          <RHFTextField name="Email" label="Email" />
          <RHFTextField name="Hoten" label="Họ tên" />
          <RHFTextField name="Sodienthoai" label="Số điện thoại" />
          <Stack spacing={1}>
            <Typography variant="subtitle2">Giới tính</Typography>
            <RHFRadioGroup row name="Gioitinh" spacing={2} options={USER_GENDER_OPTIONS} />
          </Stack>
          <DatePicker
            label="Ngày sinh"
            value={new Date(values.Ngaysinh)}
            onChange={(newValue: any) => setValue('Ngaysinh', newValue)}
          />

          {/* {currentUser === undefined && <RHFTextField name="Password" label="Mật khẩu" />} */}
          {`${user?.ent_chucvu?.Role}` === '10' && (
            <RHFTextField name="Password" label="Mật khẩu" />
          )}
          {`${user?.ent_chucvu?.Role}` === '1' && <RHFTextField name="Password" label="Mật khẩu" />}

          {(`${currentUser?.ent_chucvu?.Role}` === '2' ||
            `${currentUser?.ent_chucvu?.Role}` === '3') && (
              <RHFTextField name="Password" label="Mật khẩu" />
            )}
          <Controller
            name="isCheckketoan"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={`${field.value}` === `1`}
                    onChange={(e) => field.onChange(e.target.checked ? '1' : '0')}
                  />
                }
                label="Kế toán"
              />
            )}
          />
        </Box>

        {userHistory?.length > 0 &&
          <TransferProjectDialog userHistory={userHistory} />}

        {user?.ent_chucvu?.Role === 10 && renderChildren}

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
