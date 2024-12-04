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
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Image from 'src/components/image';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, ORDER_STATUS_OPTIONS, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetKhoiCV, useGetKhuVuc, useGetLocations } from 'src/api/khuvuc';
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
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import {
  IHangMuc,
  IKhuvuc,
  IKhuvucTableFilters,
  IKhuvucTableFilterValue,
  ILocation,
} from 'src/types/khuvuc';
//
import AreaTableRow from '../area-table-row';
import AreaTableToolbar from '../area-table-toolbar';
import OrderTableFiltersResult from '../area-table-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';

import TableSelectedAction from '../table-selected-action';
import TableHeadCustom from '../table-head-custom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Mã', width: 50 },
  { id: 'project', label: 'Tên dự án' },
  { id: 'ca', label: 'Ca', width: 150 },
  { id: 'nguoi', label: 'Họ tên', width: 150 },
  { id: 'cv', label: 'Công việc', width: 150 },
  { id: '', width: 88 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Khối kỹ thuật', label: 'Khối kỹ thuật' },
  { value: 'Khối làm sạch', label: 'Khối làm sạch' },
  { value: 'Khối dịch vụ', label: 'Khối dịch vụ' },
  { value: 'Khối bảo vệ', label: 'Khối bảo vệ' },
  { value: 'Khối F&B', label: 'Khối F&B' },
];
// ----------------------------------------------------------------------

export default function LocationManagementsView() {
  const table = useTable({ defaultOrderBy: 'id' });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const { location, locationLoading, locationEmpty } = useGetLocations();

  const [tableData, setTableData] = useState<ILocation[]>([]);


  useEffect(() => {
    if (location.length > 0) {
      setTableData(location);
    }
  }, [location]);

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

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomBreadcrumbs
          heading="Dự án"
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
                  {tab.value === 'all' && location?.length}
                  {tab.value === 'Khối dịch vụ' &&
                    location?.filter((item) => `${item.cv}` === 'Khối dịch vụ').length}
                  {tab.value === 'Khối làm sạch' &&
                    location?.filter((item) => `${item.cv}` === 'Khối làm sạch').length}
                  {tab.value === 'Khối bảo vệ' &&
                    location?.filter((item) => `${item.cv}` === 'Khối bảo vệ').length}
                  {tab.value === 'Khối kỹ thuật' &&
                    location?.filter((item) => `${item.cv}` === 'Khối kỹ thuật').length}
                  {tab.value === 'Khối F&B' &&
                    location?.filter((item) => `${item.cv}` === 'Khối F&B').length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <AreaTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
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
            rowCount={dataInPage?.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(checked, dataInPage?.map((row) => row?.id))
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
                rowCount={location?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, dataInPage?.map((row) => row.id))
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <AreaTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      index={index}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: ILocation[];
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
      (item) =>
        `${item.project}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${item.ca}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${item.cv}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${item.nguoi}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((item) => `${item.cv}` === `${status}`);
  }

  return inputData;
}

// 13000 + 1000 + 1000
// </dfn></dfn>
