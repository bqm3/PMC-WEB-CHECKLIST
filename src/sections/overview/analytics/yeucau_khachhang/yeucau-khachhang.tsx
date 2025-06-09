import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Backdrop,
  LinearProgress,
} from '@mui/material';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useGetYeuCauKH, useGetPhanHeAll } from 'src/api/khuvuc';
import { IChecklistTableFilters } from 'src/types/khuvuc';
import { useAuthContext } from 'src/auth/hooks';
import {
  createYeuCau,
  updateYeuCau,
  createFeedback,
  FormData,
  FeedbackFormData,
} from './yc_api';
import YCTableRow from './yc-table-row';
import YCTableToolbar from './yc-table-toolbar';
import YCTableFiltersResult from './yc-table-filters-result';
import CreateFormDialog from './yc-create-update';
import DetailDialog from './yc-detail';


// Types
interface YeuCauKhachHang {
  ID_YeuCau: number;
  ID_Phanhe: number;
  ID_Duan?: number;
  ID_Useryc?: number;
  TenKhachHang: string;
  Tenyeucau: string;
  NoiDung: string;
  TrangThai: number;
  isDelete: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomerRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Table configuration
const TABLE_HEAD = [
  { id: 'ID', label: 'ID', width: 10 },
  { id: 'ID_Duan', label: 'Dự án', width: 150 },
  { id: 'TenKhachHang', label: 'Tên khách hàng', width: 150 },
  { id: 'Tenyeucau', label: 'Tên yêu cầu', width: 100 },
  { id: 'NoiDung', label: 'Nội dung', width: 100 },
  { id: 'Trangthai', label: 'Trạng thái', width: 100 },
  { id: 'createdAt', label: 'Ngày tạo', width: 100 },
  { id: '', width: 10 },
];

const DEFAULT_FILTERS: IChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
};

const options = [
  { value: '0', label: 'Chờ xử lý' },
  { value: '1', label: 'Đang xử lý' },
  { value: '2', label: 'Hoàn thành' },
  { value: '3', label: 'Đã hủy' },
]

