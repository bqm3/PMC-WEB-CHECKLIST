import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders } from 'src/_mock';
import { useGetHSSE } from 'src/api/khuvuc';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { useAuthContext } from 'src/auth/hooks';

// types
import { IChecklistTableFilters, IHSSE } from 'src/types/khuvuc';
//
import axios from 'axios';
import HSSETableRow from '../hsse-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Ngay_ghi_nhan', label: 'Ngày gửi', width: 100 },
  { id: 'Nguoi_tao', label: 'Người gửi', width: 150 },
  { id: 'Dien_cu_dan', label: 'Điện cư dân', width: 100 },
  { id: 'Dien_cdt', label: 'Điện CĐT', width: 100 },
  { id: 'Nuoc_cu_dan', label: 'Nước cư dân', width: 100 },
  { id: 'Nuoc_cdt', label: 'Nước CĐT', width: 100 },
  { id: 'Xa_thai', label: 'Xả thải', width: 100 },
  { id: 'Rac_sh', label: 'Rác', width: 100 },
  { id: '', width: 10 },
];

const defaultFilters: IChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
};

// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';
export default function GiamsatListView() {
  const { user } = useAuthContext();
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const table = useTable({ defaultOrderBy: 'Ngay_ghi_nhan' });

  const settings = useSettingsContext();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const { hsse } = useGetHSSE();

  const [tableData, setTableData] = useState<IHSSE[]>([]);

  // Export Dialog States
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [fromDate, setFromDate] = useState<any | null>(null);
  const [toDate, setToDate] = useState<any | null>(null);

  // Import Dialog States
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [importError, setImportError] = useState<string>('');

  const handleOpenExportDialog = () => setOpenExportDialog(true);
  const handleCloseExportDialog = () => setOpenExportDialog(false);

  const handleOpenImportDialog = () => {
    setOpenImportDialog(true);
    setSelectedFile(null);
    setImportResult(null);
    setImportError('');
  };
  const handleCloseImportDialog = () => {
    setOpenImportDialog(false);
    setSelectedFile(null);
    setImportResult(null);
    setImportError('');
  };

  useEffect(() => {
    if (hsse?.length > 0) {
      setTableData(hsse);
    }
  }, [hsse]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.hsse.edit(id));
    },
    [router]
  );

  // Handle Export Excel
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleExportExcel = async (fromDate: string, toDate: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/hsse/export-excel`,
        {
          fromDate,
          toDate,
        },
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'HSSE.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle File Selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (!allowedTypes.includes(file.type)) {
        setImportError('Chỉ chấp nhận file Excel (.xlsx, .xls)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setImportError('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
        return;
      }

      setSelectedFile(file);
      setImportError('');
    }
  };

  // Handle Import Excel
  const handleImportExcel = async () => {
    if (!selectedFile) {
      setImportError('Vui lòng chọn file Excel');
      return;
    }

    setImportLoading(true);
    setImportError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/hsse/import-excel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setImportResult(response.data);

      // Refresh data after successful import
      // You might want to call your data refresh function here
      refreshHSSEData();
    } catch (error: any) {
      console.error('Import error:', error);
      setImportError(error.response?.data?.message || 'Có lỗi xảy ra khi import file Excel');
    } finally {
      setImportLoading(false);
    }
  };

  const refreshHSSEData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_API}/hsse/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data?.data) {
        setTableData(response.data.data);
      }
    } catch (error) {
      console.error('Error refreshing HSSE data:', error);
    }
  };

  // Render Import Result
  const renderImportResult = () => {
    if (!importResult) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {importResult.message}
        </Alert>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={`Tổng: ${importResult.results.totalProcessed}`}
            color="default"
            size="small"
          />
          <Chip label={`Tạo mới: ${importResult.results.created}`} color="success" size="small" />
          <Chip label={`Cập nhật: ${importResult.results.updated}`} color="info" size="small" />
          {importResult.results.errors > 0 && (
            <Chip label={`Lỗi: ${importResult.results.errors}`} color="error" size="small" />
          )}
        </Box>

        {importResult.errors && importResult.errors.length > 0 && (
          <Box>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Chi tiết lỗi:
            </Typography>
            {importResult.errors.slice(0, 5).map((error: any, index: number) => (
              <Typography key={index} variant="caption" display="block" color="error">
                Dòng {error.row}: {error.message}
              </Typography>
            ))}
            {importResult.errors.length > 5 && (
              <Typography variant="caption" color="error">
                ... và {importResult.errors.length - 5} lỗi khác
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Danh sách HSSE"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              { name: 'Danh sách' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
          <Stack direction="row" spacing={2}>
            <LoadingButton
              color="primary"
              size="large"
              type="submit"
              variant="soft"
              onClick={handleOpenExportDialog}
            >
              Export Excel
            </LoadingButton>
            {`${user?.ent_chucvu?.Role}` === `10` && (
            <LoadingButton
              color="success"
              size="large"
              type="submit"
              variant="soft"
              onClick={handleOpenImportDialog}
            >
              Import Excel
            </LoadingButton>
            )}

          </Stack>
        </Stack>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <HSSETableRow
                        key={row.ID}
                        row={row}
                        selected={table.selected.includes(`${row.ID}`)}
                        onViewRow={() => handleViewRow(`${row.ID}`)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered?.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      {/* Export Dialog */}
      <Dialog open={openExportDialog} onClose={handleCloseExportDialog}>
        <DialogTitle>Chọn khoảng thời gian Export</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <DatePicker
              label="Từ ngày"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              maxDate={moment()} // Không cho phép chọn quá ngày hiện tại
              shouldDisableDate={(date) => moment(date).isAfter(moment(), 'day')} // Thêm validation bổ sung
            />
            <DatePicker
              label="Đến ngày"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              maxDate={moment()} // Không cho phép chọn quá ngày hiện tại
              minDate={fromDate} // Đảm bảo ngày kết thúc >= ngày bắt đầu
              shouldDisableDate={(date) => {
                // Không cho phép chọn ngày trong tương lai
                if (moment(date).isAfter(moment(), 'day')) return true;
                // Không cho phép chọn ngày trước ngày bắt đầu
                if (fromDate && moment(date).isBefore(moment(fromDate), 'day')) return true;
                return false;
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExportDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => {
              // Validation thêm trước khi export
              const from = moment(fromDate);
              const to = moment(toDate);

              if (from.isAfter(moment(), 'day') || to.isAfter(moment(), 'day')) {
                alert('Không thể chọn ngày trong tương lai!');
                return;
              }

              if (from.isAfter(to)) {
                alert('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
                return;
              }

              handleExportExcel(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'));
              handleCloseExportDialog();
            }}
            disabled={!fromDate || !toDate}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
      {/* Import Dialog */}
      <Dialog open={openImportDialog} onClose={handleCloseImportDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Import Excel</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* File Upload Section */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Chọn file Excel (.xlsx, .xls)
              </Typography>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={{ width: '100%', padding: '8px' }}
              />
              {selectedFile && (
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>

            {/* Instructions */}
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Hướng dẫn:</strong>
                <br />• File Excel phải có các cột: STT, Ngày ghi nhận, Tên dự án
                <br />• Ngày ghi nhận format: yyyy-mm-dd
                <br />• Dữ liệu sẽ được cập nhật nếu đã tồn tại, tạo mới nếu chưa có
              </Typography>
            </Alert>

            {/* Error Display */}
            {importError && <Alert severity="error">{importError}</Alert>}

            {/* Loading */}
            {importLoading && (
              <Box>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Đang xử lý file Excel...
                </Typography>
              </Box>
            )}

            {/* Import Results */}
            {renderImportResult()}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>{importResult ? 'Đóng' : 'Hủy'}</Button>
          {!importResult && (
            <LoadingButton
              variant="contained"
              onClick={handleImportExcel}
              loading={importLoading}
              disabled={!selectedFile || importLoading}
              color="success"
            >
              Import
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IHSSE[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
}) {
  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(b[0], a[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
