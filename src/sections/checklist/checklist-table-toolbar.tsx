import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
// types
import {
  IKhuvucTableFilters,
  IKhuvucTableFilterValue,
  IChecklistTableFilters,
} from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';

import { CSVLink } from 'react-csv';

// ----------------------------------------------------------------------

type Props = {
  filters: IChecklistTableFilters;
  onFilters: (name: string, value: IKhuvucTableFilterValue) => void;
  buildingOptions: {
    value: string;
    label: string;
  }[];
  canReset: boolean;
  onResetFilters: VoidFunction;
  dataFormatExcel: any;
  headers: any;
};

export default function OrderTableToolbar({
  filters,
  onFilters,
  //
  headers,
  dataFormatExcel,
  canReset,
  onResetFilters,
  buildingOptions,
}: Props) {
  const popover = usePopover();

  const confirm = useBoolean();

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
            placeholder="Tìm kiếm theo checklist, mã qr code, hạng mục..."
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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <CSVLink
          data={dataFormatExcel}
          headers={headers}
          filename="Checklist.csv"
          className="btn btn-primary"
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </CSVLink>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC thông báo"
        content="Uploads file"
        action={
          <Button variant="contained" color="error">
            Xóa
          </Button>
        }
      />
    </>
  );
}
