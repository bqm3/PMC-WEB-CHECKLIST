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
import { IBeboi, IDuan, IHSSE } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IBeboi;
  selected: boolean;
};

export default function BeBoiDetailTableRow({
  row,
  selected,
}: Props) {
  const { ID_Beboi, ID_Duan, Ngay_ghi_nhan, Nguoi_tao, ID_Checklist, ID_ChecklistC, Tyle, VuotChuan, ent_duan, ent_checklist, tb_checklistc, Giatridinhdanh, Giatrighinhan, Giatrisosanh } = row;
  console.log('row', row)


  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}
      sx={{
        backgroundColor: VuotChuan ? 'error.lighter' : 'inherit',
        '&:hover': {
          backgroundColor: VuotChuan ? 'error.light' : 'action.hover',
        },
      }}>

      <TableCell>{ent_checklist?.Checklist}</TableCell>
      <TableCell>{Giatridinhdanh}</TableCell>
      <TableCell>{Giatrighinhan} {ent_checklist?.Giatrinhan}</TableCell>
      <TableCell>{Giatrisosanh}</TableCell>
      <TableCell>{Tyle} {Tyle ? '%' : ''}</TableCell>
      <TableCell>{Nguoi_tao}</TableCell>
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
            // onViewRow();
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
