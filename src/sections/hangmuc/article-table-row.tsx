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
import { IKhuvuc, IHangMuc, IKhoiCV } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IHangMuc;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onQrRow: VoidFunction;
  khoiCV: IKhoiCV[];
  index: number;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onQrRow,
  khoiCV,
  index,
}: Props) {
  const { ID_Khuvuc, ID_Hangmuc, Hangmuc, Tieuchuankt, Important, MaQrCode, ent_khuvuc } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  let ID_KhoiCVsArray: number[];

  // Kiểm tra xem ID_KhoiCVs là một mảng hoặc không
  if (Array.isArray(ent_khuvuc.ID_KhoiCVs)) {
    // Kiểm tra xem các phần tử trong mảng có phải là số không và chuyển đổi
    ID_KhoiCVsArray = ent_khuvuc.ID_KhoiCVs.filter((item) => typeof item === 'number').map(Number);
  } else if (typeof ent_khuvuc.ID_KhoiCVs === 'string') {
    // Chuyển đổi từ chuỗi sang mảng số
    ID_KhoiCVsArray = ent_khuvuc.ID_KhoiCVs.replace(/\[|\]/g, '') // Loại bỏ dấu ngoặc vuông
      .split(', ') // Phân tách các số
      .map((item) => Number(item?.trim())) // Chuyển đổi từ chuỗi sang số
      .filter((item) => !Number.isNaN(item)); // Loại bỏ các giá trị không hợp lệ
  } else {
    // Trong trường hợp ID_KhoiCVs không phải là mảng hoặc chuỗi, ta gán một mảng rỗng
    ID_KhoiCVsArray = [];
  }

  const shiftNames = ent_khuvuc.ent_khuvuc_khoicvs
    .map((calvId) => {
      const workShift = khoiCV?.find(
        (shift: any) => `${shift.ID_KhoiCV}` === `${calvId.ID_KhoiCV}`
      );
      return workShift ? calvId.ent_khoicv.KhoiCV : null;
    })
    .filter((name) => name !== null);

  const labels = shiftNames.map((name, i) => (
    <Label
      key={i}
      variant="soft"
      color={
        (`${name}` === 'Khối làm sạch' && 'success') ||
        (`${name}` === 'Khối kỹ thuật' && 'warning') ||
        (`${name}` === 'Khối bảo vệ' && 'error') ||
        'default'
      }
      style={{ marginTop: 4, marginLeft: 4 }}
    >
      {name}
    </Label>
  ));

  const backgroundColorStyle = index % 2 !== 0 ? '#f3f6f4' : '';
  const renderPrimary = (
    <TableRow hover selected={selected} style={{ backgroundColor: backgroundColorStyle }}>
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
          HM{ID_Hangmuc}
        </Box>
      </TableCell>

      <TableCell>{Hangmuc}</TableCell>
      <TableCell> {MaQrCode} </TableCell>

      <TableCell>
        <ListItemText
          primary={ent_khuvuc?.Tenkhuvuc}
          secondary={ent_khuvuc?.ent_toanha?.Toanha}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />{' '}
      </TableCell>
      <TableCell>
        {`${Important}` === '0' ? (
          ''
        ) : (
          <Label variant="soft" color="info" >
            Quan trọng
          </Label>
        )}
      </TableCell>
      <TableCell>{labels}</TableCell>
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
            onQrRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:qrcode" />
          Ảnh Qr
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
