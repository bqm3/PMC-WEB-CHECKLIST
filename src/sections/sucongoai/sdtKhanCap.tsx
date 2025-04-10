import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

// ----------------------------------------------------------------------

interface EmergencyPhoneDialogProps {
  currentPhone?: string;
  onSuccess?: (newPhone: string) => void;
}

export default function EmergencyPhoneDialog({
  currentPhone = '',
  onSuccess,
}: EmergencyPhoneDialogProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(currentPhone);
  const { enqueueSnackbar } = useSnackbar();
  const accessToken = localStorage.getItem(STORAGE_KEY);

  useEffect(() => {
    setPhoneNumber(currentPhone)
  }, [currentPhone])

  const handleOpen = (): void => {
    setOpen(true);
    setPhoneNumber(currentPhone);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleUpdateEmergencyPhone = async (): Promise<void> => {
    if (!phoneNumber.trim()) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: 'Vui lòng nhập số điện thoại khẩn cấp',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `https://checklist.pmcweb.vn/be/api/v2/ent_duan/update-sdt-khan-cap`,
        { SDTKhanCap: phoneNumber },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Cập nhật số điện thoại khẩn cấp thành công!',
        });

        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(phoneNumber);
        }

        handleClose();
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      if (error.response) {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: error.response.data.message || 'Cập nhật không thành công',
        });
      } else {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: 'Không thể kết nối đến máy chủ',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const phoneRegex = /^[0-9]+$/;
  const isValidPhone = !phoneNumber?.trim() || phoneRegex?.test(phoneNumber);

  return (
    <>
      <Tooltip title={currentPhone ? 'Cập nhật SĐT khẩn cấp' : 'Thêm SĐT khẩn cấp'}>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Số điện thoại khẩn cấp: <strong>{phoneNumber || 'Chưa thiết lập'}</strong>
          </span>
          <IconButton color="primary" onClick={handleOpen} size="small">
            <Iconify icon={currentPhone ? 'eva:edit-fill' : 'eva:plus-fill'} />
          </IconButton>
        </div>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>
          {currentPhone ? 'Cập nhật số điện thoại khẩn cấp' : 'Thêm số điện thoại khẩn cấp'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ p: 1, pt: 3 }}>
            <TextField
              fullWidth
              label="Số điện thoại khẩn cấp"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!isValidPhone}
              helperText={!isValidPhone ? 'Số điện thoại chỉ được chứa các chữ số' : ''}
              placeholder="Nhập số điện thoại khẩn cấp"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Hủy
          </Button>

          <LoadingButton
            variant="contained"
            loading={loading}
            disabled={!isValidPhone}
            onClick={handleUpdateEmergencyPhone}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
