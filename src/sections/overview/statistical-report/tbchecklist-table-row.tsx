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
import { IKhuvuc, IHangMuc, IChecklist, ICalv, ITbChecklist } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: ITbChecklist;
  calv: ICalv[];
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onOpenChecklist: VoidFunction;
  onRemoveChecklist: VoidFunction;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onOpenChecklist,
  onRemoveChecklist,
  calv,
}: Props) {
  const {
    ID_ChecklistC,
    ID_Duan,
    ID_KhoiCV,
    Ngay,
    ID_Calv,
    ID_Giamsat,
    TongC,
    Tong,
    Giobd,
    Giokt,
    Ghichu,
    Tinhtrang,
    Giochupanh1,
    Anh1,
    Giochupanh2,
    Anh2,
    Giochupanh3,
    Anh3,
    Giochupanh4,
    Anh4,
    ent_giamsat,
    ent_khoicv,
    ent_calv,
  } = row;

  const confirm = useBoolean();
  const confirm2 = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();
  const popover2 = usePopover();

  const [year, month, day] = Ngay.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>{formattedDate}</TableCell>

      <TableCell align="center"> {ent_giamsat?.Hoten} </TableCell>
      <TableCell align="center">
        {' '}
       {Tong}
      </TableCell>

      <TableCell align="center">{Giobd}</TableCell>
      <TableCell align='center'>{Giokt}</TableCell>
      <TableCell align="center">
        <Label variant="soft" color="secondary">
          {ent_calv?.Tenca}
        </Label>
      </TableCell>
      <TableCell align="center">
        {' '}
        <Label
          variant="soft"
          color={
            (`${ID_KhoiCV}` === '1' && 'success') ||
            (`${ID_KhoiCV}` === '2' && 'warning') ||
            (`${ID_KhoiCV}` === '3' && 'error') ||
            'default'
          }
        >
          {ent_khoicv.KhoiCV}
        </Label>
      </TableCell>

      <TableCell align="center">
        {' '}
        <Label
          variant="soft"
          color={
            (`${Tinhtrang}` === '0' && 'info') || (`${Tinhtrang}` === '1' && 'default') || 'default'
          }
        >
          {`${Tinhtrang}` === '0' ? 'Đang mở' : 'Đã khóa'}
        </Label>
      </TableCell>
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
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem chi tiết
        </MenuItem>
        {`${Tinhtrang}` === '1' && (
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              
            }}
          >
            <Iconify color="error" icon="mdi:lock-open-outline" />
            Mở ca
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            confirm2.onTrue();
            popover2.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>

        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Mở ca"
          content="Bạn có muốn mở ca hiện tại không?"
          action={
            <Button variant="contained" color="success" onClick={onOpenChecklist}>
              Có
            </Button>
          }
        />

<ConfirmDialog
          open={confirm2.value}
          onClose={confirm2.onFalse}
          title="Xóa ca làm việc"
          content="Bạn có muốn xóa ca làm việc không?"
          action={
            <Button variant="contained" color="success" onClick={onRemoveChecklist}>
              Có
            </Button>
          }
        />
      </CustomPopover>

      
    </>
  );
}
