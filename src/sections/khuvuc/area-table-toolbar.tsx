import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
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
  dataFormatExcel: any;
  headers: any;
};

export default function OrderTableToolbar({
  filters,
  onFilters,
  //
  canReset,
  headers,
  dataFormatExcel,
  onResetFilters,
}: Props) {
  const popover = usePopover();

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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
       
        <CSVLink
          data={dataFormatExcel}
          headers={headers}
          filename="Khuvuc.csv"
          className="btn btn-primary"
          style={{ textDecoration: 'none', color: 'black'}}
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
    </>
  );
}
