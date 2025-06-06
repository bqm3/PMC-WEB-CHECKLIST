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
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IChecklistTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc'
// ----------------------------------------------------------------------

type Props = {
  filters: IChecklistTableFilters;
  onFilters: (name: string, value: IKhuvucTableFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  onFilterProjectStatus: (status: string) => void;
  departmentOptions: {
    value: string;
    label: string;
  }[];
};

export default function OrderTableToolbar({
  filters,
  onFilters,
  departmentOptions,
  //
  canReset,
  onResetFilters,
  onFilterProjectStatus
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

    // Handler cho việc filter dự án đóng
  const handleFilterClosedProjects = useCallback(() => {
    onFilterProjectStatus('closed');
    popover.onClose();
  }, [onFilterProjectStatus, popover]);

  // Handler cho việc filter dự án không báo cáo
  const handleFilterNoReportProjects = useCallback(() => {
    onFilterProjectStatus('no_report');
    popover.onClose();
  }, [onFilterProjectStatus, popover]);

  // Handler để hiển thị tất cả dự án
  const handleShowAllProjects = useCallback(() => {
    onFilterProjectStatus('all');
    popover.onClose();
  }, [onFilterProjectStatus, popover]);

  // Handler để hiển thị dự án hoạt động
  const handleFilterActiveProjects = useCallback(() => {
    onFilterProjectStatus('active');
    popover.onClose();
  }, [onFilterProjectStatus, popover]);

  // const getProjectStatusText = () => {
  //   switch (filters.projectStatus) {
  //     case 'closed':
  //       return 'Dự án đóng';
  //     case 'no_report':
  //       return 'Dự án không báo cáo';
  //     case 'active':
  //       return 'Dự án hoạt động';
  //     default:
  //       return 'Tất cả dự án';
  //   }
  // };

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
          <InputLabel>Chi nhánh</InputLabel>

          <Select
            multiple
            value={filters?.building || []} // Ensure it's an empty array when null
            onChange={handleFilterToanha}
            input={<OutlinedInput label="Chi nhánh" />}
            renderValue={
              (selected) =>
                departmentOptions
                  .filter((option) => selected.includes(option.value)) // Find matching options
                  .map((option) => option.label) // Map to labels
                  .join(', ') // Join the labels with a comma
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {departmentOptions.map((option) => (
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
            placeholder="Tìm kiếm tên dự án, địa chỉ..."
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
        sx={{ width: 200 }}
      >
        <MenuItem onClick={handleShowAllProjects}>
          <Iconify icon="mdi:view-list" />
          Tất cả dự án
        </MenuItem>

        <MenuItem onClick={handleFilterActiveProjects}>
          <Iconify icon="mdi:check-circle" />
          Dự án hoạt động
        </MenuItem>

        <MenuItem onClick={handleFilterClosedProjects}>
          <Iconify icon="mdi:folder-lock" />
          Dự án đóng
        </MenuItem>

        <MenuItem onClick={handleFilterNoReportProjects}>
          <Iconify icon="mdi:file-cancel" />
          Dự án không báo cáo
        </MenuItem>
      </CustomPopover>
    </>
  );
}
