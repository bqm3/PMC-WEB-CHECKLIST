import { useState, useCallback, useEffect, useMemo } from 'react';
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
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, ORDER_STATUS_OPTIONS, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetChinhanh, useGetDuanWeb } from 'src/api/khuvuc';
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
import { useAuthContext } from 'src/auth/hooks';
// types
import { IDuan, IChecklistTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';
//
import DuanTableRow from '../duan-table-row';
import DuanTableToolbar from '../duan-table-toolbar';
import DuanTableFiltersResult from '../duan-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Duan', label: 'Mã dự án', width: 150 },
  { id: 'Duan', label: 'Tên dự án', width: 300 },
  { id: 'ID_Chinhanh', label: 'Chi nhánh', width: 200 },
  { id: 'Diachi', label: 'Địa chỉ' },
  { id: '', width: 10 },
];

const defaultFilters: IChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
  projectStatus: 'all',
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GiamsatListView() {
  const table = useTable({ defaultOrderBy: 'ID_Duan' });

  const settings = useSettingsContext();
  const { user, logout } = useAuthContext();

  const router = useRouter();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { duan, duanLoading, duanEmpty, reloadDuan } = useGetDuanWeb();

  const { chinhanh } = useGetChinhanh();

  const [tableData, setTableData] = useState<IDuan[]>([]);

  const DEPARTMENT_OPTIONS = useMemo(
    () => [
      ...chinhanh.map((it: any) => ({
        value: it.ID_Chinhanh.toString(),
        label: it.Tenchinhanh,
      })),
    ],
    [chinhanh]
  );

  useEffect(() => {
    if (duan?.length > 0) {
      setTableData(duan);
    }
  }, [duan]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

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
        .put(`${process.env.REACT_APP_HOST_API}/ent_duan/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Duan !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar('Xóa thành công!');
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 4000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 4000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 4000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    },
    [accessToken, enqueueSnackbar, dataInPage.length, table, tableData] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData?.filter((row) => !table.selected.includes(row.ID_Duan));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData?.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered?.length,
    });
  }, [dataFiltered?.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.duan.edit(id));
    },
    [router]
  );

  const handleFilterProjectStatus = useCallback(
    (status: string) => {
      handleFilters('projectStatus', status);
    },
    [handleFilters]
  );

  const handleUpdateSuccess = useCallback(async () => {
    try {
      // Dữ liệu gửi lên API đăng nhập
      const data = {
        UserName: user?.UserName,
        Password: user?.PasswordPrivate,
      };

      // Gọi API đăng nhập
      const urlHttp = `${process.env.REACT_APP_HOST_API}/ent_user/login`;
      const res = await axios.post(urlHttp, data);

      // Kiểm tra nếu đăng nhập thành công
      if (res.status === 200) {
        localStorage.removeItem('accessToken');
        const { token } = res.data;

        localStorage.setItem('accessToken', token); // Lưu token vào sessionStorage
        window.location.reload(); // Reload lại trang
      }
    } catch (error) {
      console.log(error )
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: error.response?.data?.message || 'Có lỗi xảy!',
      });
    }
  }, [user, enqueueSnackbar]);

  const handleViewRowDuan = useCallback(
    async (id: string) => {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_HOST_API}/ent_user/duan/update/${id}`,
          [],
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Lưu ID_Duan vào localStorage
        // localStorage.setItem('ID_Duan', id);

        // Gọi handleUpdateSuccess để đăng nhập lại
        await handleUpdateSuccess();
      } catch (error) {
        if (error.response) {
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 4000,
            message: `${error.response.data.message}`,
          });
        } else if (error.request) {
          // Lỗi không nhận được phản hồi từ server
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 4000,
            message: 'Không nhận được phản hồi từ máy chủ',
          });
        } else {
          // Lỗi khi cấu hình request
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 4000,
            message: 'Lỗi gửi yêu cầu',
          });
        }
      }
    },
    [accessToken, enqueueSnackbar, handleUpdateSuccess] // Add handleUpdateSuccess to dependencies
  );

  const handleReload = useCallback(async () => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_HOST_API}/ent_user/duan/clear`, [], {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Lưu ID_Duan vào localStorage
      localStorage.removeItem('ID_Duan');

      // Gọi handleUpdateSuccess để đăng nhập lại
      await handleUpdateSuccess();
    } catch (error) {
      if (error.response) {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: `${error.response.data.message}`,
        });
      } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: 'Không nhận được phản hồi từ máy chủ',
        });
      } else {
        // Lỗi khi cấu hình request
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: 'Lỗi gửi yêu cầu',
        });
      }
    }
  }, [accessToken, enqueueSnackbar, handleUpdateSuccess]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleOpenClose = useCallback(
    async (id: string, action: string, type: string) => {
      try {
        await axios.put(
          `${process.env.REACT_APP_HOST_API}/ent_duan/update-action/${id}?action=${action}&type=${type}`,
          [],
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        await reloadDuan();
        enqueueSnackbar('Thành công!');
      } catch (error) {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: error.message || 'Có lỗi xảy ra',
        });
      }
    },
    [accessToken, enqueueSnackbar, reloadDuan]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Danh sách dự án"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              {
                name: 'Dự án',
                href: paths.dashboard.duan.root,
              },
              { name: 'Danh sách' },
            ]}
            sx={{
              mb: { xs: 1, md: 3 },
            }}
          />
          {user?.ID_Chucvu !== 2 && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:refresh-fill" />}
              onClick={() => handleReload()}
            >
              Tổng quan dự án
            </Button>
          )}
        </Stack>

        <Card>
          <DuanTableToolbar
            filters={filters}
            onFilters={handleFilters}
            departmentOptions={DEPARTMENT_OPTIONS}
            onFilterProjectStatus={handleFilterProjectStatus}
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

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Duan))
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
                    table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Duan))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <DuanTableRow
                        key={row.ID_Duan}
                        row={row}
                        selected={table.selected.includes(row.ID_Duan)}
                        onSelectRow={() => table.onSelectRow(row.ID_Duan)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Duan)}
                        onViewRow={() => handleViewRow(row.ID_Duan)}
                        onViewDuAnRow={() => handleViewRowDuan(row.ID_Duan)}
                        handleOpenClose={handleOpenClose}
                        user={user}
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
  inputData: IDuan[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
  // dateError: boolean;
}) {
  const { status, name, building } = filters;

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
        order.Duan.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Diachi.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (building.length) {
    inputData = inputData.filter((item) => building.includes(String(item?.ID_Chinhanh)));
  }

  if (filters.projectStatus && filters.projectStatus !== 'all') {
    switch (filters.projectStatus) {
      case 'closed':
        // Dự án đóng: isDelete = 2
        inputData = inputData.filter((item) => item?.isDelete === 2);
        break;
      case 'no_report':
        // Dự án không báo cáo: isBaocao = 1
        inputData = inputData.filter((item) => item?.isBaoCao === 1);
        break;
      case 'active':
        // Dự án hoạt động: không phải đóng và có báo cáo
        inputData = inputData.filter((item) => item?.isDelete !== 2 && item?.isBaoCao !== 1);
        break;
      default:
        break;
    }
  }

  return inputData;
}
