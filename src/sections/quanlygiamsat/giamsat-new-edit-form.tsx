import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';
// api
import { useGetKhuvucByToanha, useGetProfile } from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { IToanha, IKhuvucTableFilters, IUser } from 'src/types/khuvuc';

// components
import { useSettingsContext } from 'src/components/settings';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  id?: string;
};

const STORAGE_KEY = 'accessToken';

export default function GiamsatNewEditForm({ id }: Props) {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [buildingsData, setBuildingsData] = useState<IToanha[]>([]);
  const [checkedStates, setCheckedStates] = useState<any>([]);

  // const { toanha, user } = useGetKhuvucByToanha(id);

  // useEffect(() => {
  //   if (toanha && user) {
  //     setBuildingsData(toanha);
  //     // Initialize checked states for each building's areas
  //     setCheckedStates(
  //       toanha.map((building) =>
  //         building.ent_khuvuc.map((area, index) => ({ ID_Khuvuc: area.ID_Khuvuc,Index: index, checked: user.ID_Khuvucs?.includes(area.ID_Khuvuc) }))
  //       )
  //     );
  //   }
  // }, [toanha, user]);

  const handleParentChange = (buildingIndex: any) => (event: any) => {
    const isChecked = event.target.checked;
   
    const updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, index: any) =>
      `${index}` === `${buildingIndex}`
        ? buildingCheckedStates?.map((data: any) => ({ ...data, checked: isChecked }))
        : buildingCheckedStates
    );

    setCheckedStates(updatedCheckedStates);
  };

  // Handle change for individual child checkboxes
  const handleChildChange = (buildingIndex: any, areaIndex: any) => (event: any) => {
    const updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, bIndex: any) =>
      bIndex === buildingIndex
        ? buildingCheckedStates.map((area: any, aIndex: any) =>
            aIndex === areaIndex ? { ...area, checked: event.target.checked } : area
          )
        : buildingCheckedStates
    );
    setCheckedStates(updatedCheckedStates);
  };

  const onSubmit = async () => {
    setLoading(true);
    await axios
      .put(`https://checklist.pmcweb.vn/be/api/v2/ent_user/set-up/${id}`, checkedStates, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        enqueueSnackbar({
                variant: 'success',
                autoHideDuration: 2000,
                message: 'Cập nhật thành công'
              });
      })
      .catch((error) => {
        setLoading(false);
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
  };

  const renderDetails = (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Card>
        <Stack spacing={2} flexWrap="wrap" p={2}>
          {buildingsData.map((building, buildingIndex) => {
            const buildingCheckedStates = checkedStates[buildingIndex] || [];
            const isIndeterminate =
              buildingCheckedStates.some((area: any) => area.checked) &&
              !buildingCheckedStates.every((area: any) => area.checked);
            const isParentChecked = buildingCheckedStates.every((area: any) => area.checked);

            return (
              <Stack
                key={building.ID_Toanha}
                spacing={2}
                padding={2}
                border="1px solid #ccc"
                borderRadius={1}
              >
                <Typography variant="h6">{building.Toanha}</Typography>
                <FormControlLabel
                  label={`${building.Toanha}`}
                  control={
                    <Checkbox
                      size="medium"
                      checked={isParentChecked}
                      indeterminate={isIndeterminate}
                      onChange={handleParentChange(buildingIndex)}
                    />
                  }
                />
                <div>
                  {building.ent_khuvuc.map((area, areaIndex) => (
                    <FormControlLabel
                      key={area.ID_Khuvuc}
                      label={`${area.Tenkhuvuc}`}
                      control={
                        <Checkbox
                          size="medium"
                          checked={buildingCheckedStates[areaIndex]?.checked}
                          onChange={handleChildChange(buildingIndex, areaIndex)}
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
    </Container>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}
      >
        <LoadingButton
          type="submit"
          onClick={onSubmit}
          variant="contained"
          size="large"
          loading={loading}
        >
          Lưu thay đổi
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <Grid container spacing={3}>
      {renderDetails}

      {renderActions}
    </Grid>
  );
}
