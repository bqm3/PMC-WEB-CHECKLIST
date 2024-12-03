import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { useGetLoaiChiSoByDuan } from 'src/api/khuvuc';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  TableNoData,
  TablePaginationCustom,
} from 'src/components/table';
// types
import { IKhuvucTableFilters, IHangMucChiSo } from 'src/types/khuvuc';

import TableSelectedAction from '../table-selected-action';
import TableHeadCustom from '../table-head-custom';
import AreaTableRow from '../area-baocaochiso-checklist';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', },
  { id: '', width: 40 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function BaoCaoHangThangListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { hmCS } = useGetLoaiChiSoByDuan();

  const [dataBaocao, setDataBaocao] = useState<any>();

  const [tableData, setTableData] = useState<IHangMucChiSo[]>([]);

  useEffect(() => {
    if (hmCS.length > 0) {
      setTableData(hmCS);
    }
  }, [hmCS]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/ent_baocaochiso`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDataBaocao(response.data.data); // Không bị trùng tên
        console.log('data', response.data.data); // Sử dụng biến đã đổi tên
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomBreadcrumbs
          heading="Báo cáo chỉ số"
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
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataInPage?.length}
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
                rowCount={dataBaocao?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(checked, dataInPage?.map((row: any) => row.ID_Khuvuc))
              // }
              />

              <TableBody>
                {dataBaocao?.map((row: any, index: any) => (
                  <AreaTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row?.ent_khuvuc?.ID_Khuvuc)}
                    onSelectRow={() => table.onSelectRow(row?.ent_khuvuc?.ID_Khuvuc)}
                    // khoiCV={khoiCV}
                    index={index}
                  />
                ))}
                <TableNoData notFound={!dataBaocao} />
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
  inputData: IHangMucChiSo[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  dateError: boolean;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}

