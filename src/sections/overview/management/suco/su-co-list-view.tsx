import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import { m } from 'framer-motion';
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
import { Box, FormControl, InputLabel, Menu, MenuItem, Select, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Image from 'src/components/image';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { useGetKhoiCV, useGetKhuVuc, useGetSuCoNgoai } from 'src/api/khuvuc';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
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
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';
// types
import { IKhuvucTableFilters, IBaoCaoTableFilterValue, ISucongoai } from 'src/types/khuvuc';
//
import AreaTableRow from './su-co-table-row';
import SuCoTableToolbar from './su-co-table-toolbar';
import TableHeadCustom from './table-head-custom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Suco', label: 'Mã', width: 50 },
  { id: 'ID_Hangmuc', label: 'Hạng mục' },
  { id: 'Ngaysuco', label: 'Ngày sự cố', width: 150 },
  { id: 'Ngayxuly', label: 'Ngày xử lý', width: 150 },
  { id: 'Noidungsuco', label: 'Thông tin', width: 200 },
  { id: 'Tinhtrangxuly', label: 'Tình trạng xử lý', width: 150 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

type Props = {
  data: any;
};

// ----------------------------------------------------------------------

export default function SuCoListView({ data }: Props) {
  const table = useTable();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState<ISucongoai[]>([]);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: '0', label: 'Chưa xử lý' },
      { value: '1', label: 'Đang xử lý' },
      { value: '2', label: 'Đã xử lý' },
    ],
    []
  );

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IBaoCaoTableFilterValue) => {
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

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <Container sx={{my: 2}}>
      <Card>
        <Tabs
          value={filters?.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS?.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters?.status) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === '2' && 'success') ||
                    (tab.value === '1' && 'warning') ||
                    (tab.value === '0' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && data?.length}
                  {tab.value === '0' &&
                    data?.filter((item: any) => `${item?.Tinhtrangxuly}` === '0').length}
                  {tab.value === '1' &&
                    data?.filter((item: any) => `${item?.Tinhtrangxuly}` === '1').length}
                  {tab.value === '2' &&
                    data?.filter((item: any) => `${item?.Tinhtrangxuly}` === '2').length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <SuCoTableToolbar
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={data?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, dataInPage?.map((row) => row.ID_Suco))
                }
              />

              <TableBody>
                {dataFiltered
                  ?.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <AreaTableRow
                      key={row.ID_Suco}
                      row={row}
                      selected={table.selected.includes(row.ID_Suco)}
                      onSelectRow={() => table.onSelectRow(row.ID_Suco)}
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
  filters,
  dateError,
}: {
  inputData: ISucongoai[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) =>
        `${order?.ent_hangmuc?.Hangmuc}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.Noidungsuco}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData?.filter((order) => `${order?.Tinhtrangxuly}` === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      // Đặt endDate vào cuối ngày
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      const startTimestamp = fTimestamp(startDate);
      const endTimestamp = fTimestamp(endDate);
      inputData = inputData?.filter((item: any) => {
        const nxTimestamp = fTimestamp(item.Ngaysuco);
        return nxTimestamp >= startTimestamp && nxTimestamp < endTimestamp;
      });
    }
  }

  return inputData;
}
