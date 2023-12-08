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
        label="Service Order ID"
        value={`S-${values?.id}`}
      />

      <RHFSelect
        fullWidth
        select
        name="active"
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

      <RHFTextField
        disabled
        name="createdAt"
        label="Create Date"
        value={fDateTime(values?.createdAt)}
      />



    </Stack>
  );
}
