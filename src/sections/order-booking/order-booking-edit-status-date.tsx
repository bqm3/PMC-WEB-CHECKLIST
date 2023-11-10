import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
// components
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
// utils
import { fDateTime } from 'src/utils/format-time';
// _mock
import { ORDER_BOOKING_STATUS_OPTIONS } from 'src/_mock';

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control, watch } = useFormContext();

  const values = watch();

  const theme = useTheme();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFTextField
        disabled
        name="id"
        label="Mã đơn đặt phòng"
        value={`HD-${values?.id}`}
      />

      <RHFSelect
        fullWidth
        select
        name="status"
        label="Status"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: 'capitalize' }}
      >
        {ORDER_BOOKING_STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value} >
            {option.label}
          </MenuItem>
        ))}
      </RHFSelect>

      {/* <TextField
            fullWidth
            select
            label="Trạng thái đơn"
            value={currentStatus}
            onChange={onChangeStatus}
            sx={{
              maxWidth: 160,
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField> */}

      <RHFTextField
        disabled
        name="createdDate"
        label="Create Date"
        value={fDateTime(values.createdDate)}
      />



    </Stack>
  );
}
