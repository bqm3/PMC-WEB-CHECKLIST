import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { Icon } from '@iconify/react';
import { useAuthContext } from 'src/auth/hooks';

interface BansucoDialogProps {
  isMenu?: boolean;
}

export default function BansucoDialog({ isMenu = false }: BansucoDialogProps) {
  const { user } = useAuthContext();
  const [open, setOpen] = useState<any>(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [formOpen, setFormOpen] = useState<any>(false);
  const [formMode, setFormMode] = useState<any>('add'); // 'add' or 'edit'
  const [currentEmployee, setCurrentEmployee] = useState<any>({
    ma_nv: '',
    ho_ten: '',
    khoi: '',
    sdt: '',
    email: '',
  });
  const [snackbar, setSnackbar] = useState<any>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<any>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<string>('all');

  // Check if the user has admin privileges (role == 10)
  const isAdmin = `${user?.ent_chucvu?.Role}` === `10`;

  const handleOpen = () => {
    setOpen(true);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_API}/bansuco`);
      if (response.data.success) {
        setEmployees(response.data.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleFormOpen = (mode: string, employee: any = null) => {
    setFormMode(mode);
    if (mode === 'edit' && employee) {
      setCurrentEmployee({ ...employee });
    } else {
      setCurrentEmployee({
        ma_nv: '',
        ho_ten: '',
        khoi: currentTab !== 'all' ? currentTab : '',
        sdt: '',
        email: '',
      });
    }
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCurrentEmployee({
      ...currentEmployee,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (formMode === 'add') {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/bansuco/create`,
          currentEmployee
        );
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: 'Thêm thành công',
            severity: 'success',
          });
        }
      } else {
        const response = await axios.put(
          `${process.env.REACT_APP_HOST_API}/bansuco/update/${currentEmployee.id}`,
          currentEmployee
        );
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: 'Cập nhật thành công',
            severity: 'success',
          });
        }
      }
      handleFormClose();
      fetchData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: `Lỗi: ${err.message || 'Không thể thực hiện thao tác'}`,
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (employee: any) => {
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!employeeToDelete) return;

      const response = await axios.put(
        `${process.env.REACT_APP_HOST_API}/bansuco/delete/${employeeToDelete.id}`
      );
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Xóa thành công',
          severity: 'success',
        });
        fetchData();
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: `Lỗi: ${err.message || 'Không thể xóa'}`,
        severity: 'error',
      });
    } finally {
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const filteredEmployees = employees.filter((employee) => {
    if (currentTab === 'all') return true;
    return employee.khoi === currentTab;
  });

  const getKhoiLabel = (id: string) => {
    switch (id) {
      case 'kt':
        return { label: 'Kỹ thuật', color: 'success' };
      case 'dv':
        return { label: 'Dịch vụ', color: 'info' };
      case 'tc':
        return { label: 'Tài chính', color: 'warning' };
      case 'pl':
        return { label: 'Pháp lý', color: 'secondary' };
      default:
        return { label: '—', color: 'default' };
    }
  };

  const khoiCV = (id: string) => {
    const khoiInfo = getKhoiLabel(id);
    return (
      <Label
        variant="soft"
        color={khoiInfo.color as any}
        sx={{ fontWeight: 500, px: 1.5, py: 0.5 }}
      >
        {khoiInfo.label}
      </Label>
    );
  };

  // Count employees by department
  const employeeCounts = {
    all: employees.length,
    kt: employees.filter((emp) => emp.khoi === 'kt').length,
    dv: employees.filter((emp) => emp.khoi === 'dv').length,
    tc: employees.filter((emp) => emp.khoi === 'tc').length,
    pl: employees.filter((emp) => emp.khoi === 'pl').length,
  };

  const onKeyDown = (e: any) => {
    // Ngăn hành vi mặc định nếu cần
    if (['d', 'c', 'b'].includes(e.key.toLowerCase())) {
      e.stopPropagation();
    }
  }

  return (
    <>
      {isMenu ? (
        <MenuItem onClick={handleOpen}>
          <Iconify icon="mdi:file-document-outline" style={{ marginRight: '8px' }} />
          Ban sự cố
        </MenuItem>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<Icon icon="mdi:account-group" />}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
        >
          Ban sự cố
        </Button>
      )}

      {/* Main Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            bgcolor: '#EBF5FF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #E0E7FF',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="mdi:account-group" fontSize={24} style={{ color: '#2563EB' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E40AF' }}>
              Thông Tin Ban Sự Cố
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {isAdmin && (
              <Button
                startIcon={<Icon icon="mdi:plus" />}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleFormOpen('add')}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  boxShadow: 2,
                  mr: 1,
                }}
              >
                Thêm mới
              </Button>
            )}
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ bgcolor: '#FEE2E2', color: '#DC2626' }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#F9FAFB' }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="mdi:view-grid" />
                  <span>Tất cả</span>
                  <Chip
                    label={employeeCounts.all}
                    size="small"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              value="all"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="mdi:wrench" color="#0F766E" />
                  <span>Kỹ thuật</span>
                  <Chip
                    label={employeeCounts.kt}
                    size="small"
                    sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#ECFDF5', color: '#0F766E' }}
                  />
                </Box>
              }
              value="kt"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="mdi:handshake" color="#0284C7" />
                  <span>Dịch vụ</span>
                  <Chip
                    label={employeeCounts.dv}
                    size="small"
                    sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#EFF6FF', color: '#0284C7' }}
                  />
                </Box>
              }
              value="dv"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="mdi:cash-multiple" color="#B45309" />
                  <span>Tài chính</span>
                  <Chip
                    label={employeeCounts.tc}
                    size="small"
                    sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#FFFBEB', color: '#B45309' }}
                  />
                </Box>
              }
              value="tc"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="mdi:scale-balance" color="#5B21B6" />
                  <span>Pháp lý</span>
                  <Chip
                    label={employeeCounts.pl}
                    size="small"
                    sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#F5F3FF', color: '#5B21B6' }}
                  />
                </Box>
              }
              value="pl"
            />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ padding: 2 }}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, color: '#DC2626' }}>
              <Typography variant="h6">Đã xảy ra lỗi: {error}</Typography>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 1, borderRadius: 2, overflow: 'hidden' }}
            >
              <Table>
                <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mã NV</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Họ Tên</TableCell>
                    {currentTab === 'all' && (
                      <TableCell sx={{ fontWeight: 600 }}>Phụ trách</TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 600 }}>Chức vụ</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>SĐT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    {isAdmin && (
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Thao tác
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        // eslint-disable-next-line no-nested-ternary
                        colSpan={currentTab === 'all' ? (isAdmin ? 7 : 6) : isAdmin ? 6 : 5}
                        align="center"
                        sx={{ py: 3 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            py: 3,
                          }}
                        >
                          <Icon icon="mdi:folder-open-outline" fontSize={40} color="#9CA3AF" />
                          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Không có dữ liệu
                          </Typography>
                          {isAdmin && currentTab !== 'all' && (
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<Icon icon="mdi:plus" />}
                              onClick={() => handleFormOpen('add')}
                              sx={{ mt: 2, textTransform: 'none', borderRadius: 1.5 }}
                            >
                              Thêm {getKhoiLabel(currentTab).label}
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee: any) => (
                      <TableRow
                        key={employee.id}
                        sx={{
                          '&:hover': { bgcolor: '#F9FAFB' },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell>{employee.id}</TableCell>
                        <TableCell>
                          <Chip
                            label={employee.ma_nv}
                            size="small"
                            sx={{
                              bgcolor: '#E0F2FE',
                              color: '#0369A1',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{employee.ho_ten}</TableCell>
                        {currentTab === 'all' && <TableCell>{khoiCV(employee?.khoi)}</TableCell>}
                        <TableCell>{employee.chuc_vu || '—'}</TableCell>
                        <TableCell>{employee.sdt || '—'}</TableCell>
                        <TableCell>{employee.email || '—'}</TableCell>
                        {isAdmin && (
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Sửa thông tin">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleFormOpen('edit', employee)}
                                  sx={{
                                    bgcolor: '#EFF6FF',
                                    '&:hover': { bgcolor: '#DBEAFE' },
                                  }}
                                >
                                  <Icon icon="mdi:pencil" fontSize={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleDeleteClick(employee)}
                                  sx={{
                                    bgcolor: '#FEF2F2',
                                    '&:hover': { bgcolor: '#FEE2E2' },
                                  }}
                                >
                                  <Icon icon="mdi:delete" fontSize={18} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Form Dialog - Only accessible to admins */}
      {isAdmin && (
        <Dialog
          open={formOpen}
          onClose={handleFormClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              bgcolor: '#EBF5FF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid #E0E7FF',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Icon
                icon={formMode === 'add' ? 'mdi:account-plus' : 'mdi:account-edit'}
                fontSize={22}
                style={{ color: formMode === 'add' ? '#059669' : '#2563EB' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formMode === 'add' ? 'Thêm mới' : 'Cập nhật thông tin'}
              </Typography>
            </Box>
            <IconButton
              onClick={handleFormClose}
              size="small"
              sx={{ bgcolor: '#FEE2E2', color: '#DC2626' }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ padding: '24px 24px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Mã"
                name="ma_nv"
                value={currentEmployee.ma_nv}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: '#6B7280' }}>
                      <Icon icon="mdi:id-card" fontSize={20} />
                    </Box>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <TextField
                fullWidth
                label="Họ tên"
                name="ho_ten"
                value={currentEmployee.ho_ten}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: '#6B7280' }}>
                      <Icon icon="mdi:account" fontSize={20} />
                    </Box>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <TextField
                select
                fullWidth
                label="Khối"
                name="khoi"
                value={currentEmployee.khoi || ''}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: '#6B7280' }}>
                      <Icon icon="mdi:domain" fontSize={20} />
                    </Box>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              >
                <option value="">-- Chọn Khối --</option>
                <option value="kt">Phụ trách kỹ thuật</option>
                <option value="dv">Phụ trách dịch vụ</option>
                <option value="tc">Phụ trách tài chính</option>
                <option value="pl">Phụ trách pháp lý</option>
              </TextField>
              <TextField
                fullWidth
                label="Chức vụ"
                name="chuc_vu"
                value={currentEmployee.chuc_vu}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: '#6B7280' }}>
                      <Icon icon="mdi:briefcase-outline" fontSize={20} />
                    </Box>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                name="sdt"
                value={currentEmployee.sdt}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: '#6B7280' }}>
                      <Icon icon="mdi:phone" fontSize={20} />
                    </Box>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={currentEmployee.email}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                variant="outlined"
                type="email"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: '#6B7280' }}>
                      <Icon icon="mdi:email" fontSize={20} />
                    </Box>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
            <Button
              onClick={handleFormClose}
              color="inherit"
              startIcon={<Icon icon="mdi:cancel" />}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color={formMode === 'add' ? 'success' : 'primary'}
              startIcon={<Icon icon={formMode === 'add' ? 'mdi:plus' : 'mdi:content-save'} />}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 'medium',
                boxShadow: 2,
                px: 3,
              }}
            >
              {formMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog - Only accessible to admins */}
      {isAdmin && (
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: { borderRadius: 2, overflow: 'hidden' },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: '#991B1B',
            }}
          >
            <Icon icon="mdi:alert-circle" fontSize={24} style={{ color: '#DC2626' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Xác nhận xóa
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Typography variant="body1">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Bạn có chắc chắn muốn xóa <strong>"{employeeToDelete?.ho_ten}"</strong> khỏi hệ thống?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Thao tác này không thể hoàn tác sau khi xác nhận.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              color="inherit"
              startIcon={<Icon icon="mdi:cancel" />}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              startIcon={<Icon icon="mdi:delete" />}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 'medium',
                boxShadow: 2,
              }}
            >
              Xác nhận xóa
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            alignItems: 'center',
          }}
          iconMapping={{
            success: <Icon icon="mdi:check-circle" fontSize={24} />,
            error: <Icon icon="mdi:alert-circle" fontSize={24} />,
            info: <Icon icon="mdi:information" fontSize={24} />,
            warning: <Icon icon="mdi:alert" fontSize={24} />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
