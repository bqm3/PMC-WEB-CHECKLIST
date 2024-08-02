// types
import { IProductItem, IProductTableFilterValue, IProductTableFilters } from 'src/types/product';
import { IService, ITypeRoom } from 'src/types/room';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import { useCallback, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
// @mui
import Card from '@mui/material/Card';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
// _mock
import { RouterLink } from 'src/routes/components';
import Scrollbar from 'src/components/scrollbar';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import isEqual from 'lodash/isEqual';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { useGetServices } from 'src/api/product';
import { useRouter } from 'src/routes/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
//
import ServiceTableRow from '../service-table-row';
// import ProductTableToolbar from '../product-table-toolbar';
// import ProductTableFiltersResult from '../product-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'unit', label: 'Unit', width: 160 },
  { id: 'price', label: 'Price', width: 140 },
  { id: 'status', label: 'Status', width: 140 },
  { id: 'type_service', label: 'Type Service', width: 160 },
  { id: '', width: 88 },
];

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const defaultFilters: IProductTableFilters = {
  name: '',
  publish: [],
  stock: [],
};

// ----------------------------------------------------------------------

export default function TypeRoomListView() {
  const router = useRouter();

  const table = useTable();

  const settings = useSettingsContext();

  const [tableDataTypeRoom, setTableDataTypeRoom] = useState<IService[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { services, servicesLoading, servicesEmpty } = useGetServices()


  const confirm = useBoolean();



  useEffect(() => {
    if (services.length) {
      setTableDataTypeRoom(services)
    }
  }, [services])

  const dataFiltered = applyFilter({
    inputData: services,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || servicesEmpty;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableDataTypeRoom.filter((row) => row.id !== id);
      setTableDataTypeRoom(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableDataTypeRoom]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableDataTypeRoom.filter((row) => !table.selected.includes(row.id));
    setTableDataTypeRoom(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableDataTypeRoom.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableDataTypeRoom]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
  );


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Service',
              href: paths.dashboard.service.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.service.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create Service
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableDataTypeRoom.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableDataTypeRoom.map((row) => row.id)
                )
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
                  rowCount={tableDataTypeRoom.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableDataTypeRoom.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {servicesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <ServiceTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableDataTypeRoom.length)}
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
}: {
  inputData: IService[];
  comparator: (a: any, b: any) => number;
  filters: IProductTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (product) => product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }


  return inputData;
}
