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
import { IDuan, IHSSE } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IHSSE;
  selected: boolean;
  onViewRow: VoidFunction;
  // onSelectRow: VoidFunction;
  // onDeleteRow: VoidFunction;
  // onViewDuAnRow: VoidFunction;
  // user: any
};

export default function CalvTableRow({
  row,
  selected,
  onViewRow,
  // onSelectRow,
  // onDeleteRow,
  // onViewDuAnRow,
  // user
}: Props) {
  const { ID, Ten_du_an, Ngay_ghi_nhan, Nguoi_tao, Dien_cu_dan, Dien_cdt, Nuoc_cdt, Nuoc_cu_dan, Xa_thai, Rac_sh } = row;


  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>

      <TableCell>{Ngay_ghi_nhan}</TableCell>
      <TableCell>{Nguoi_tao}</TableCell>
      <TableCell>{Dien_cu_dan}</TableCell>
      <TableCell>{Dien_cdt}</TableCell>
      <TableCell>{Nuoc_cu_dan}</TableCell>
      <TableCell>{Nuoc_cdt}</TableCell>
      <TableCell>{Xa_thai}</TableCell>
      <TableCell>{Rac_sh}</TableCell>
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
