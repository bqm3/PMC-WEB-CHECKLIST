import { useCallback } from 'react';
// @mui
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
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import { IChecklistTableFilters } from 'src/types/khuvuc';
// ----------------------------------------------------------------------

type Props = {
  filters: IChecklistTableFilters;
  onFilters: (name: string, value: any) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  options: {
    value: string;
    label: string;
  }[];
};

export default function OrderTableToolbar({
  filters,
  onFilters,
  canReset,
  onResetFilters,
  options,
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
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Phân hệ</InputLabel>

        <Select
          multiple
          value={filters?.building || []} // Ensure it's an empty array when null
          onChange={handleFilterToanha}
          input={<OutlinedInput label="Phân hệ" />}
          renderValue={
            (selected) =>
              options
                .filter((option) => selected.includes(option.value)) // Find matching options
                .map((option) => option.label) // Map to labels
                .join(', ') // Join the labels with a comma
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {options.map((option) => (
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
          placeholder="Tìm kiếm tên dự án"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
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
