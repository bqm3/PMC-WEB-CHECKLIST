import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import Chip from '@mui/material/Chip';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// types
// import { YeuCauKhachHang } from 'src/types/khuvuc';

// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';

// ----------------------------------------------------------------------

// Trạng thái mapping
const TRANG_THAI_MAP = {
  0: { label: 'Chờ xử lý', color: 'warning' as const },
  1: { label: 'Đang xử lý', color: 'info' as const },
  2: { label: 'Hoàn thành', color: 'success' as const },
  3: { label: 'Hủy', color: 'error' as const },
} as const;

type Props = {
  row: any;
  selected: boolean;
  onViewRow: VoidFunction;
  onEditRow?: VoidFunction;
onDeleteRow?: (id: number, MoTaCongViec: string) => void;
  user?: any;
};

export default function YCTableRow({
  row,
  selected,
  onViewRow,
  onEditRow,
  onDeleteRow,
  user,
}: Props) {
  const { ID_YeuCau, TenKhachHang, Tenyeucau, NoiDung, TrangThai, createdAt, ent_duan } = row;

  const popover = usePopover();
  const confirm = useBoolean();
  const [cancelReason, setCancelReason] = useState('');

  const handleDelete = () => {
    confirm.onTrue();
    popover.onClose();
  };

  const handleConfirmDelete = () => {
    onDeleteRow?.(ID_YeuCau, cancelReason);
    confirm.onFalse();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{ID_YeuCau}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{ent_duan.Duan || '-'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{TenKhachHang || '-'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{Tenyeucau || '-'}</TableCell>

      <TableCell sx={{ maxWidth: 200 }}>{truncateText(NoiDung)}</TableCell>

      <TableCell>
        <Chip
          label={
            TRANG_THAI_MAP[TrangThai as keyof typeof TRANG_THAI_MAP]?.label || 'Không xác định'
          }
          color={TRANG_THAI_MAP[TrangThai as keyof typeof TRANG_THAI_MAP]?.color || 'default'}
          size="small"
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {createdAt ? moment(createdAt).format('YYYY/MM/DD HH:mm:ss') : '-'}
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
        sx={{ width: 160 }}
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

        {[0, 1, 4, 5, 10].includes(user?.ent_chucvu?.Role) && (
          <>
            {/* {onEditRow && (
              <MenuItem
                onClick={() => {
                  onEditRow();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:pen-bold" />
                Chỉnh sửa
              </MenuItem>
            )} */}

            {onDeleteRow && (
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Iconify icon="solar:trash-bin-trash-bold" />
                Hủy
              </MenuItem>
            )}
          </>
        )}
      </CustomPopover>

      <Dialog open={confirm.value} onClose={confirm.onFalse}>
        <DialogTitle>Hủy yêu cầu</DialogTitle>
        <DialogContent>
          <DialogContentText>Vui lòng nhập lý do hủy yêu cầu này:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do hủy"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm.onFalse}>Hủy</Button>
          <Button
            onClick={() => {
              handleConfirmDelete();
              setCancelReason('');
            }}
            color="error"
            variant="contained"
            disabled={!cancelReason.trim()}
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
