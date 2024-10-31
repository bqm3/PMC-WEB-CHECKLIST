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
import {
  useGetCalv,
  useGetDetailPhanCaByDuan,
  useGetKhoiCV,
  useGetKhuVuc,
  useGetProfile,
  useGetToanha,
} from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { IToanha, IKhuvucTableFilters, IUser, IKhoiCV, ICalv, IKhuvuc } from 'src/types/khuvuc';

// components
import { useSettingsContext } from 'src/components/settings';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export default function ChiaCaNewEditForm() {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [optionKhoiCV, setOptionKhoiCV] = useState<any>();
  const [optionToaNha, setOptionToaNha] = useState<any>([]);
  const [optionCalv, setOptionCalv] = useState<any>();
  const [selectedChuky, setSelectedChuky] = useState(1);
  const [chukyData, setChukyData] = useState<any>(1);
  const [areasData, setAreasData] = useState<IKhuvuc[]>([]);

  const [checkedStates, setCheckedStates] = useState<any>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const { khuvuc } = useGetKhuVuc();

  const [Calv, setCalv] = useState<ICalv[]>([]);

  const [KhoiCV, setKhoiCV] = useState<any>();

  const [ToaNha, setToaNha] = useState<any>();

  const { khoiCV } = useGetKhoiCV();

  const { calv } = useGetCalv();

  const { toanha } = useGetToanha();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCV(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (toanha.length > 0) {
      setToaNha(toanha);
    }
  }, [toanha]);

  useEffect(() => {
    if (calv?.length > 0) {
      if (optionKhoiCV) {
        const newCalv = calv.filter((item: any) => item.ID_KhoiCV === optionKhoiCV.ID_KhoiCV);
        setCalv(newCalv);
      } else {
        setCalv(calv);
      }
    }
  }, [calv, optionKhoiCV]);

  const handleChangeKhoiCV = (event: any) => {
    const selectedKhoiCV = KhoiCV.find((item: any) => item.ID_KhoiCV === event.target.value);
    const arrChuky = ToaNha[0]?.ent_duan?.ent_duan_khoicv;
    const chukyDetail = arrChuky?.filter(
      (item: any) => `${event.target.value}` === `${item.ID_KhoiCV}`
    );
    setChukyData(chukyDetail[0]?.Chuky || 0);

    setOptionKhoiCV(selectedKhoiCV);
  };

  const handleChangeCalv = (event: any) => {
    const selectedCalv = Calv.find((item: any) => item.ID_Calv === event.target.value);
    setOptionCalv(selectedCalv);
  };

  const handleChukyChange = (event: any) => {
    setSelectedChuky(event.target.value);
  };

  const handleToanhaChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setOptionToaNha(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    if (khuvuc) {
      const filteredAreas = optionKhoiCV
        ? khuvuc.filter((kv) => kv.ID_KhoiCVs.includes(optionKhoiCV.ID_KhoiCV))
        : khuvuc;
      setAreasData(filteredAreas);
      setCheckedStates(
        filteredAreas.map((kv) =>
          kv.ent_hangmuc.map((hm, index) => ({
            ID_Hangmuc: hm.ID_Hangmuc,
            Important: `${hm.Important}` === '1', // Simplified
            Index: index,
            checked: `${hm.Important}` === '1', // Simplified
          }))
        )
      );
    }
    if (optionToaNha) {
      const filteredAreas = optionToaNha
        ? khuvuc.filter((kv) => optionToaNha.includes(kv.ID_Toanha))
        : khuvuc;

      setAreasData(filteredAreas);
      setCheckedStates(
        filteredAreas.map((kv) =>
          kv.ent_hangmuc.map((hm, index) => ({
            ID_Hangmuc: hm.ID_Hangmuc,
            Important: `${hm.Important}` === '1', // Simplified
            Index: index,
            checked: `${hm.Important}` === '1', // Simplified
          }))
        )
      );
    }
  }, [khuvuc, optionKhoiCV, optionToaNha]);

  const handleParentChange = (buildingIndex: any) => (event: any) => {
    const isChecked = event.target.checked;

    const updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, index: any) =>
      `${index}` === `${buildingIndex}`
        ? buildingCheckedStates?.map((data: any) => ({
          ...data,
          checked: data.Important ? true : isChecked, // Prevent unchecking important items
        }))
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

  const handleSelectAllChange = (event: any) => {
    const isChecked = event.target.checked;
    setIsSelectAllChecked(isChecked);

    const updatedCheckedStates = checkedStates.map((buildingCheckedStates: any) =>
      buildingCheckedStates.map((item: any) => ({
        ...item,
        checked: item.Important ? true : isChecked, // Prevent unchecking important items
      }))
    );

    setCheckedStates(updatedCheckedStates);
  };

  const onSubmit = async () => {
    setLoading(true);
    const ID_HangmucCheckedTrue = checkedStates
      .flat()
      .filter((item: any) => item.checked)
      .map((item: any) => item.ID_Hangmuc);
    const data = {
      ID_KhoiCV: optionKhoiCV?.ID_KhoiCV,
      ID_Calv: optionCalv?.ID_Calv,
      Ngaythu: selectedChuky,
      ID_Hangmucs: ID_HangmucCheckedTrue,
      Sochecklist: 100,
    };
    await axios
      .post(`https://checklist.pmcweb.vn/be/api/v2/ent_thietlapca/create`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Cập nhật thành công',
        });
      })
      .catch((error) => {
        setLoading(false);
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
  };

  const renderDetails = (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <FormControlLabel
        title="Chọn tất cả"
        label="Chọn tất cả"
        control={
          <Checkbox
            size="medium"
            checked={isSelectAllChecked}
            onChange={handleSelectAllChange}
            indeterminate={
              checkedStates.flat().some((item: any) => item.checked) &&
              !checkedStates.flat().every((item: any) => item.checked)
            }
          />
        }
        sx={{
          '.MuiFormControlLabel-label': {
            fontWeight: 'bold',
            fontSize: '17px',
          },
        }}
      />

      <Card>
        <Stack spacing={2} flexWrap="wrap" p={2}>
          {areasData.map((area, areaIndex) => {
            const areaCheckedStates = checkedStates[areaIndex] || [];
            const isIndeterminate =
              areaCheckedStates.some((item: any) => item.checked) &&
              !areaCheckedStates.every((item: any) => item.checked);
            const isParentChecked = areaCheckedStates.every((item: any) => item.checked);

            return (
              <Stack
                key={area.ID_Khuvuc}
                spacing={2}
                padding={2}
                border="1px solid #ccc"
                borderRadius={1}
              >
                <FormControlLabel
                  title={`${area.Tenkhuvuc} - ${area.ent_toanha.Toanha}`}
                  key={area.ID_Khuvuc}
                  label={`${area.Tenkhuvuc} - ${area.ent_toanha.Toanha}`}
                  control={
                    <Checkbox
                      size="medium"
                      checked={isParentChecked}
                      indeterminate={isIndeterminate}
                      onChange={handleParentChange(areaIndex)}
                    />
                  }
                  sx={{
                    '.MuiFormControlLabel-label': {
                      fontWeight: 'bold',
                      fontSize: '17px',
                    },
                  }}
                />
                <div>
                  {area.ent_hangmuc.map((item, itemIndex) => (
                    <FormControlLabel
                      key={item.ID_Hangmuc}
                      label={`${item.Hangmuc}`}
                      control={
                        <Checkbox
                          size="medium"
                          checked={areaCheckedStates[itemIndex]?.checked}
                          onChange={handleChildChange(areaIndex, itemIndex)}
                          disabled={areaCheckedStates[itemIndex]?.Important} // Disable if Important is true
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

  const renderOptions = (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ mb: 2 }}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {ToaNha?.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Tòa nhà</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="Toanha"
                  value={optionToaNha}
                  label="Tòa nhà"
                  multiple
                  onChange={handleToanhaChange}
                >
                  {ToaNha?.map((item: any) => (
                    <MenuItem key={item?.ID_Toanha} value={item.ID_Toanha}>
                      {item?.Toanha}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {KhoiCV?.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Khối công việc</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="KhoiCV"
                  value={optionKhoiCV}
                  label="Khối công việc"
                  onChange={handleChangeKhoiCV}
                >
                  {KhoiCV?.map((item: any) => (
                    <MenuItem key={item?.KhoiCV} value={item.ID_KhoiCV}>
                      {item?.KhoiCV}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {optionKhoiCV && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Ngày thực thiện</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="KhoiCV"
                  value={selectedChuky}
                  label="Ngày thực thiện"
                  onChange={handleChukyChange}
                >
                  {[...Array(Number(chukyData))].map((_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {Calv?.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Ca làm việc</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={optionCalv}
                  label="Ca làm việc"
                  onChange={handleChangeCalv}
                >
                  {Calv?.map((item: any) => (
                    <MenuItem key={item?.ID_Calv} value={item?.ID_Calv}>
                      {item?.Tenca}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </Stack>
      </Card>
    </Container>
  );

  return (
    <Grid container spacing={3}>
      {renderOptions}

      {renderDetails}

      {renderActions}
    </Grid>
  );
}
