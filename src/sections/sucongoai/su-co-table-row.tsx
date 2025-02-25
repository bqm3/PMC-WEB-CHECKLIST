import moment from 'moment';
import { useTheme } from '@mui/material/styles';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { ISucongoai } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

type Props = {
  row: ISucongoai;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  index: number;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
}: Props) {
  const {
    ID_Suco,
    Ngaysuco,
    Giosuco,
    Noidungsuco,
    Tinhtrangxuly,
    Ngayxuly,
    ent_hangmuc,
    Bienphapxuly,
    TenHangmuc,
    Mucdo,
  } = row;

  const theme = useTheme();
  const confirm = useBoolean();

  const popover = usePopover();

  const formattedTime = Giosuco?.slice(0, 5);

  const backgroundColorStyle =
    index % 2 === 0 ? theme.palette.background.paper : theme.palette.grey[500];


  const renderPrimary = (
    <TableRow hover selected={selected} style={{ backgroundColor: "white" }}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>
        SC{ID_Suco}
      </TableCell>
      <TableCell>{TenHangmuc || ent_hangmuc?.Hangmuc}</TableCell>
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
      <TableCell> {Ngayxuly ? moment(Ngayxuly).format('DD-MM-YYYY') : ''} </TableCell>
      <TableCell> {Noidungsuco} </TableCell>
      <TableCell> {Bienphapxuly} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (`${Mucdo}` === '0' && 'success') ||
            (`${Mucdo}` === '1' && 'error') ||
            'default'
          }
        >
          {`${Mucdo}` === '0' && 'Bình thường'}
          {`${Mucdo}` === '1' && 'Nghiêm trọng'}
        </Label>
      </TableCell>
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
          Cập nhật
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
