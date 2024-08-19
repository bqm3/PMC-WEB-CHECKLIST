import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import { useGetOrderBookings, useGetOrderBookingService } from 'src/api/order';
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
// types
import { IBookingOrder, IBookingService, IOrderBookingTableFilters, IOrderBookingTableFilterValue } from 'src/types/room';
//
import InvoiceAnalytic from '../service-analytic';
import InvoiceTableRow from '../service-booking-table-row';
import InvoiceTableToolbar from '../order-booking-table-toolbar';
import InvoiceTableFiltersResult from '../service-booking-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Information' },
  { id: 'createdAt', label: 'Create At' },
  { id: 'price', label: 'Price' },
  { id: 'name', label: 'Name Room', align: 'center' },
  { id: 'order_id', label: 'OrderId', align: 'center' },
  { id: 'active', label: 'Status' },
  { id: '' },
];

const defaultFilters: IOrderBookingTableFilters = {
  customer: '',
  service: [],
  status: 0,
  createdDate: null,
  endDate: null,
  active: 0
};

// ----------------------------------------------------------------------

export default function ServiceBookingListView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createdDate' });

  const confirm = useBoolean();

  const [tableDataOrder, setTableDataOrder] = useState<IBookingService[]>([]);

  const { services, servicesLoading, servicesEmpty, servicesError } = useGetOrderBookingService()

  useEffect(() => {
    if (services.length) {
      setTableDataOrder(services)
    }
  }, [services])

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.createdDate && filters.endDate
      ? filters.createdDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableDataOrder,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.customer ||
    !!filters.service.length ||
    (!!filters.createdDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status: string) =>
    tableDataOrder.filter((item) => Number(item?.active) === Number(status)).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableDataOrder.filter((item) => Number(item?.active) === Number(status)),
      'total'
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableDataOrder.length) * 100;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: tableDataOrder.length },

    {
      value: 0,
      label: 'Pending',
      color: 'warning',
      count: getInvoiceLength('0'),
    },
    {
      value: 1,
      label: 'Paid',
      color: 'success',
      count: getInvoiceLength('1'),
    },
    {
      value: 2,
      label: 'Overdue',
      color: 'error',
      count: getInvoiceLength('2'),
    },
    {
      value: 3,
      label: 'Draft',
      color: 'default',
      count: getInvoiceLength('3'),
    },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IOrderBookingTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableDataOrder.filter((row) => row.id !== id);
      setTableDataOrder(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableDataOrder]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableDataOrder.filter((row) => !table.selected.includes(row.id));
    setTableDataOrder(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableDataOrder.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableDataOrder]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.orderBooking.edit_service(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.orderBooking.detail_service(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('active', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="List Service"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root
            },
            {
              name: 'Order Service',
              href: paths.dashboard.orderBooking.root,
            },
            {
              name: 'List',
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="All"
                total={tableDataOrder.length}
                percent={100}
                price={sumBy(tableDataOrder, 'total')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <InvoiceAnalytic
                title="Pending"
                total={getInvoiceLength('0')}
                percent={getPercentByStatus('0')}
                price={getTotalAmount('0')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                title="Paid"
                total={getInvoiceLength('1')}
                percent={getPercentByStatus('1')}
                price={getTotalAmount('1')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <InvoiceAnalytic
                title="Overdue"
                total={getInvoiceLength('2')}
                percent={getPercentByStatus('2')}
                price={getTotalAmount('2')}
                icon="solar:bell-bing-bold-duotone"
                color={theme.palette.error.main}
              />

              <InvoiceAnalytic
                title="Draft"
                total={getInvoiceLength('3')}
                percent={getPercentByStatus('3')}
                price={getTotalAmount('3')}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filters.active}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === -1 || tab.value === Number(filters?.status)) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dateError={dateError}
          />

          {canReset && (
            <InvoiceTableFiltersResult
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
              rowCount={tableDataOrder.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableDataOrder.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableDataOrder.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableDataOrder.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableDataOrder.length)}
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
  filters,
  dateError,
}: {
  inputData: IBookingService[];
  comparator: (a: any, b: any) => number;
  filters: IOrderBookingTableFilters;
  dateError: boolean;
}) {
  const { customer, status, service, active, createdDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (customer) {
    inputData = inputData.filter(
      (data) =>
        data.name.toLowerCase().indexOf(customer.toLowerCase()) !== -1 ||
        customer.includes(`${data?.order_id}`)
    );
  }

  if (active !== -1) {
    inputData = inputData.filter((data) => data.active === active);
  }

  // if (order_id) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  if (!dateError) {
    if (createdDate && endDate) {
      inputData = inputData.filter(
        (data) =>
          fTimestamp(data.createdAt) >= fTimestamp(createdDate) &&
          fTimestamp(data.createdAt) <= fTimestamp(endDate)
      );
    }
  }


  return inputData;
}
