import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
// types
import { ITourFilters, ITourGuide, ITourFilterValue } from 'src/types/tour';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { IRoomFilterValue, IRoomFilters } from 'src/types/room';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  //
  filters: IRoomFilters;
  onFilters: (name: string, value: IRoomFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  serviceOptions: string[];
  labelOptions: any;
  //
};

export default function TourFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  serviceOptions,
  labelOptions,
}: Props) {

  const handleFilterServices = useCallback(
    (newValue: string) => {
      const checked = filters.services.includes(newValue)
        ? filters.services.filter((value) => value !== newValue)
        : [...filters.services, newValue];
      onFilters('services', checked);
    },
    [filters.services, onFilters]
  );

  const handleFilterLabels = useCallback(
    (newValue: string) => {
      const updatedValue = newValue === '0' ? 'all' : newValue;
      onFilters('labels', updatedValue);
    },
    [onFilters]
  );


  console.log('filters.labels', filters.labels)

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderExperience = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Label
      </Typography>
      {labelOptions.map((option: any) => (<FormControlLabel
        key={option.value}
        control={
          <Radio
            checked={option.value === filters.labels || (option.value === '0' && filters.labels === 'all')}
            onClick={() => handleFilterLabels(option.value)}
          />
        }
        label={option.value === '0' ? 'All' : option.label}
        sx={{
          ...(option.value === '0' && {
            textTransform: 'capitalize',
          }),
        }}
      />))}
    </Stack>
  );

  // const renderServices = (
  //   <Stack>
  //     <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //       Services
  //     </Typography>
  //     {serviceOptions.map((option) => (
  //       <FormControlLabel
  //         key={option}
  //         control={
  //           <Checkbox
  //             checked={filters.services.includes(option)}
  //             onClick={() => handleFilterServices(option)}
  //           />
  //         }
  //         label={option}
  //       />
  //     ))}
  //   </Stack>
  // );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>

            {renderExperience}
            {/* {renderServices} */}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
