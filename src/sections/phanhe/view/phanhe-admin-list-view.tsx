import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';

// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Autocomplete,
} from '@mui/material';
import Iconify from 'src/components/iconify';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { useGetThamSoPhanHeAll, useGetPhanHeAll, useGetDuan } from 'src/api/khuvuc';
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
import { useSnackbar } from 'src/components/snackbar';
// types
import { IChecklistTableFilters } from 'src/types/khuvuc';
//
import PhanHeTableRow from '../phanhe-admin-table-row';
import DuanTableToolbar from '../phanhe-table-toolbar';
import DuanTableFiltersResult from '../phanhe-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Tenduan', label: 'Dự án', width: 150 },
  { id: 'Phanhe', label: 'Phân hệ', width: 150 },
  { id: 'Thamso', label: 'Tham số', width: 150 },
  { id: 'iGiayphep', label: 'Giấy phép', width: 100 },
  { id: 'Chisogiayphep', label: 'Chỉ số giấy phép', width: 100 },
  { id: 'Chisotrungbinh', label: 'Chỉ số trung bình', width: 100 },
  { id: 'Ghichu', label: 'Ghi chú', width: 100 },
  { id: '', width: 10 },
];

const defaultFilters: IChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
};

// Default form data
const defaultFormData = {
  Tenduan: '',
  ID_Duan: '',
  Phanhe: '',
  ID_Phanhe: '',
  Thamso: '',
  iGiayphep: '',
  Chisogiayphep: '',
  Chisotrungbinh: '',
  Ghichu: '',
};

// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';
export default function GiamsatListView() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'Ngay_ghi_nhan' });

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const { ThamSophanhe, ThamSophanheMutate } = useGetThamSoPhanHeAll();
  const { phanhe } = useGetPhanHeAll();
  const { duan } = useGetDuan();

  const [tableData, setTableData] = useState<any[]>([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  useEffect(() => {
    if (ThamSophanhe?.length > 0) {
      setTableData(ThamSophanhe);
    }
  }, [ThamSophanhe]);

  const OPTIONS = useMemo(
    () => [
      ...phanhe.map((it: any) => ({
        value: it.ID_Phanhe.toString(),
        label: it.Phanhe,
      })),
    ],
    [phanhe]
  );

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  // Handle opening dialog for editing
  const handleViewRow = useCallback(
    (id: string) => {
      const selectedRow = tableData.find((row) => `${row?.ID_Thamsophanhe}` === id);
      if (selectedRow) {
        setFormData({
          Tenduan: selectedRow.Tenduan || '',
          ID_Duan: selectedRow.ID_Duan || '',
          Phanhe: selectedRow.ent_phanhe?.Phanhe || '',
          ID_Phanhe: selectedRow.ID_Phanhe || '',
          Thamso: selectedRow.Thamso || '',
          iGiayphep: selectedRow.iGiayphep || '',
          Chisogiayphep: selectedRow.Chisogiayphep || '',
          Chisotrungbinh: selectedRow.Chisotrungbinh || '',
          Ghichu: selectedRow.Ghichu || '',
        });
        setSelectedRowId(id);
        setIsEditMode(true);
        setDialogOpen(true);
      }
    },
    [tableData]
  );

  // Handle opening dialog for adding new item
  const handleAddNew = useCallback(() => {
    setFormData(defaultFormData);
    setSelectedRowId(null);
    setIsEditMode(false);
    setDialogOpen(true);
  }, []);

  // Handle closing dialog
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setFormData(defaultFormData);
    setSelectedRowId(null);
    setIsEditMode(false);
  }, []);

  // Handle form input changes
  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle dự án selection change
  const handleDuanChange = useCallback((selectedDuan: any) => {
    setFormData((prev) => ({
      ...prev,
      ID_Duan: selectedDuan?.ID_Duan || '',
      Tenduan: selectedDuan?.Tenduan || '',
    }));
  }, []);

  // Handle phân hệ selection change
  const handlePhanHeChange = useCallback((selectedPhanHe: any) => {
    setFormData((prev) => ({
      ...prev,
      ID_Phanhe: selectedPhanHe?.ID_Phanhe || '',
      Phanhe: selectedPhanHe?.Phanhe || '',
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    try {
      if (isEditMode && selectedRowId) {
        await axios.put(
          `${process.env.REACT_APP_HOST_API}/ent_thamsophanhe/update/${selectedRowId}`,
          {
            Thamso: formData.Thamso,
            iGiayphep: formData.iGiayphep,
            Chisogiayphep: formData.Chisogiayphep,
            Chisotrungbinh: formData.Chisotrungbinh,
            Ghichu: formData.Ghichu,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Cập nhật thành công!',
        });
      } else {
        await axios.post(
          `${process.env.REACT_APP_HOST_API}/ent_thamsophanhe/create/`,
          {
            ID_Duan: formData.ID_Duan,
            Tenduan: formData.Tenduan,
            ID_Phanhe: formData.ID_Phanhe,
            Phanhe: formData.Phanhe,
            Thamso: formData.Thamso,
            iGiayphep: formData.iGiayphep,
            Chisogiayphep: formData.Chisogiayphep,
            Chisotrungbinh: formData.Chisotrungbinh,
            Ghichu: formData.Ghichu,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Tạo mới thành công!',
        });
      }
    } catch (error) {
      let errorMessage = 'Lỗi gửi yêu cầu';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Không nhận được phản hồi từ máy chủ';
      }
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: errorMessage,
      });
    } finally {
      ThamSophanheMutate();
      handleCloseDialog();
    }
  }, [
    isEditMode,
    selectedRowId,
    formData,
    accessToken,
    ThamSophanheMutate,
    handleCloseDialog,
    enqueueSnackbar,
  ]);

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomBreadcrumbs
          heading="Danh sách dự án"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            { name: 'Tổng hợp' },
          ]}
          sx={{
            mb: { xs: 1, md: 2 },
          }}
        />

        {/* Add New Button */}
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddNew}
          sx={{ mb: { xs: 1, md: 2 } }}
        >
          Thêm mới
        </Button>
      </Stack>

      <DuanTableToolbar
        filters={filters}
        onFilters={handleFilters}
        options={OPTIONS}
        //
        canReset={canReset}
        onResetFilters={handleResetFilters}
      />

      {canReset && (
        <DuanTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          //
          onResetFilters={handleResetFilters}
          //
          results={dataFiltered?.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

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
                    <PhanHeTableRow
                      key={row.ID_Thamsophanhe}
                      row={row}
                      selected={table.selected.includes(`${row.ID_Thamsophanhe}`)}
                      onViewRow={() => handleViewRow(`${row.ID_Thamsophanhe}`)}
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
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Chỉnh sửa thông tin' : 'Thêm mới thông tin'}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Dự án Selection */}
            <Grid item xs={12} md={6}>
              {isEditMode ? (
                <TextField
                  fullWidth
                  label="Tên dự án"
                  value={formData.Tenduan}
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                    },
                  }}
                />
              ) : (
                <Autocomplete
                  fullWidth
                  options={duan || []}
                  getOptionLabel={(option) => option.Duan || ''}
                  value={duan?.find((d) => d.ID_Duan === formData.ID_Duan) || null}
                  onChange={(event, newValue) => handleDuanChange(newValue)}
                  isOptionEqualToValue={(option, value) => option.ID_Duan === value.ID_Duan}
                  renderInput={(params) => (
                    <TextField {...params} label="Dự án" placeholder="Tìm kiếm dự án..." />
                  )}
                  noOptionsText="Không tìm thấy dự án"
                  filterOptions={(options, { inputValue }) =>
                    options.filter(
                      (option) => option.Duan?.toLowerCase().includes(inputValue.toLowerCase())
                    )
                  }
                />
              )}
            </Grid>

            {/* Phân hệ Selection */}
            <Grid item xs={12} md={6}>
              {isEditMode ? (
                <TextField
                  fullWidth
                  label="Phân hệ"
                  value={formData.Phanhe}
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                    },
                  }}
                />
              ) : (
                <Autocomplete
                  fullWidth
                  options={phanhe || []}
                  getOptionLabel={(option) => option.Phanhe || ''}
                  value={phanhe?.find((p) => p.ID_Phanhe === formData.ID_Phanhe) || null}
                  onChange={(event, newValue) => handlePhanHeChange(newValue)}
                  isOptionEqualToValue={(option, value) => option.ID_Phanhe === value.ID_Phanhe}
                  renderInput={(params) => (
                    <TextField {...params} label="Phân hệ" placeholder="Tìm kiếm phân hệ..." />
                  )}
                  noOptionsText="Không tìm thấy phân hệ"
                  filterOptions={(options, { inputValue }) =>
                    options.filter(
                      (option) => option.Phanhe?.toLowerCase().includes(inputValue.toLowerCase())
                    )
                  }
                />
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tham số"
                value={formData.Thamso}
                onChange={(e) => handleFormChange('Thamso', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giấy phép"
                value={formData.iGiayphep}
                onChange={(e) => handleFormChange('iGiayphep', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chỉ số giấy phép"
                value={formData.Chisogiayphep}
                onChange={(e) => handleFormChange('Chisogiayphep', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chỉ số trung bình"
                value={formData.Chisotrungbinh}
                onChange={(e) => handleFormChange('Chisotrungbinh', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={3}
                value={formData.Ghichu}
                onChange={(e) => handleFormChange('Ghichu', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
  // dateError: boolean;
}) {
  const { name , building} = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(b[0], a[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) => `${order.Tenduan}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (building.length) {
    inputData = inputData.filter((item) => building.includes(String(item?.ID_Phanhe)));
  }

  return inputData;
}
