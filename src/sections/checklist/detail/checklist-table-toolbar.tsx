import { useCallback, useState } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
// types
import { IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
interface BuildingOption {
  value: string;
  label: string;
}

type Props = {
  filters: IKhuvucTableFilters;
  onFilters: (name: string, value: IKhuvucTableFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  handleFiltersTinhtrang: (name: string, value: any) => void;
};

export default function OrderTableToolbar({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  handleFiltersTinhtrang,
}: Props) {

  const buildingOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: '0', label: 'Checklist không lỗi' },
    { value: '1', label: 'Checklist Lỗi' },
    { value: '2', label: 'Checklist Lại' },
  ];

  const popover = usePopover();

  const [selectedStatus, setSelectedStatus] = useState<any>("all");

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value 
    setSelectedStatus(value); 
    handleFiltersTinhtrang('status', value);
  };

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel id="status-select-label">Trạng thái</InputLabel>
          <Select
            labelId="status-select-label"
            value={String(selectedStatus)}
            onChange={handleFilterChange}
            input={<OutlinedInput label="Trạng thái" />}
            renderValue={(selected) =>
              buildingOptions.find((option) => option.value === selected)?.label || ''
            }
          >
            {buildingOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Tìm kiếm theo checklist, hạng mục, khu vực, giá trị, giờ, ghi chú..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Stack>
        {/* <Stack direction="row" spacing={2} flexGrow={1} sx={{ width: 1 }}>
            <MenuItem
              onClick={() => {
                popover.onClose();
              }}
            >
              <Iconify icon="solar:export-bold" style={{ width: 28, height: 28 }} />
              Export
            </MenuItem>
          </Stack> */}

        {/* {canReset && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )} */}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}
