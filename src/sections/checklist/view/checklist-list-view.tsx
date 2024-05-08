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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import { Menu, MenuItem, Select } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, ORDER_STATUS_OPTIONS, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetKhuVuc, useGetHangMuc, useGetKhoiCV, useGetChecklist, useGetCalv } from 'src/api/khuvuc';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
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
import {
  IChecklist,
  IHangMuc,
  IKhuvuc,
  IKhuvucTableFilters,
  IKhuvucTableFilterValue,
} from 'src/types/khuvuc';
//
import ChecklistTableRow from '../checklist-table-row';
import ChecklistTableToolbar from '../checklist-table-toolbar';
import ChecklistTableFiltersResult from '../checklist-table-filters-result';


// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'Tất cả' }, ...KHUVUC_STATUS_OPTIONS];

const TABLE_HEAD = [
  // { id: 'ID_Checklist', label: '', width: 1 },
  { id: 'Checklist', label: 'Tên checklist' },
  { id: 'Giatridinhdanh', label: 'Giá trị định danh', width: 100, align: 'center' },
  { id: 'Giatrinhan', label: 'Giá trị nhận', width: 120, align: 'center' },
  { id: 'ID_Hangmuc', label: 'Hạng mục', width: 150, align: 'center' },
  { id: 'ID_Tang', label: 'Tầng', width: 100, align: 'center' },
  { id: 'Sothutu', label: 'Số thứ tự', width: 100, align: 'center' },
  { id: 'Maso', label: 'Mã số', width: 100, align: 'center' },
  { id: 'MaQrCode', label: 'Mã Qr Code', width: 140, align: 'center' },
  { id: 'sCalv', label: 'Ca làm việc', width: 140, align: 'center' },
  { id: '', width: 88 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function AreaListView() {
  const table = useTable({ defaultOrderBy: 'ID_Checklist' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  // const {checkList} = useGetChecklist( {page: table.page, limit: table.rowsPerPage});

  const [tableData, setTableData] = useState<IChecklist[]>([]);

  const { checkList, checkListTotalPages, checklistTotalCount } = useGetChecklist({
    page: table.page,
    limit: table.rowsPerPage,
  });

  const {calv} = useGetCalv()

 
  // Use the checklist data in useEffect to set table data
  useEffect(() => {
    if (checkList) {
      setTableData(checkList);
    }
    
  }, [checkList, table.page, table.rowsPerPage]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

 
  const dataInPage = dataFiltered.slice(
    0,
    table.rowsPerPage
  )
  
  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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
        .put(`http://localhost:6868/api/ent_hangmuc/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Hangmuc !== id);
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
    const deleteRows = tableData?.filter((row) => !table.selected.includes(row.ID_Hangmuc));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData?.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered?.length,
    });
  }, [dataFiltered?.length,dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.checklist.edit(id));
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
        <CustomBreadcrumbs
          heading="Checklists"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Checklist',
              href: paths.dashboard.checklist.root,
            },
            { name: 'Danh sách' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
         
          <ChecklistTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <ChecklistTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Hangmuc))
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
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Hangmuc))
                  }
                />

                <TableBody>
                  {dataInPage
                    .map((row) => (
                      <ChecklistTableRow
                        key={row.ID_Checklist}
                        calv={calv}
                        row={row}
                        selected={table.selected.includes(row.ID_Checklist)}
                        onSelectRow={() => table.onSelectRow(row.ID_Checklist)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Checklist)}
                        onViewRow={() => handleViewRow(row.ID_Checklist)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(0, table.rowsPerPage, tableData?.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={checklistTotalCount}
            rowsPerPageOptions={[20, 30, 50]}
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
  inputData: IChecklist[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) =>
        order.Checklist.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.MaQrCode.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Giatridinhdanh.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Giatrinhan.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_hangmuc.Hangmuc.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData?.filter((order) => `${order?.ID_Hangmuc}` === status);
  }

  return inputData;
}
