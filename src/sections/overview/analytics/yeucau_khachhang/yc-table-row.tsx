import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from '@mui/material';
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
  1: { label: 'Xác nhận thông tin', color: 'info' as const },
  2: { label: 'Đang xử lý', color: 'info' as const },
  3: { label: 'Hoàn thành', color: 'success' as const },
  4: { label: 'Hủy', color: 'error' as const },
  5: { label: 'Chưa hoàn thành', color: 'error' as const },
} as const;

type Props = {
  row: any;
  selected: boolean;
  onViewRow: VoidFunction;
  onEditRow?: VoidFunction;
  onActionRow?: (id: number, MoTaCongViec: string, TrangThai: number) => void;
  user?: any;
};

export default function YCTableRow({
  row,
  selected,
  onViewRow,
  onEditRow,
  onActionRow,
  user,
}: Props) {
  const { ID_YeuCau, TenKhachHang, Tenyeucau, NoiDung, TrangThai, createdAt, ent_duan } = row;

  const popover = usePopover();
  const confirm = useBoolean();
  const [cancelReason, setCancelReason] = useState('');
  const [action, setAction] = useState<number>();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleOpenDialog = (act: number) => {
    setAction(act);
    confirm.onTrue();
    popover.onClose();
  };

  const handleCloseDialog = () => {
    confirm.onFalse();
    setCancelReason('');
  };

  const handleConfirm = (trangThai: number) => {
    onActionRow?.(ID_YeuCau, cancelReason, trangThai);
    confirm.onFalse();
    setCancelReason('');
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

        {TrangThai === 3 && (
          <MenuItem onClick={() => handleOpenDialog(2)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:info-circle-bold" />
            Chưa hoàn thành
          </MenuItem>
        )}

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

            {TrangThai === 0 && (
              <MenuItem onClick={() => handleConfirm(1)} sx={{ color: 'info.main' }}>
                <Iconify icon="eva:checkmark-circle-2-fill" />
                Xác nhận
              </MenuItem>
            )}

            <MenuItem onClick={() => handleOpenDialog(1)} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Hủy
            </MenuItem>
          </>
        )}
      </CustomPopover>

      <Dialog open={confirm.value} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{action === 1 ? 'Hủy yêu cầu' : 'Chưa hoàn thành'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Vui lòng nhập lý do :</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              action === 1 ? handleConfirm(4) : handleConfirm(5);
            }}
            color="error"
            variant="contained"
            disabled={!cancelReason.trim()}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
