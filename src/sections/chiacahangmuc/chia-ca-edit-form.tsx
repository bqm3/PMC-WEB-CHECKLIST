import { useEffect, useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
// hooks
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles } from 'src/_mock';
// api
import {
  useGetCalv,
  useGetDetailPhanCaByDuan,
  useGetKhoiCV,
  useGetKhuVuc,
  useGetToanha,
} from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { ICalv, IKhuvuc } from 'src/types/khuvuc';

// components
import { useSettingsContext } from 'src/components/settings';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  id?: string;
};

const STORAGE_KEY = 'accessToken';

export default function ChiaCaNewEditForm({ id }: Props) {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [optionKhoiCV, setOptionKhoiCV] = useState<any>();
  const [optionToaNha, setOptionToaNha] = useState<any>([]);
  const [optionCalv, setOptionCalv] = useState<any>();
  const [ngayThucHien, setNgaythuchien] = useState(1);
  const [arrChukyData, setArrChukyData] = useState<any>([]);
  const [chukyData, setChukyData] = useState<any>();
  const [areasData, setAreasData] = useState<IKhuvuc[]>([]);

  const [checkedStates, setCheckedStates] = useState<any>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const { khuvuc } = useGetKhuVuc();
  const { thietlapca, khuvucCheck } = useGetDetailPhanCaByDuan(id);
  const [Calv, setCalv] = useState<ICalv[]>([]);
  const [ToaNha, setToaNha] = useState<any>();
  const [KhoiCV, setKhoiCV] = useState<any>();

  const { khoiCV } = useGetKhoiCV();
  const { calv } = useGetCalv();
  const { toanha } = useGetToanha();

  useEffect(() => {
    if (khoiCV?.length > 0) {
      setKhoiCV(khoiCV);
    }
  }, [khoiCV]);

  useEffect(() => {
    if (toanha?.length > 0) {
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

  useEffect(() => {
    if (khuvucCheck?.length > 0) {
      const khuVucIds = khuvucCheck.map((item) => item.ID_Toanha);
      setOptionToaNha(khuVucIds);
    }
  }, [khuvucCheck]);

  useEffect(() => {
    if (thietlapca && calv && KhoiCV) {
      const newCalv = calv?.filter((item: any) => `${item.ID_Calv}` === `${thietlapca?.ID_Calv}`);

      setOptionCalv(newCalv[0]);
      setNgaythuchien(Number(thietlapca?.Ngaythu));

      const selectedKhoiCV = KhoiCV?.filter(
        (item: any) => `${item.ID_KhoiCV}` === `${thietlapca?.ent_calv?.ID_KhoiCV}`
      );
      setOptionKhoiCV(selectedKhoiCV[0]);

      // Get all cycles for this project and work block
      const arrChuky = thietlapca.ent_duan.ent_duan_khoicv;
      const chukyDetail = arrChuky.filter(
        (item: any) =>
          `${thietlapca?.ent_calv?.ID_KhoiCV}` === `${item.ID_KhoiCV}` && `${item.isDelete}` === '0'
      );

      setArrChukyData(chukyDetail);
      // Set the selected cycle based on ID_Chuky from thietlapca
      const selectedChuky = chukyDetail.find(
        (item: any) => `${item.ID_Duan_KhoiCV}` === `${thietlapca?.ent_duan_khoicv?.ID_Duan_KhoiCV}`
      );

      setChukyData(selectedChuky);
    }
  }, [thietlapca, KhoiCV, calv]);

  const handleChangeKhoiCV = (event: any) => {
    const selectedKhoiCV = KhoiCV?.find((item: any) => item.ID_KhoiCV === event.target.value);

    // Get cycles for the selected work block
    const arrChuky = ToaNha[0]?.ent_duan?.ent_duan_khoicv;
    const chukyDetail = arrChuky?.filter(
      (item: any) => `${event.target.value}` === `${item.ID_KhoiCV}`
    );
    setArrChukyData(chukyDetail);

    // Reset chukyData when changing work block
    setChukyData(undefined);

    setOptionKhoiCV(selectedKhoiCV);
  };

  const handleChangeCalv = (event: any) => {
    const selectedCalv = Calv?.find((item: any) => item.ID_Calv === event.target.value);
    setOptionCalv(selectedCalv);
  };

  const handleArrChukyChange = (event: any) => {
    const selectedItem = arrChukyData.find(
      (item: { ID_Duan_KhoiCV: any }) => item.ID_Duan_KhoiCV === event.target.value
    );
    setChukyData(selectedItem);

    if (selectedItem && `${selectedItem?.isQuantrong}` === `1`) {
      // Reset all checked states, keeping only the important items checked
      const resetCheckedStates = checkedStates.map((buildingCheckedStates: any) =>
        buildingCheckedStates.map((item: any) => ({
          ...item,
          checked: false, // Only keep Important items checked
        }))
      );

      setCheckedStates(resetCheckedStates);
      // Set global select all to false
      setIsSelectAllChecked(false);
    } else {
      // Reset all checked states, keeping only the important items checked
      const resetCheckedStates = checkedStates.map((buildingCheckedStates: any) =>
        buildingCheckedStates.map((item: any) => ({
          ...item,
          checked: item?.Important ?? true, // Only keep Important items checked
        }))
      );

      setCheckedStates(resetCheckedStates);
      // Set global select all to false
      setIsSelectAllChecked(false);
    }
  };

  const handleNgayThucHien = (event: any) => {
    setNgaythuchien(event.target.value);
  };

  const handleToanhaChange = (event: any) => {
    const {
      target: { value },
    } = event;

    // Check if `value` is an array and update `optionToaNha` with either adding or removing the selected item.
    setOptionToaNha((prevSelected: any) => {
      const selectedValues = typeof value === 'string' ? value.split(',') : value;

      // Toggle logic: check if the value is already selected; if so, remove it; otherwise, add it
      return selectedValues.includes(value[value.length - 1])
        ? selectedValues
        : [...selectedValues];
    });
  };

  useEffect(() => {
    if (khuvuc) {
      let filteredAreas = khuvuc;

      // Apply building filter if `optionToaNha` is selected
      if (optionToaNha) {
        filteredAreas = filteredAreas.filter((kv) => optionToaNha.includes(kv.ID_Toanha));
      }

      // Apply work block filter if `optionKhoiCV` is selected
      if (optionKhoiCV) {
        filteredAreas = filteredAreas.filter((kv) =>
          kv.ID_KhoiCVs.includes(optionKhoiCV.ID_KhoiCV)
        );
      }

      setAreasData(filteredAreas);

      setCheckedStates(
        filteredAreas.map((kv) =>
          kv.ent_hangmuc.map((hm, index) => ({
            ID_Hangmuc: hm.ID_Hangmuc,
            Important: `${hm.Important}` === '1',
            Index: index,
            checked: khuvucCheck.some(
              (checkItem) =>
                checkItem.ent_hangmuc.some((checkHm) => checkHm.ID_Hangmuc === hm.ID_Hangmuc)
            ),
          }))
        )
      );
    }
  }, [khuvuc, optionKhoiCV, khuvucCheck, optionToaNha]);

  const handleParentChange = (buildingIndex: any) => (event: any) => {
    const isChecked = event.target.checked;

    let updatedCheckedStates = [];

    // updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, index: any) =>
    //   `${index}` === `${buildingIndex}`
    //     ? buildingCheckedStates?.map((data: any) => ({
    //         ...data,
    //         checked: data.Important ? true : isChecked, // Prevent unchecking important items
    //       }))
    //     : buildingCheckedStates
    // );

    if (chukyData?.isQuantrong) {
      updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, index: any) =>
        `${index}` === `${buildingIndex}`
          ? buildingCheckedStates?.map((data: any) => ({
            ...data,
            checked: isChecked, // Prevent unchecking important items
          }))
          : buildingCheckedStates
      );
    } else {
      updatedCheckedStates = checkedStates.map((buildingCheckedStates: any, index: any) =>
        `${index}` === `${buildingIndex}`
          ? buildingCheckedStates?.map((data: any) => ({
            ...data,
            checked: data.Important ? true : isChecked, // Prevent unchecking important items
          }))
          : buildingCheckedStates
      );
    }

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
    let updatedCheckedStates = [];

    if (chukyData?.isQuantrong) {
      updatedCheckedStates = checkedStates.map((buildingCheckedStates: any) =>
        buildingCheckedStates.map((item: any) => ({
          ...item,
          checked: isChecked, // Prevent unchecking important items
        }))
      );
    } else {
      updatedCheckedStates = checkedStates.map((buildingCheckedStates: any) =>
        buildingCheckedStates.map((item: any) => ({
          ...item,
          checked: item.Important ? true : isChecked, // Prevent unchecking important items
        }))
      );
    }

    setCheckedStates(updatedCheckedStates);
  };

  const onSubmit = async () => {
    setLoading(true);
    const ID_HangmucCheckedTrue = checkedStates
      .flat()
      .filter((item: any) => item.checked)
      .map((item: any) => item.ID_Hangmuc);
    const data = {
      Tenchuky: chukyData?.Tenchuky,
      ID_KhoiCV: optionKhoiCV?.ID_KhoiCV,
      ID_Chuky: chukyData?.ID_Duan_KhoiCV,
      ID_Calv: optionCalv?.ID_Calv,
      Ngaythu: ngayThucHien,
      ID_Hangmucs: ID_HangmucCheckedTrue,
      Sochecklist: 100,
    };
    await axios
      .put(`${process.env.REACT_APP_HOST_API}/ent_thietlapca/update/${id}`, data, {
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
        const href = paths.dashboard.phanquyenchecklist.root;
        router.replace(href);
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
                          disabled={`${chukyData?.isQuantrong}` === `1` ? false : areaCheckedStates[itemIndex]?.Important} // Disable if Important is true
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
                  value={optionKhoiCV?.ID_KhoiCV || ''}
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
              <>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Chu kỳ</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="Chuky"
                    value={chukyData?.ID_Duan_KhoiCV || ''}
                    label="Chu kỳ"
                    onChange={handleArrChukyChange}
                  >
                    {arrChukyData?.map((item: any) => (
                      <MenuItem key={item.ID_Duan_KhoiCV} value={item.ID_Duan_KhoiCV}>
                        {item?.Tenchuky}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {chukyData && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Ngày thực thiện</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="Ngaythuchien"
                      value={ngayThucHien}
                      label="Ngày thực thiện"
                      onChange={handleNgayThucHien}
                    >
                      {[...Array(Number(chukyData?.Chuky))].map((_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          {index + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
            )}

            {Calv?.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Ca làm việc</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={optionCalv?.ID_Calv || ''}
                  label="Ca làm việc"
                  onChange={handleChangeCalv}
                >
                  {Calv?.map((item: any) => (
                    <MenuItem key={`${item?.Tenca}_${item?.ID_Calv}`} value={item?.ID_Calv}>
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
