import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, ORDER_STATUS_OPTIONS, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingButton } from '@mui/lab';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
// types
import { IKhuvuc, IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';
//
import OrderTableRow from '../area-table-row';
import OrderTableToolbar from '../area-table-toolbar';
import OrderTableFiltersResult from '../area-table-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Khuvuc', label: 'Mã khu vực', width: 140 },
  { id: 'Tenkhuvuc', label: 'Tên khu vực' },

  { id: 'ID_Toanha', label: 'Tòa nhà', width: 140, align: 'center' },
  { id: 'MaQrCode', label: 'Mã Qr Code', width: 140, align: 'center' },
  { id: 'Sothutu', label: 'Số thứ tự', width: 100 },
  { id: 'Makhuvuc', label: 'Mã khu vực', width: 100 },
  { id: 'ID_KhoiCV', label: 'Khối công việc', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function AreaListView() {
  const table = useTable({ defaultOrderBy: 'ID_Khuvuc' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const upload = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [loading, setLoading] = useState<Boolean | any>(false)

  const [filters, setFilters] = useState(defaultFilters);

  const { khuvuc, khuvucLoading, khuvucEmpty } = useGetKhuVuc();
  const { khoiCV } = useGetKhoiCV();

  const [tableData, setTableData] = useState<IKhuvuc[]>([]);

  useEffect(() => {
    if (khuvuc.length > 0) {
      setTableData(khuvuc);
    }
  }, [khuvuc]);

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([{ value: 'all', label: 'Tất cả' }]);

  useEffect(() => {
    // Assuming khoiCV is set elsewhere in your component
    khoiCV.forEach((khoi) => {
      set_STATUS_OPTIONS((prevOptions) => [
        ...prevOptions,
        { value: khoi.ID_Khoi.toString(), label: khoi.KhoiCV },
      ]);
    });
  }, [khoiCV]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    // dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IKhuvucTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios
        .put(`https://checklist.pmcweb.vn/be/api/ent_khuvuc/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData.filter((row) => row.ID_Khuvuc !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar('Xóa thành công!');
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 3000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    },
    [accessToken, enqueueSnackbar, dataInPage.length, table, tableData] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.ID_Khuvuc));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.khuvuc.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomBreadcrumbs
          heading="Khu vực"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Khu vực',
              href: paths.dashboard.khuvuc.root,
            },
            { name: 'Danh sách' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
         <LoadingButton
            loading={loading}
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload
          </LoadingButton>
        </Stack>

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === '1' && 'success') ||
                      (tab.value === '2' && 'warning') ||
                      (tab.value === '3' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && khuvuc?.length}
                    {tab.value === '1' &&
                      khuvuc?.filter((order) => {
                        let ids = order.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '1' ||
                          ids.startsWith('1,') ||
                          ids.includes(',1,') ||
                          ids.endsWith(',1')
                        );
                      }).length}

                    {tab.value === '2' &&
                      khuvuc?.filter((order) => {
                        let ids = order.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '2' ||
                          ids.startsWith('2,') ||
                          ids.includes(',2,') ||
                          ids.endsWith(',2')
                        );
                      }).length}
                    {tab.value === '3' &&
                      khuvuc?.filter((order) => {
                        let ids = order.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '3' ||
                          ids.startsWith('3,') ||
                          ids.includes(',3,') ||
                          ids.endsWith(',3')
                        );
                      }).length}
                    {tab.value === '4' &&
                      khuvuc?.filter((order) => {
                        let ids = order.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '4' ||
                          ids.startsWith('4,') ||
                          ids.includes(',4,') ||
                          ids.endsWith(',4')
                        );
                      }).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={khuvuc?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, khuvuc?.map((row) => row?.ID_Khuvuc))
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={khuvuc?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, khuvuc?.map((row) => row.ID_Khuvuc))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.ID_Khuvuc}
                        row={row}
                        selected={table.selected.includes(row.ID_Khuvuc)}
                        onSelectRow={() => table.onSelectRow(row.ID_Khuvuc)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Khuvuc)}
                        onViewRow={() => handleViewRow(row.ID_Khuvuc)}
                        khoiCV={khoiCV}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} setLoading={setLoading}/>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IKhuvuc[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.Tenkhuvuc.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.MaQrCode.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_toanha.Toanha.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  

  if (status !== 'all') {
    // Chuyển status thành số nguyên để so sánh với các phần tử trong mảng ID_KhoiCVs
    const statusAsNumber = parseInt(status, 10);

    inputData = inputData.filter(order => {
        const ids = order?.ID_KhoiCVs;

        // Kiểm tra nếu ids là mảng
        if (Array.isArray(ids)) {
            return ids.includes(statusAsNumber);
        }

        // Trường hợp ids không phải là mảng
        return false;
    });
}

  return inputData;
}
