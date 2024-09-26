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
import { IKhuvuc, IHangMuc, IChecklist, ICalv, IKhoiCV } from 'src/types/khuvuc';
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
  khoiCV: IKhoiCV[];
  index: number;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  calv,
  khoiCV,
  index
}: Props) {
  const {
    ID_Checklist,
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
    Tinhtrang,
    ent_khuvuc,
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const shiftNamesKhoiCV = ent_khuvuc.ent_khuvuc_khoicvs
    .map((calvId) => {
      const workShift = khoiCV?.find((shift) => `${shift.ID_KhoiCV}` === `${calvId.ID_KhoiCV}`);
      return workShift ? calvId.ent_khoicv.KhoiCV : null;
    })
    .filter((name) => name !== null);

  const labelsKhoiCV = shiftNamesKhoiCV.map((name) => (
    <Label
      key={name}
      variant="soft"
      color={
        (`${name}` === 'Khối làm sạch' && 'success') ||
        (`${name}` === 'Khối kỹ thuật' && 'warning') ||
        (`${name}` === 'Khối bảo vệ' && 'error') ||
        'default'
      }
      style={{margin: 2}}
    >
      {name}
    </Label>
  ));
  let backgroundColorStyle;

if (Tinhtrang === '1') {
  backgroundColorStyle = '#FF563029';
} else {
  backgroundColorStyle = (index % 2 !== 0) ? '#f3f6f4' : '';
}
  const renderPrimary = (
    <TableRow
      hover
      selected={selected}
      style={{ backgroundColor: backgroundColorStyle }}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          C-{ID_Checklist}
        </Box>
      </TableCell>
      <TableCell>
        <ListItemText primary={Checklist} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      {/* <TableCell align="center"> {Giatrinhan} </TableCell> */}
      <TableCell align="center">
        {' '}
        <ListItemText
          primary={ent_hangmuc?.Hangmuc}
          secondary={ent_hangmuc?.MaQrCode}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell align="center">
        {' '}
        <ListItemText
          primary={ent_khuvuc?.Tenkhuvuc}
          secondary={ent_khuvuc?.ent_toanha?.Toanha}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell align="center"> {labelsKhoiCV} </TableCell>
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
