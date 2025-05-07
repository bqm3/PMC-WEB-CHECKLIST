import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Button from '@mui/material/Button';
import { Stack, Box, CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import axios from 'axios';
import P0TableRow from '../p0-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Ngaybc', label: 'Ngày gửi', width: 80 },
  { id: 'ent_user_AN', label: 'Người nhập (An ninh)', width: 150 },
  { id: 'ent_user_DV', label: 'Người nhập (Dịch vụ)', width: 150 },
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
const STORAGE_KEY = 'accessToken';

export default function GiamsatListView() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const table = useTable({ defaultOrderBy: 'Ngay_ghi_nhan' });

  const settings = useSettingsContext();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const { page, rowsPerPage } = table;
  const { p0, p0Count } = useGetP0_ByDuan(page, rowsPerPage);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState<any>();
  const [dataChecklistMonth, setDataChecklistMonth] = useState<any>({
    month: null,
    year: null,
  });

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

  const handleOpenCardDialog = () => {
    setCardDialogOpen(true);
  };

  const handleCloseCardDialog = () => {
    setCardDialogOpen(false);
  };

  const handleMonthChange = (value: Date | null) => {
    if (value) {
      setDataChecklistMonth((prev: any) => ({
        ...prev,
        month: value.getMonth() + 1, // Months are 0-indexed in JavaScript
      }));
    }
  };

  const handleYearChange = (value: Date | null) => {
    // Check if the selected date is valid and update the year
    if (value) {
      setDataChecklistMonth((prev: any) => ({
        ...prev,
        year: value.getFullYear(), // Get the year from the date
      }));
    }
  };

  const fetchExcelData = async () => {
    try {
      setLoadingReport(true);
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/api/v2/p0/export-excel/?year=${dataChecklistMonth.year}&month=${dataChecklistMonth.month}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Bao_cao_s0_${dataChecklistMonth.month}_${dataChecklistMonth.year}.xlsx`
      ); // Set the file name

      // Append to body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove(); // Prefer link.remove() over parentNode to directly remove the element

      // Release the blob URL after downloading
      window.URL.revokeObjectURL(url);

      setCardDialogOpen(false);
      setLoadingReport(false);
    } catch (error) {
      console.error('Error downloading the file:', error);

      // Optional: Add error handling to show a user-friendly message
      // For example, you might want to use a toast or notification library
      // toast.error('Failed to download the report. Please try again.');

      setCardDialogOpen(false);
      setLoadingReport(false);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomBreadcrumbs
          heading="Danh sách S0"
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Button variant="contained" size="large" color="primary" onClick={handleOpenCardDialog}>
            Báo cáo S0
          </Button>
        </div>
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

        <Dialog open={cardDialogOpen} onClose={handleCloseCardDialog} fullWidth maxWidth="sm">
          <DialogTitle>Báo cáo S0</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} m={1}>
              <DatePicker
                label="Tháng" // Corrected
                openTo="month"
                views={['month']}
                value={
                  dataChecklistMonth.month ? new Date(2024, dataChecklistMonth.month - 1) : null
                }
                onChange={handleMonthChange}
              />
              <DatePicker
                label="Năm" // Corrected
                views={['year']}
                value={dataChecklistMonth.year ? new Date(dataChecklistMonth.year, 0) : null}
                onChange={handleYearChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCardDialog}>Close</Button>
            <Button
              color="success"
              variant="contained"
              disabled={loadingReport}
              onClick={fetchExcelData}
            >
              {loadingReport ? <CircularProgress size={24} color="inherit" /> : 'Xuất file'}
            </Button>
          </DialogActions>
        </Dialog>

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
