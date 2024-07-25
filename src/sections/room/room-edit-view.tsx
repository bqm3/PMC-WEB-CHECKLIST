import * as Yup from 'yup';

import FormProvider, {
  RHFAutocomplete,
  RHFEditor,
  RHFMultiCheckbox,
  RHFMultiSelect,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
import { IRoom, IRoomImage, IRoomService, ITypeRoom } from 'src/types/room';
// _mock
import { ROOM_LABEL_OPTIONS, _tags } from 'src/_mock';
import { useCallback, useEffect, useMemo, useState } from 'react';
// api
import { useGetServices, useGetTypeRooms } from 'src/api/product';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
// types
import InputAdornment from '@mui/material/InputAdornment';
// @mui
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
// routes
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

type PropRoom = {
  currentRoom?: IRoom;
};


export default function RoomNewEditForm({ currentRoom }: PropRoom) {

  const router = useRouter();
  const [tableDataServices, setTableDataServices] = useState<any>([]);
  const [tableDataTypeRoom, setTableDataTypeRoom] = useState<ITypeRoom[]>([]);

  const { typerooms, typeroomsLoading, typeroomsEmpty } = useGetTypeRooms();
  const { services, servicesLoading } = useGetServices();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (typerooms && Array.isArray(typerooms)) {
      setTableDataTypeRoom(typerooms);
    } else {
      // Handle the case where typerooms is undefined or not an array
      console.error("typerooms is undefined or not an array");
    }
  }, [typerooms]);

  useEffect(() => {
    if (services && Array.isArray(services)) {
      const options = services?.map((option) => ({
        value: option.id,
        label: option.name,
      }));
      setTableDataServices(options);
    } else {
      // Handle the case where typerooms is undefined or not an array
      console.error("services is undefined or not an array");
    }
  }, [services]);



  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    image: Yup.mixed<any>().nullable().required('Image is required'),
    status: Yup.number().required('Status is required'),
    type_room_id: Yup.number(),
    numberChildren: Yup.number(),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    priceSale: Yup.number(),
    label: Yup.number(),
    isLiked: Yup.number(),
    numberBed: Yup.number(),
    numberPeople: Yup.number(),
    roomImages: Yup.mixed<any>().nullable().required('Image Room is required'),
    service: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentRoom?.name || '',
      title: currentRoom?.title || '',
      description: currentRoom?.description || '',
      price: currentRoom?.price || 0,
      priceSale: currentRoom?.priceSale || 0,
      image: currentRoom?.image || null,
      numberBed: currentRoom?.numberBed || 0,
      numberPeople: currentRoom?.numberPeople || 0,
      status: currentRoom?.status || 0,
      label: currentRoom?.label || 0,
      isLiked: currentRoom?.isLiked || 0,
      numberChildren: currentRoom?.numberChildren || 0,
      type_room_id: currentRoom?.type_room_id || undefined,
      service: currentRoom?.service || [],
      roomImages: currentRoom?.roomImages || [],
    }),
    [currentRoom]
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
    if (currentRoom) {
      reset(defaultValues);
    }
  }, [currentRoom, defaultValues, reset]);


  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('name', data.name);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', JSON.stringify(data.price));
    formData.append('priceSale', JSON.stringify(data.priceSale));
    formData.append('numberBed', JSON.stringify(data.numberBed));
    formData.append('numberPeople', JSON.stringify(data.numberPeople));
    formData.append('numberChildren', JSON.stringify(data.numberChildren));
    formData.append('status', JSON.stringify(data.status));
    formData.append('label', JSON.stringify(data.label));
    formData.append('isLiked', JSON.stringify(data.isLiked));
    formData.append('type_room_id', JSON.stringify(data.type_room_id));
    formData.append('roomImages', JSON.stringify(data.roomImages));
    const config = {
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    };


    try {
      if (currentRoom) {
        const res1 = await axios.put(`https://be-nodejs-project.vercel.app/api/rooms/update/${currentRoom.id}`, formData, config);
        const res2 = await axios.put(`https://be-nodejs-project.vercel.app/api/room-image/update/${currentRoom.id}`, formData, config);
        // const res3 = await axios.post(`https://be-nodejs-project.vercel.app/api/room_service/update/${currentRoom?.id}`, data.service);
        if (res1.status === 200 && res2.status === 200) {
          enqueueSnackbar('Update Success!!!');
          reset();

        } else {
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 2000,
            message: 'Update Faild!!!',
          });
        }
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

  const handleDropMul = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.roomImages || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('roomImages', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.roomImages]
  );

  const handleRemoveFile = useCallback(
    (inputFile: any) => {
      const filtered =
        values.roomImages && values.roomImages?.filter((file: any) => file.id !== inputFile.id);
      setValue('roomImages', filtered);
    },
    [setValue, values.roomImages]
  );


  const handleRemoveAllFiles = useCallback(() => {
    setValue('roomImages', []);
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
            <RHFTextField name="title" label="Title" multiline rows={4} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Image</Typography>
              <RHFUpload
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Information...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="price"
                label="Price"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        $
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="priceSale"
                label="Price Sale"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        $
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField type="number" name="numberBed" label="Number Bed" />
              <RHFTextField type="number" name="numberPeople" label="Number Adults Max" />
              <RHFTextField type="number" name="numberChildren" label="Number Children Max" />

              <RHFSelect
                name="label"
                label="Label"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}>
                {ROOM_LABEL_OPTIONS?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </RHFSelect>


              {tableDataTypeRoom.length > 0 && (
                <RHFSelect
                  name="type_room_id"
                  label="Type Room"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {tableDataTypeRoom?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </RHFSelect>)
              }

            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderServiceAndImage = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Services and Images
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {!currentRoom ? 'Create Services and Images' : 'Update Services and Images'}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Services and Images" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <Stack spacing={1}>
              <Typography variant="subtitle2">Services</Typography>
              {servicesLoading === false && tableDataServices.length > 0 && (
                <>
                  <RHFMultiCheckbox
                    name="service"
                    options={tableDataServices}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                    }}
                  />
                </>
              )}
            </Stack> */}
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="roomImages"
                maxSize={3145728}
                onDrop={handleDropMul}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>

      <Grid xs={12} md={12} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentRoom ? 'Create Room' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderProperties}

          {renderServiceAndImage}
        </Grid>
      </FormProvider>
    </>
  );
}
