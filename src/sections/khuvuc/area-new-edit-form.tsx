import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  _tags,
  _roles,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// api
import { useGetKhuVuc, useGetToanha, useGetKhoiCV } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
// types
import { IKhuvuc, IToanha, IKhoiCV } from 'src/types/khuvuc';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  currentArea?: IKhuvuc;
};

const STORAGE_KEY = 'accessToken';

export default function AreaNewEditForm({ currentArea }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [toaNha, setToanha] = useState<IToanha[]>([]);
  const [khoiCv, setKhoiCv] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { toanha, toanhaLoading, toanhaEmpty } = useGetToanha();

  const { khoiCV } = useGetKhoiCV();

  useEffect(() => {
    if (toanha?.length > 0) {
      setToanha(toanha);
    }
  }, [toanha]);

  const NewProductSchema = Yup.object().shape({
    Tenkhuvuc: Yup.string().required('Phải có tên khu vực'),
  });

  const defaultValues = useMemo(
    () => ({
      Tenkhuvuc: currentArea?.Tenkhuvuc || '',
      ID_Toanha: currentArea?.ID_Toanha || null,
      ID_KhoiCV: currentArea?.ID_KhoiCV || null,
      MaQrCode: currentArea?.MaQrCode || '',
      Sothutu: currentArea?.Sothutu || '',
      Makhuvuc: currentArea?.Makhuvuc || '',
      ID_KhoiCVs: currentArea?.ID_KhoiCVs || [],
    }),
    [currentArea]
  );

  useEffect(() => {
    if (khoiCV?.length > 0) {
      const transformedData = khoiCV.map((item) => ({
        value: item.ID_Khoi,
        label: item.KhoiCV,
      }));
      setKhoiCv(transformedData);
    }
  }, [khoiCV]);

  // useEffect(() => {
  //   if (
  //     defaultValues.ID_KhoiCVs &&
  //     defaultValues.ID_KhoiCVs !== '' &&
  //     defaultValues.ID_KhoiCVs.length > 0
  //   ) {
  //     setLoading(true);
  //     const parsedArray = Array.isArray(defaultValues.ID_KhoiCVs)
  //       ? defaultValues.ID_KhoiCVs
  //       : [defaultValues.ID_KhoiCVs];
        
  //     const newArray = parsedArray
  //       ?.map((ID: string) => {
  //         // Find the corresponding item in the khoiCV array
  //         const item = khoiCV.find((iTem) => `${iTem.ID_Khoi}` === `${ID}`);

  //         // If the item is found, return an object with the desired structure
  //         if (item) {
  //           return {
  //             value: item.ID_Khoi,
  //             label: `${item.KhoiCV}`,
  //           };
  //         }

  //         // If the item is not found, return null or handle it as needed
  //         return null;
  //       })
  //       ?.filter((item: any) => item !== null);
  //     setKhoiCv(newArray);
  //     setLoading(false);
  //   } else {
  //     const transformedData = khoiCV.map((item) => ({
  //       value: item.ID_Khoi,
  //       label: item.KhoiCV,
  //     }));
  //     setKhoiCv(transformedData);
  //   }
  // }, [khoiCV, defaultValues.ID_KhoiCVs]);

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
    if (currentArea) {
      reset(defaultValues);
    }
  }, [currentArea, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentArea !== undefined) {
        await axios
          .put(`https://checklist.pmcweb.vn/be//api/ent_khuvuc/update/${currentArea.ID_Khuvuc}`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            reset();
            enqueueSnackbar({
                variant: 'success',
                autoHideDuration: 2000,
                message: 'Cập nhật thành công'
              });
            router.push(paths.dashboard.khuvuc.root);
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
        axios
          .post(`https://checklist.pmcweb.vn/be//api/ent_khuvuc/create`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            reset();
            enqueueSnackbar('Tạo mới thành công!');
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
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
        message: `Lỗi gửi yêu cầu`,
      });
    }
  });

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);


  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={3}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên khu vực, Mã Qr Code...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title="Chi tiết" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              {toaNha?.length > 0 && (
                <RHFSelect
                  name="ID_Toanha"
                  label="Tòa nhà"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {toaNha?.map((item) => (
                    <MenuItem key={item?.ID_Toanha} value={item?.ID_Toanha}>
                      {item?.Toanha}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Stack>

            <Stack spacing={1.5}>
              {loading === false ? (
                <>
                  {khoiCv && khoiCv?.length > 0 ? (
                    <RHFMultiSelect
                      checkbox
                      name="ID_KhoiCVs"
                      label="Chọn các khối cho khu vực"
                      options={khoiCv}
                    />
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </Stack>

            <RHFTextField name="Tenkhuvuc" label="Tên khu vực" />
            <RHFTextField name="MaQrCode" label="Mã Qr Code" />
            <RHFTextField name="Sothutu" label="Số thứ tự" />
            <RHFTextField name="Makhuvuc" label="Mã khu vực" />

            {/* <RHFTextField name="subDescription" label="Sub Description" multiline rows={4} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack> */}

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack> */}
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
            Thông tin phòng...
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
              <RHFTextField name="code" label="Product Code" />

              <RHFTextField name="sku" label="Product SKU" />

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              />

              <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} />
            </Box>

            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Regular Price"
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
              label="Sale Price"
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

            <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            />

            {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
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
        {/* <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        /> */}

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentArea ? 'Tạo mới' : 'Lưu thay đổi'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties}

        {renderPricing}
*/}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
