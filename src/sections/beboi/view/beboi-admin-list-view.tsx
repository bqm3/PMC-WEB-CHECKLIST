import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { Stack } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders } from 'src/_mock';
import { useGetHSSEAll } from 'src/api/khuvuc';
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
// types
import { IChecklistTableFilters, IHSSE } from 'src/types/khuvuc';
//
import HSSETableRow from '../beboi-admin-table-row';
import DuanTableToolbar from '../beboi-table-toolbar';
import DuanTableFiltersResult from '../beboi-table-filters-result'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Ten_du_an', label: 'Dự án', width: 150 },
  { id: 'Nguoi_tao', label: 'Người gửi', width: 150 },
  { id: 'Dien_cu_dan', label: 'Điện cư dân', width: 100 },
  { id: 'Dien_cdt', label: 'Điện CĐT', width: 100 },
  { id: 'Nuoc_cu_dan', label: 'Nước cư dân', width: 100 },
  { id: 'Nuoc_cdt', label: 'Nước CĐT', width: 100 },
  { id: 'Xa_thai', label: 'Xả thải', width: 100 },
  { id: 'Rac_sh', label: 'Rác', width: 100 },
  { id: '', width: 10 },
];

const defaultFilters: IChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
};

// ----------------------------------------------------------------------

export default function GiamsatListView() {
  const table = useTable({ defaultOrderBy: 'Ngay_ghi_nhan' });

  const settings = useSettingsContext();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const { hsse } = useGetHSSEAll();

  const [tableData, setTableData] = useState<IHSSE[]>([]);

  useEffect(() => {
    if (hsse?.length > 0) {
      setTableData(hsse);
    }
  }, [hsse]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.hsse.edit(id));
    },
    [router]
  );

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
              { name: 'Tổng hợp' },
            ]}
            sx={{
              mb: { xs: 1, md: 3 },
            }}
          />
        </Stack>

        <DuanTableToolbar
          filters={filters}
          onFilters={handleFilters}
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
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID))
                // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <HSSETableRow
                        key={row.ID}
                        row={row}
                        selected={table.selected.includes(`${row.ID}`)}
                        onViewRow={() => handleViewRow(`${row.ID}`)}
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
  inputData: IHSSE[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
  // dateError: boolean;
}) {
  const { name } = filters;

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
        `${order.Ten_du_an}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.Nguoi_tao}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (building.length) {
  //   inputData = inputData.filter((item) => building.includes(String(item?.ID_Chinhanh)));
  // }

  return inputData;
}
