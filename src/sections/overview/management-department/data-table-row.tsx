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
import { IKhuvuc, ISucongoai, ITang } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';

// ----------------------------------------------------------------------

type Props = {
  row: ISucongoai;
  index: number;
  // selected: boolean;
  // onViewRow: VoidFunction;
  // onSelectRow: VoidFunction;
  // onDeleteRow: VoidFunction;
};

export default function DataTableRow({
  row,
  index,
} // selected,
// onViewRow,
// onSelectRow,
// onDeleteRow,
: Props) {
  const {
    ID_Suco,
    ID_KV_CV,
    ID_Hangmuc,
    Ngaysuco,
    Giosuco,
    Noidungsuco,
    Duongdancacanh,
    ID_User,
    Tinhtrangxuly,
    Ngayxuly,
    isDelete,
    ent_hangmuc,
    ent_user,
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const formattedTime = Giosuco.slice(0, 5);

  const backgroundColorStyle = index % 2 !== 0 ? '#f3f6f4' : '';

  const renderPrimary = (
    <TableRow hover>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>
        <Box
          // onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          SC{ID_Suco}
        </Box>
      </TableCell>
      <TableCell>{ent_hangmuc?.Hangmuc}</TableCell>
      <TableCell>
        <ListItemText
          primary={moment(Ngaysuco).format('DD-MM-YYYY')}
          secondary={formattedTime}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />{' '}
      </TableCell>
      <TableCell> {moment(Ngayxuly)?.format('DD-MM-YYYY')} </TableCell>
      <TableCell> {Noidungsuco} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (`${Tinhtrangxuly}` === '2' && 'success') ||
            (`${Tinhtrangxuly}` === '1' && 'warning') ||
            (`${Tinhtrangxuly}` === '0' && 'error') ||
            'default'
          }
        >
          {`${Tinhtrangxuly}` === '0' && 'Chưa xử lý'}
          {`${Tinhtrangxuly}` === '1' && 'Đang xử lý'}
          {`${Tinhtrangxuly}` === '2' && 'Đã xử lý'}
        </Label>
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

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn xóa không?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      /> */}
    </>
  );
}
