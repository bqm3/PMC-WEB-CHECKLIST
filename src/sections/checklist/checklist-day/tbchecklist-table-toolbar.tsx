import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// types
import { ITbChecklistTableFilters, ITbChecklistTableFilterValue } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: ITbChecklistTableFilters;
  onFilters: (name: string, value: ITbChecklistTableFilterValue) => void;
  //
  canReset: boolean;
  dateError: boolean;
  onResetFilters: VoidFunction;
  onPrint: VoidFunction;
  setShowModal: any;
  departmentOptions: {
    value: string;
    label: string;
  }[];
};

export default function TbChecklistTableToolbar({
  filters,
  onFilters,
  departmentOptions,
  canReset,
  dateError,
  setShowModal,
  onPrint,
  onResetFilters,
}: Props) {

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  // const handleFilterKhoiCV = useCallback(
  //   (event: SelectChangeEvent<string[]>) => {
  //     onFilters(
  //       'status',
  //       typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
  //     );
  //   },
  //   [onFilters]
  // );

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
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          {/* <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, md: 200 },
            }}
          >
            <InputLabel>Tòa nhà</InputLabel>

            <Select
              multiple
              value={filters?.status || []} // Ensure it's an empty array when null
              onChange={handleFilterKhoiCV}
              input={<OutlinedInput label="Khối công việc" />}
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
                    checked={filters?.status.includes(option.value)}
                  />
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          <DatePicker
            label="Ngày bắt đầu"
            value={filters.startDate}
            onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{
              maxWidth: { md: 200 },
            }}
          />

          <DatePicker
            label="Ngày kết thúc"
            value={filters.endDate}
            onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
            sx={{
              maxWidth: { md: 200 },
            }}
          />

          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Tìm kiếm tên ca"
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
          {/* <Button style={{ width: '150px' }} variant="contained" onClick={() => setShowModal(true)}>
            Tra cứu
          </Button> */}
        </Stack>

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

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onPrint();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          In báo cáo
        </MenuItem>

       
      </CustomPopover> */}
    </>
  );
}
