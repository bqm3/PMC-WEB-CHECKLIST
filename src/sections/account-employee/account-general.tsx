import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
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
// auth
import { useAuthContext } from 'src/auth/hooks';
// _mock
import { USER_ROLE_STATUS_OPTIONS, USER_GENDER_OPTIONS } from 'src/_mock';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { useRouter } from 'src/routes/hooks';
// types
import { IUserItem_2 } from 'src/types/user';
// components
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
  RHFMultiCheckbox,
  RHFRadioGroup
} from 'src/components/hook-form';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const router = useRouter();

  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    fullname: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phonenumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    role_id: Yup.string().required('Role is required'),
    code: Yup.string().required('Zip code is required'),
    avatar: Yup.mixed<any>().nullable().required('Avatar is required'),
    birthday: Yup.mixed<any>().nullable().required('Expired date is required'),
    // not required
    status: Yup.string(),
    experience: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: user?.id || '',
      fullname: user?.fullname || '',
      email: user?.email || '',
      phonenumber: user?.phonenumber || '',
      address: user?.address || '',
      role_id: user?.role_id || '',
      gender: user?.gender || '',
      code: user?.code || '',
      avatar: user?.avatar || null,
      birthday: user?.birthday || null,
      status: user?.status || '',
    }),
    [user]
  );

  const methods = useForm({
    // resolver: yupResolver(NewUserSchema),
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
    const formData = new FormData();
    formData.append('fullname', data.fullname);

    formData.append('birthday', data.birthday);
    formData.append('email', data.email);
    formData.append('phonenumber', data.phonenumber);
    formData.append('code', data.code);
    formData.append('gender', data.gender);
    formData.append('role_id', data.role_id);
    formData.append('status', data.status);
    formData.append('address', data.address);
    formData.append('avatar', typeof data.avatar === 'string' ? data.avatar : JSON.stringify(data.avatar));
    const config = {
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const response = await axios.put(
        `https://be-nodejs-project.vercel.app/api/employee/update/${defaultValues.id}`,
        formData,
        config
      );
      if (response.status === 200) {
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 2000,
          message: 'Update success',
        });
        // reset();
      } else {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 2000,
          message: 'Update error',
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Label
              color={
                (values.status === '1' && 'success') ||
                (values.status === '0' && 'error') ||
                'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {values.status === '1' ? 'active' : 'banned'}
            </Label>

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatar"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
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
              <RHFTextField name="fullname" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phonenumber" label="Phone Number" />

              <DatePicker
                label="Date Picker"
                value={new Date(values.birthday)}
                onChange={(newValue) => setValue('birthday', newValue)}
              />

              <RHFTextField name="address" label="Address" />
              <RHFTextField name="code" label="Zip/Code" />

              <Stack spacing={1}>
                <Typography variant="subtitle2">Gender</Typography>
                <RHFRadioGroup row name="gender" spacing={2} options={USER_GENDER_OPTIONS} />
              </Stack>
              {/* <RHFSelect
                fullWidth
                name="role_id"
                label="Chức vụ"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {USER_ROLE_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
