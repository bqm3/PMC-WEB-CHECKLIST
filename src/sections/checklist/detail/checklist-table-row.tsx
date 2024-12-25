
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
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
import './style.css';

// ----------------------------------------------------------------------

type Props = {
  row: TbChecklistCalv;
  calv: ICalv[];
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  setDetailChecklist: any;
  handleClickOpen: any;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  calv,
  handleClickOpen,
  setDetailChecklist
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
  const newViewImage = (items: any[]) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return null; // Không render gì nếu `items` không hợp lệ
    }

    return items.map((url: string, index: number) => (
      <Avatar
        key={`${url}_${index}`} // Đảm bảo key duy nhất
        onClick={() => {
          setDetailChecklist(url)
          handleClickOpen()
        }} // Hành động khi click vào ảnh
        src={url} // Đường dẫn URL ảnh
        alt={url} // Alt text fallback khi ảnh lỗi
        variant="rounded" // Kiểu avatar bo góc
        sx={{
          width: 70,
          height: 70,
          cursor: 'pointer', // Con trỏ hiển thị dạng tay khi hover
          border: '1px solid #ddd', // Thêm viền nhẹ
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Thêm bóng
          transition: 'transform 0.2s ease-in-out', // Hiệu ứng hover
          '&:hover': {
            transform: 'scale(1.1)', // Phóng to nhẹ khi hover
          },
        }}
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
      <TableCell sx={{ width: 120, padding: 0 }}>
        {Anh ? (
          <div
            style={{
              display: 'flex',
              overflowX: 'auto', // Cho phép cuộn ngang
              gap: 4,
              width: 120, // Đặt chiều rộng cố định
              whiteSpace: 'nowrap', // Ngăn hình ảnh xuống dòng
              padding: 4,
            }}
            // CSS cho thanh cuộn nhỏ
            className="custom-scrollbar"
          >
            {newViewImage(Anh?.split(',').map((item: any) => getImageUrls(1, item)))}
          </div>
        ) : (
          <></>
        )}
      </TableCell>


      <TableCell> {Ghichu} </TableCell>

      {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell> */}
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
