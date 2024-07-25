import * as Yup from 'yup';
import { useCallback, useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _tags } from 'src/_mock';
// types
import { IFacilities } from 'src/types/room';
import { IPostItem } from 'src/types/blog';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axios from 'axios';

//
// import PostDetailsPreview from './post-details-preview';

// ----------------------------------------------------------------------

type Props = {
  currentFacilities?: IFacilities;
};

export default function PacilityNewEditForm({ currentFacilities }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  console.log('currentFacilities', currentFacilities)

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    name: Yup.string().required('Title is required'),
    phone: Yup.string().required('Title is required'),
    location: Yup.string().required('Title is required'),
    logo: Yup.mixed<any>().nullable().required('Cover is required'),
    image: Yup.mixed<any>().nullable().required('Cover is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentFacilities?.title || '',
      name: currentFacilities?.name || '',
      phone: currentFacilities?.phone || '',
      location: currentFacilities?.location || '',
      image: currentFacilities?.image || null,
      logo: currentFacilities?.logo || null
    }),
    [currentFacilities]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentFacilities) {
      reset(defaultValues);
    }
  }, [currentFacilities, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('image', JSON.stringify(data.image));
    formData.append('title', data.title);
    formData.append('logo', data.logo);
    formData.append('phone', data.phone);
    formData.append('location', data.location);
    const config = {
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const response = await axios.put('https://be-nodejs-project.vercel.app/api/facilities/update', formData, config);
      if (response.status === 200) {
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 2000,
          message: 'Cập nhật thông tin khách sạn thành công!',
        })
      }
      else {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 2000,
          message: 'Cập nhật thông tin khách sạn thất bại!',
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
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('image', null);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="phone" label="Phone Number" />

            <RHFTextField name="location" label="Location" multiline rows={3} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Title</Typography>
              <RHFEditor simple name="title" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Image</Typography>
              <RHFUpload
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );



  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />



        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ float: 'right', flexGrow: 0 }}
        >
          {!currentFacilities ? 'Create Post' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties} */}

        {renderActions}
      </Grid>

      {/* <PostDetailsPreview
        title={values.title}
        content={values.content}
        description={values.description}
        coverUrl={
          typeof values.coverUrl === 'string'
            ? values.coverUrl
            : `${(values.coverUrl as CustomFile)?.preview}`
        }
        //
        open={preview.value}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={preview.onFalse}
        onSubmit={onSubmit}
      /> */}
    </FormProvider>
  );
}
