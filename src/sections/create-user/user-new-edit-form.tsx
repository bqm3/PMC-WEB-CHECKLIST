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
  RHFSelect, RHFRadioGroup
} from 'src/components/hook-form';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem_2;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
    zipCode: Yup.string().required('Zip code is required'),
    avatarUrl: Yup.mixed<any>().nullable().required('Avatar is required'),
    birthday: Yup.mixed<any>().nullable().required('Expired date is required'),
    // not required
    status: Yup.string(),
    gender: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      role: currentUser?.role || '',
      email: currentUser?.email || '',
      status: currentUser?.status || 'active',
      address: currentUser?.address || '',
      password: currentUser?.password || '',
      zipCode: currentUser?.zipCode || '',
      avatarUrl: currentUser?.avatarUrl || null,
      birthday: currentUser?.birthday || null,
      phoneNumber: currentUser?.phoneNumber || '',
      gender: currentUser?.gender || '',
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
    const formData = new FormData();
    formData.append('fullname', data.name);
    formData.append('image', JSON.stringify(data.avatarUrl));
    formData.append('birthday', data.birthday);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phonenumber', data.phoneNumber);
    formData.append('gender', JSON.stringify(data.gender));
    formData.append('code', data.zipCode);
    formData.append('role_id', data.role);
    formData.append('status', JSON.stringify(data.status));
    formData.append('address', data.address);
    const config = {
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const response = await axios.post('https://be-nodejs-project.vercel.app/api/employee/register', formData, config);
      if (response.status === 200) {
        enqueueSnackbar('Create success!');
        reset();
      }
      else {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 3000,
          message: 'Tạo phòng thất bại',
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
        setValue('avatarUrl', newFile, { shouldValidate: true });
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
                (values.status === 'active' && 'success') ||
                (values.status === 'banned' && 'error') ||
                'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {values.status}
            </Label>


            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
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

            <FormControlLabel
              labelPlacement="start"
              control={
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value !== 'active'}
                      onChange={(event) =>
                        field.onChange(event.target.checked ? 'banned' : 'active')
                      }
                    />
                  )}
                />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Banned
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Apply disable account
                  </Typography>
                </>
              }
              sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
            />

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
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="password" label="Password" />

              <Stack spacing={1.5}>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Ngày sinh"
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Stack>

              <RHFTextField name="address" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFSelect
                fullWidth
                name="role"
                label="Chức vụ"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {USER_ROLE_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Gender</Typography>
                <RHFRadioGroup row name="gender" spacing={2} options={USER_GENDER_OPTIONS} />
              </Stack>
            </Box>



            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create New Employee' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
