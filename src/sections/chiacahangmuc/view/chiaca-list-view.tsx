import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { useGetKhoiCV, useGetGiamsat, useGetGiamSatByDuan, useGetPhanCaByDuan } from 'src/api/khuvuc';

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
// types
import {
  ICalv,
  IGiamsat,
  IHangMuc,
  IKhuvuc,
  IKhuvucTableFilters,
  IKhuvucTableFilterValue,
  IThietLapCa,
  IUser,
} from 'src/types/khuvuc';
//
import GiamsatTableRow from '../chia-ca-table-row';
import GiamsatTableToolbar from '../chia-ca-table-toolbar';
import GiamsatTableFiltersResult from '../chia-ca-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_ThietLapCa', label: 'Mã thiết lập', width: 140 },
  { id: 'ID_Calv', label: 'Ca làm việc', width: 200 },
  { id: 'Sochecklist', label: 'Số checklist', width: 150 },
  { id: 'Ngaythu', label: 'Ngày thực hiện', width: 140 },
  { id: 'ID_KhoiCV', label: 'Khối công việc', width: 200 },
  { id: '', width: 88 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function ChiacaListView() {
  const table = useTable({ defaultOrderBy: 'Ngaythu' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { thietlapca } = useGetPhanCaByDuan();

  const { khoiCV } = useGetKhoiCV();

  const [tableData, setTableData] = useState<IThietLapCa[]>([]);

  useEffect(() => {
    if (thietlapca?.length > 0) {
      setTableData(thietlapca);
    }
  }, [thietlapca]);

  const STATUS_OPTIONS = useMemo(() => [
    { value: 'all', label: 'Tất cả' },
    ...khoiCV.map(khoi => ({
      value: khoi.ID_KhoiCV.toString(),
      label: khoi.KhoiCV
    }))
  ], [khoiCV]);

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
        .put(`https://checklist.pmcweb.vn/be/api/v2/ent_thietlapca/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_ThietLapCa !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar({
            variant: 'success',
            autoHideDuration: 4000,
            message: `Xóa thành công`,
          });
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.phanquyenchecklist.edit(id));
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
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách chia ca"
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
                      (tab.value === '4' && 'info') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && thietlapca?.length}
                    {tab.value === '1' &&
                      thietlapca?.filter((item) => `${item.ent_calv.ID_KhoiCV}` === '1').length}

                    {tab.value === '2' &&
                      thietlapca?.filter((item) => `${item.ent_calv.ID_KhoiCV}` === '2').length}
                    {tab.value === '3' &&
                      thietlapca?.filter((item) => `${item.ent_calv.ID_KhoiCV}` === '3').length}
                    {tab.value === '4' &&
                      thietlapca?.filter((item) => `${item.ent_calv.ID_KhoiCV}` === '4').length}
                    {tab.value === '5' &&
                      thietlapca?.filter((item) => `${item.ent_calv.ID_KhoiCV}` === '5').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <GiamsatTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <GiamsatTableFiltersResult
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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_ThietLapCa))
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
                    table.onSelectAllRows(checked, tableData?.map((row) => row.ID_ThietLapCa))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <GiamsatTableRow
                        key={row.ID_ThietLapCa}
                        row={row}
                        selected={table.selected.includes(row.ID_ThietLapCa)}
                        onSelectRow={() => table.onSelectRow(row.ID_ThietLapCa)}
                        onDeleteRow={() => handleDeleteRow(row.ID_ThietLapCa)}
                        onViewRow={() => handleViewRow(row.ID_ThietLapCa)}
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

      {/* <ConfirmDialog
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
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IThietLapCa[];
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
        `${order?.ent_calv?.Tenca}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.Ngaythu}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_calv?.ent_khoicv.KhoiCV}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((tbchecklist) => `${tbchecklist.ent_calv.ID_KhoiCV}` === `${status}`);
  }

  return inputData;
}
