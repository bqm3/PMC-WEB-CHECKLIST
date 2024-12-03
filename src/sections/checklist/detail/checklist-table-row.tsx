
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { getImageUrls } from 'src/utils/get-image';
// types
import { ICalv, TbChecklistCalv } from 'src/types/khuvuc';
// components
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
    isCheckListLai,
    Ketqua,
    Anh,
    Gioht,
    Ghichu,
    ent_checklist,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();
  const newViewImage = (item: any) => {
    if (!item || !Array.isArray(item)) return null; // Kiểm tra `item` có phải mảng không

    return item.map((i: any, index: number) => (
      <Avatar
        key={index} // Thêm key để React tránh cảnh báo
        onClick={() => handleClickOpen()}
        src={i} // Hiển thị URL hình ảnh từ `i`
        variant="rounded"
        sx={{ width: 80, height: 80, cursor: 'pointer' }}
      />
    ));
  };

  const renderPrimary = (
    <TableRow
      hover
      selected={selected}
      style={{ backgroundColor: `${ent_checklist?.Tinhtrang}` === '1' ? '#FFAB0029' : '' }}
    >
      <TableCell>
        {' '}
        {ent_checklist?.Checklist}{' '}
        {`${isCheckListLai}` === '1' ? <span style={{ color: 'red' }}>(CheckList lại)</span> : ''}{' '}
      </TableCell>
      <TableCell>
        <ListItemText
          primary={ent_checklist?.ent_hangmuc?.Hangmuc || ''}
          secondary={`${ent_checklist?.ent_khuvuc?.Tenkhuvuc || ''} - ${ent_checklist?.ent_khuvuc?.ent_toanha?.Toanha || ''}`}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell> {ent_checklist?.ent_tang?.Tentang || ''} </TableCell>
      <TableCell>
        {' '}
        {Ketqua} {`${ent_checklist?.isCheck}` === '1' ? `(${ent_checklist?.Giatrinhan})` : ''}
      </TableCell>

      <TableCell> {Gioht} </TableCell>
      <TableCell sx={{ flexDirection: 'row' }}>
        {Anh ? (

          <div style={{ display: 'flex', overflow: 'auto', gap: 4 }}>
            {newViewImage(Anh?.split(',').map((item: any) => getImageUrls(1, item)))}
          </div>

        ) : (
          <></>
        )}
      </TableCell>

      <TableCell> {Ghichu} </TableCell>

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
