// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { ITbChecklistTableFilters, ITbChecklistTableFilterValue } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: ITbChecklistTableFilters;
  onFilters: (name: string, value: ITbChecklistTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function InvoiceTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {

  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveDate = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          kết quả tìm thấy
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">


        {filters.status !== 'all' && (
          <Block label="Khối làm việc:">
            <Chip
              size="small"
              label={
                (`${filters.status}` === '1' && 'Khối làm sạch') ||
                (`${filters.status}` === '2' && 'Khối kỹ thuật') ||
                (`${filters.status}` === '3' && 'Khối an ninh') ||
                (`${filters.status}` === '4' && 'Khối dịch vụ') ||
                (`${filters.status}` === '5' && 'Khối F&B')
              }
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {/* {filters.startDate && filters.endDate && (
          <Block label="Ngày: ">
            <Chip size="small" label={shortLabel || ""} onDelete={handleRemoveDate} />
          </Block>
        )} */}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
