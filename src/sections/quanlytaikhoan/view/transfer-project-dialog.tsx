import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Autocomplete,
  TextField,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useGetChucvu, useGetDuan } from 'src/api/khuvuc';
import { useSnackbar } from 'src/components/snackbar';
import { convertToVietnamDate } from 'src/utils/convertToVietnamDate';
import axios from 'axios';

const STORAGE_KEY = 'accessToken';

type Props = {
  open: boolean;
  onClose: () => void;
  user: any;
};

export default function TransferProjectDialog({ open, onClose, user }: Props) {
  const { duan } = useGetDuan();
  const { chucVu } = useGetChucvu();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleTransfer = async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      const data = {
        ID_User: user.ID_User,
        ID_Duan: selectedProject,
        ID_Chucvu: selectedRole,
        Ngay: convertToVietnamDate(selectedDate)
      }
      await axios.post(
        `${process.env.REACT_APP_HOST_API}/user-history/create`, data,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      enqueueSnackbar('Điều chuyển dự án thành công!');
      onClose();
    } catch (error: any) {
      if (error.response) {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: `${error.response.data.message}`,
        });
      } else if (error.request) {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: `Không nhận được phản hồi từ máy chủ`,
        });
      } else {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: `Lỗi gửi yêu cầu`,
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Điều chuyển dự án</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Thông tin hiện tại */}
          <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thông tin hiện tại
            </Typography>
            <Typography variant="body2">
              Họ tên: {user?.Hoten}
            </Typography>
            <Typography variant="body2">
              Chức vụ: {user?.ent_chucvu?.Chucvu}
            </Typography>
            <Typography variant="body2">
              Dự án: {user?.ent_duan?.Duan}
            </Typography>
          </Box>

          {/* Form điều chuyển */}
          <FormControl fullWidth>
            <Autocomplete
              options={duan || []}
              getOptionLabel={(option) => option.Duan}
              value={duan?.find(project => project.ID_Duan === selectedProject) || null}
              onChange={(_, newValue) => {
                setSelectedProject(newValue?.ID_Duan || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn dự án mới"
                  placeholder="Tìm kiếm dự án..."
                />
              )}
              isOptionEqualToValue={(option, value) => option.ID_Duan === value.ID_Duan}
              getOptionDisabled={(option) => option.ID_Duan === user?.ID_Duan}
              noOptionsText="Không tìm thấy dự án"
              loadingText="Đang tải..."
            />
          </FormControl>

          <FormControl fullWidth>
            <Autocomplete
              options={chucVu || []}
              getOptionLabel={(option) => option.Chucvu}
              value={chucVu?.find(role => role.ID_Chucvu === selectedRole) || null}
              onChange={(_, newValue) => {
                setSelectedRole(newValue?.ID_Chucvu || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn chức vụ mới"
                  placeholder="Tìm kiếm chức vụ..."
                />
              )}
              isOptionEqualToValue={(option, value) => option.ID_Chucvu === value.ID_Chucvu}
              noOptionsText="Không tìm thấy chức vụ"
              loadingText="Đang tải..."
            />
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Ngày điều chuyển"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: "Chọn ngày",
                }
              }}
            />
          </LocalizationProvider>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleTransfer}
          disabled={!selectedProject || !selectedRole || !selectedDate}
        >
          Điều chuyển
        </Button>
      </DialogActions>
    </Dialog>
  );
} 