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
import { IKhuvuc, IHangMuc, IChecklist, ICalv } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IChecklist;
  calv: ICalv[];
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  calv,
}: Props) {
  const {
    ID_Khuvuc,
    ID_Hangmuc,
    Checklist,
    Giatridinhdanh,
    Giatrinhan,
    Tieuchuan,
    MaQrCode,
    ent_hangmuc,
    ent_tang,
    Sothutu,
    Maso,
    sCalv,
    calv_1,
    calv_2,
    calv_3,
    calv_4,
    ent_calv,
    Tinhtrang
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const calvIds = [calv_1, calv_2, calv_3, calv_4];
  const shiftNames = calvIds
    .map((calvId) => {
      // Tìm ca làm việc trong sCalv bằng ID_Calv
      const workShift = calv?.find((shift) => `${shift.ID_Calv}` === `${calvId}`);
      // Nếu tìm thấy, trả về tên của ca làm việc
      return workShift ? workShift.Tenca : null;
    })
    // Lọc ra các phần tử null trong trường hợp ID_Calv không tồn tại trong sCalv
    .filter((name) => name !== null)
    // Kết hợp tên các ca làm việc thành một chuỗi với dấu phẩy
    .join(', ');

  const shiftNamesArray = shiftNames.split(', ');

  console.log('shiftNamesArray', shiftNamesArray)

  // Tạo các nhãn từ mảng các tên ca làm việc
  const labels = shiftNamesArray.map((name, index) => (
    <Label key={index} variant="soft" 
      color={
        (`${ent_hangmuc.ID_KhoiCV}` === '1' && 'success') ||
        (`${ent_hangmuc.ID_KhoiCV}` === '2' && 'warning') ||
        (`${ent_hangmuc.ID_KhoiCV}` === '3' && 'error') ||
        'default'
      }
     style={{marginTop: 4}}>
      {name}
    </Label>
  ));

  const renderPrimary = (
    <TableRow hover selected={selected} style={{backgroundColor: `${Tinhtrang}` === '1' ? '#FF563029' : '' }}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={Checklist}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell align="center"> {Giatridinhdanh} </TableCell>
      <TableCell align="center"> {Giatrinhan} </TableCell>
      <TableCell align="center"> {ent_tang?.Tentang} </TableCell>
      <TableCell align="center"> {Sothutu} </TableCell>
      <TableCell align="center"> {Maso} </TableCell>
      <TableCell align="center">  <ListItemText
          primary={ent_hangmuc?.Hangmuc}
          secondary={ent_hangmuc?.MaQrCode}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        /></TableCell>
      <TableCell width={140}>{labels}</TableCell>

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
          Xem
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
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
