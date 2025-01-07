import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
// types
import { IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { CSVLink } from 'react-csv';

// ----------------------------------------------------------------------

type Props = {
  filters: IKhuvucTableFilters;
  onFilters: (name: string, value: IKhuvucTableFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  headers: any;
  buildingOptions: {
    value: string;
    label: string;
  }[];
};

export default function OrderTableToolbar({
  filters,
  onFilters,
  //
  canReset,
  headers,
  onResetFilters,
  buildingOptions,
}: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterToanha = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'building',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
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
      {/* <DatePicker
          label="Ngày bắt đầu"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
          }}
        />

        <DatePicker
          label="Ngày kết thúc"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 200 },
          }}
        /> */}

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Tòa nhà</InputLabel>

        <Select
          multiple
          value={filters?.building || []} // Ensure it's an empty array when null
          onChange={handleFilterToanha}
          input={<OutlinedInput label="Tòa nhà" />}
          renderValue={
            (selected) =>
              buildingOptions
                .filter((option) => selected.includes(option.value)) // Find matching options
                .map((option) => option.label) // Map to labels
                .join(', ') // Join the labels with a comma
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {buildingOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters?.building.includes(option.value)}
              />
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
          placeholder="Tìm kiếm theo tên khu vực, mã qr code, tòa nhà..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      {canReset && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
