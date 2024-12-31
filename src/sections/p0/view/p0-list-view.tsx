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
import { useGetHSSE, useGetP0_ByDuan } from 'src/api/khuvuc';
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
import { IChecklistTableFilters, IP0 } from 'src/types/khuvuc';
//
import P0TableRow from '../p0-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Ngaybc', label: 'Ngày gửi', width: 80 },
  { id: 'ent_user_AN', label: 'Người nhập (An ninh)', width: 150 },
  { id: 'ent_user_KT', label: 'Người nhập (Kế toán)', width: 150 },
  { id: 'Doanhthu', label: 'Doanh thu', width: 100 },
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

// ----------------------------------------------------------------------

export default function GiamsatListView() {
  const table = useTable({ defaultOrderBy: 'Ngay_ghi_nhan' });

  const settings = useSettingsContext();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const { page, rowsPerPage } = table;
  const { p0, p0Loading, p0Error, p0Empty, p0Count } = useGetP0_ByDuan(page, rowsPerPage);

  const [tableData, setTableData] = useState<IP0[]>([]);

  useEffect(() => {
    if (p0?.length > 0) {
      setTableData(p0);
    }
  }, [p0, page, rowsPerPage]);



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
      router.push(paths.dashboard.p0.edit(id));
    },
    [router]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomBreadcrumbs
          heading="Danh sách P0"
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

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered
                  // .slice(
                  //   table.page * table.rowsPerPage,
                  //   table.page * table.rowsPerPage + table.rowsPerPage
                  // )
                  .map((row) => (
                    <P0TableRow
                      key={row.ID_P0}
                      row={row}
                      selected={table.selected.includes(`${row.ID_P0}`)}
                      onViewRow={() => handleViewRow(`${row.ID_P0}`)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, dataFiltered?.length, dataFiltered?.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={p0Count}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
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
  inputData: IP0[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
  // dateError: boolean;
}) {
  const { name } = filters
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
        `${order.Doanhthu}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.ID_User_KT}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.ID_User_AN}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (building.length) {
  //   inputData = inputData.filter((item) => building.includes(String(item?.ID_Chinhanh)));
  // }

  return inputData;
}
