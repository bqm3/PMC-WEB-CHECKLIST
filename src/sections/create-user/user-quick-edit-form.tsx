import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
//
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// _mock
import { IUser } from 'src/types/room';
import { USER_ROLE_STATUS_OPTIONS } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import axios from 'axios';

// ----------------------------------------------------------------------
interface State {
  date: string;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUser;
};

export default function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.number(),
    zipCode: Yup.string().required('Zip code is required'),
    birthday: Yup.mixed<any>().nullable().required('Birthday is required'),
    // not required
  });

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || '',
      name: currentUser?.fullname || '',
      role: currentUser?.role_id || 2,
      email: currentUser?.email || '',
      address: currentUser?.address || '',
      password: currentUser?.passwordHash || '',
      zipCode: currentUser?.code || '',
      birthday: currentUser?.birthday || null,
      phoneNumber: currentUser?.phonenumber || '',
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
      const response = await axios.put(
        `https://be-nodejs-project.vercel.app/api/employee/update-quick/${defaultValues.id}`,
        data
      );
      if (response.status === 200) {
        enqueueSnackbar('Update success!');
        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  });

  // const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue({ ...values, [prop]: event.target.value });
  // };

  const inputDate = values?.birthday ? new Date(values?.birthday) : null;
  const formattedDate = inputDate ? inputDate.toString() : 'N/A';

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

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

            {/* <Stack spacing={1.5}>
              <Controller
                name="birthday"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DateField
                    {...field}
                    // format="dd/MM/yyyy"
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
            </Stack> */}
            <DatePicker
              label="Date Picker"
              value={new Date(values.birthday)}
              onChange={(newValue) => setValue('birthday', newValue)}
            />


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
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
