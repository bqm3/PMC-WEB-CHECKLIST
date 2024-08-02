import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IOrderItem } from 'src/types/order';
import { IKhuvuc, IHangMuc, IChecklist, ICalv, TbChecklistCalv } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: TbChecklistCalv;
  calv: ICalv[];
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  handleClickOpen: VoidFunction;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  calv,
  handleClickOpen,
}: Props) {
  const {
    ID_Checklistchitiet,
    ID_ChecklistC,
    ID_Checklist,
    Ketqua,
    Anh,
    Gioht,
    Ghichu,
    isDelete,
    status,
    tb_checklistc,
    ent_checklist,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  console.log('ent_checklist?.Giatridinhdanh',ent_checklist?.Giatridinhdanh)

  const renderPrimary = (
    <TableRow hover selected={selected} style={{backgroundColor: `${status}` === '0' ? '#FFAB0029' : '' }}>
      <TableCell> {ent_checklist?.Checklist} </TableCell>
      <TableCell align="center">
        <ListItemText
          primary={ent_checklist?.ent_hangmuc?.Hangmuc}
          secondary={ent_checklist?.ent_hangmuc?.ent_khuvuc?.Tenkhuvuc}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell align="center"> {ent_checklist?.Maso} </TableCell>
      <TableCell align="center"> 
      <ListItemText
          primary={Ketqua}
          secondary={ent_checklist?.Giatridinhdanh ? ent_checklist?.Giatridinhdanh : ent_checklist?.Giatrinhan}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        /> </TableCell>
        <TableCell align="center"> {Gioht} </TableCell>
      <TableCell align="center">
        {(Anh !== null && Anh !== undefined) && (
          <Avatar
            src={`https://lh3.googleusercontent.com/d/${Anh}=s1000?authuser=0`}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          />
        )}
      </TableCell>
      
      <TableCell align="center"> {Ghichu} </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
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
            handleClickOpen();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem> */}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn xóa không?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      />
    </>
  );
}