// Loading Overlay Component
const LoadingOverlay = ({ loading, children }: { loading: boolean; children: React.ReactNode }) => (
  <Box position="relative">
    {loading && (
      <>
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        />
        <Backdrop
          sx={{
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          open={loading}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="textSecondary">
            Đang xử lý...
          </Typography>
        </Backdrop>
      </>
    )}
    <Box sx={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>{children}</Box>
  </Box>
);

// Main component
export default function CustomerRequestDialog({ isOpen, setIsOpen }: CustomerRequestDialogProps) {
  const table = useTable();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { yeucau: requests = [], yeucauMutate, yeucauLoading } = useGetYeuCauKH();
  const { phanhe = [], phanheLoading } = useGetPhanHeAll();

  // States
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<YeuCauKhachHang | null>(null);
  const [viewingRequestId, setViewingRequestId] = useState<string | null>(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const loading = loadingCreate || loadingUpdate || loadingDelete;
  const isDataLoading = yeucauLoading || phanheLoading;
  const isAnyLoading = isDataLoading || loading;

  // Memoized values
  const activeRequests = useMemo(() => requests.filter((req) => req.isDelete === 0), [requests]);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: activeRequests,
        comparator: getComparator(table.order, table.orderBy),
        filters,
      }),
    [activeRequests, table.order, table.orderBy, filters]
  );

  const canReset = useMemo(
    () => !!filters.name || filters.status !== 'all',
    [filters.name, filters.status]
  );

  const notFound = useMemo(
    () => (!dataFiltered.length && canReset) || !dataFiltered.length,
    [dataFiltered.length, canReset]
  );

  const denseHeight = table.dense ? 52 : 72;

  const handleFilters = useCallback(
    (name: string, value: IChecklistTableFilters) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // Request handlers
  const createRequest = useCallback(
    async (formData: FormData) => {
      setLoadingCreate(true);
      try {
        const response = await createYeuCau(formData);
        if (response) {
          yeucauMutate();
          enqueueSnackbar('Tạo yêu cầu thành công', { variant: 'success' });
        }
        return true;
      } catch (err) {
        enqueueSnackbar('Không thể tạo yêu cầu. Vui lòng thử lại.', { variant: 'error' });
        console.error('Error creating request:', err);
        return false;
      } finally {
        setLoadingCreate(false);
      }
    },
    [yeucauMutate, enqueueSnackbar]
  );

  const updateRequest = useCallback(
    async (id: number, formData: FormData) => {
      setLoadingUpdate(true);
      try {
        const response = await updateYeuCau(id, formData);
        if (response) {
          yeucauMutate();
          enqueueSnackbar('Cập nhật yêu cầu thành công', { variant: 'success' });
        }
        return true;
      } catch (err) {
        enqueueSnackbar('Không thể cập nhật yêu cầu. Vui lòng thử lại.', { variant: 'error' });
        console.error('Error updating request:', err);
        return false;
      } finally {
        setLoadingUpdate(false);
      }
    },
    [yeucauMutate, enqueueSnackbar]
  );

  const deleteRequest = useCallback(
    async (id: number, MoTaCongViec: string) => {
      setLoadingDelete(true);
      try {
        const formData = {
          MoTaCongViec,
          TrangThai: 3,
          images: []
        } as unknown as FeedbackFormData

        const response = await createFeedback(formData, id);
        if (response) {
          yeucauMutate();
          enqueueSnackbar('Xóa yêu cầu thành công', { variant: 'success' });
        }
        return true;
      } catch (err) {
        enqueueSnackbar('Không thể xóa yêu cầu. Vui lòng thử lại.', { variant: 'error' });
        console.error('Error deleting request:', err);
        return false;
      } finally {
        setLoadingDelete(false);
      }
    },
    [yeucauMutate, enqueueSnackbar]
  );

  // Event handlers
  const handleViewRow = useCallback(
    (id: string) => {
      setViewingRequestId(id);
    },
    []
  );

  const handleEdit = useCallback((request: YeuCauKhachHang) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: number, MoTaCongViec: string) => {
      await deleteRequest(id, MoTaCongViec);
    },
    [deleteRequest]
  );

  const handleFiltersChange = useCallback((newFilters: IChecklistTableFilters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData: FormData, isEdit: boolean, requestId?: number) => {
      if (isEdit && requestId) {
        return updateRequest(requestId, formData);
      }
      return createRequest(formData);
    },
    [createRequest, updateRequest]
  );

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingRequest(null);
  }, []);

  // Memoize dialog components
  const formDialog = useMemo(
    () => (
      <CreateFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        editingRequest={editingRequest}
        phanhe={phanhe}
        onSubmit={handleFormSubmit}
        loading={loadingCreate || loadingUpdate}
      />
    ),
    [
      isFormOpen,
      handleFormClose,
      editingRequest,
      phanhe,
      handleFormSubmit,
      loadingCreate,
      loadingUpdate,
    ]
  );

  const detailDialog = useMemo(
    () => (
      <DetailDialog
        isOpen={!!viewingRequestId}
        onClose={() => setViewingRequestId(null)}
        requestId={viewingRequestId || ''}
        user={user}
        mutate = {yeucauMutate}
      />
    ),
    [viewingRequestId, user, yeucauMutate]
  );

  // Effects
  useEffect(() => {
    if (!isOpen) {
      setViewingRequestId(null);
      setIsFormOpen(false);
      setEditingRequest(null);
    }
  }, [isOpen]);

  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => setIsOpen(true)}
        sx={{ mb: 2 }}
        disabled={isDataLoading}
      >
        {isDataLoading ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Đang tải...
          </>
        ) : (
          'Quản lý yêu cầu khách hàng'
        )}
      </Button>

      {/* Main Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => !loading && setIsOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div">
              Quản lý yêu cầu khách hàng
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="success"
                startIcon={
                  loadingCreate ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Iconify icon="eva:plus-fill" />
                  )
                }
                onClick={() => setIsFormOpen(true)}
                sx={{ mr: 1 }}
                disabled={isAnyLoading}
              >
                {loadingCreate ? 'Đang tạo...' : 'Tạo yêu cầu mới'}
              </Button>
              <IconButton onClick={() => setIsOpen(false)} disabled={loading}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <LoadingOverlay loading={isDataLoading}>
            {isDataLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
                flexDirection="column"
                gap={2}
              >
                <CircularProgress size={50} />
                <Typography variant="h6" color="textSecondary">
                  Đang tải dữ liệu...
                </Typography>
              </Box>
            ) : (
              <LoadingOverlay loading={loadingDelete}>
                <YCTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                  //
                  canReset={canReset}
                  onResetFilters={handleResetFilters}
                  options={options}
                />

                {canReset && (
                  <YCTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    //
                    onResetFilters={handleResetFilters}
                    //
                    results={dataFiltered?.length}
                    sx={{ p: 2.5, pt: 0 }}
                  />
                )}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={dataFiltered.length}
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
                          <YCTableRow
                            key={row.ID_YeuCau}
                            row={row}
                            selected={table.selected.includes(`${row.ID_YeuCau}`)}
                            onViewRow={() => handleViewRow(`${row.ID_YeuCau}`)}
                            onEditRow={() => handleEdit(row)}
                            onDeleteRow={handleDelete}
                            user={user}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                      />

                      <TableNoData notFound={notFound} />
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePaginationCustom
                  count={dataFiltered.length}
                  page={table.page}
                  rowsPerPage={table.rowsPerPage}
                  onPageChange={table.onChangePage}
                  onRowsPerPageChange={table.onChangeRowsPerPage}
                  dense={table.dense}
                  onChangeDense={table.onChangeDense}
                />
              </LoadingOverlay>
            )}
          </LoadingOverlay>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      {formDialog}

      {/* Detail Dialog */}
      {detailDialog}
    </Box>
  );
}

// Filter function
function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
}) {
  const { name, building } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(b[0], a[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) =>
        `${order.TenKhachHang}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.Tenyeucau}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.NoiDung}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (building.length) {
    inputData = inputData.filter((item) => building.includes(String(item?.TrangThai)));
  }

  return inputData;
}