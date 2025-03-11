// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { IDuan, IP0 } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IP0;
  selected: boolean;
  onViewRow: VoidFunction;
};

export default function CalvTableRow({ row, selected, onViewRow }: Props) {
  const { ID_P0, Ngaybc, ent_duan, ent_user_AN, ent_user_KT, Doanhthu, Ghichu, ent_user_DV } = row;

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{Ngaybc}</TableCell>
      <TableCell>{ent_user_AN?.Hoten}</TableCell>
      <TableCell>{ent_user_DV?.Hoten}</TableCell>
      <TableCell>{ent_user_KT?.Hoten}</TableCell>
      <TableCell>{Doanhthu}</TableCell>
      <TableCell>{Ghichu}</TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover?.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem>
      </CustomPopover>
    </>
  );
}
