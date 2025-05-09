import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {
  Button,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
  Box,
  TextField,
} from '@mui/material';
import Iconify from 'src/components/iconify';
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
import HSSETableRow from '../hsse-admin-table-row';
import DuanTableToolbar from '../hsse-table-toolbar';
import DuanTableFiltersResult from '../hsse-table-filters-result';

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<{ [key: string]: string[] }>({});
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleFetchWarnings = async () => {
    setOpen(true);
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.REACT_APP_HOST_API}/hsse/admin-warning`);
      setWarnings(res.data);
    } catch (err: any) {
      setError('Lỗi khi tải dữ liệu cảnh báo HSSE.');
    } finally {
      setLoading(false);
    }
  };

  const filteredWarnings = Object.entries(warnings).filter(([project]) =>
    project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportExcel = () => {
    const data: { project: string; warning: string }[] = [];

    filteredWarnings.forEach(([project, issues]) => {
      issues.forEach((issue: string) => {
        data.push({ project, warning: issue });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cảnh báo HSSE');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    saveAs(blob, `HSSE_CanhBao_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

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
              mb: { xs: 1, md: 2 },
            }}
          />
          <Button variant="contained" onClick={handleFetchWarnings}>
            Cảnh báo HSSE
          </Button>
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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Cảnh báo HSSE ngày hôm qua</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          {!loading && error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && Object.keys(warnings).length === 0 && (
            <Typography>Không có cảnh báo nào.</Typography>
          )}

          {!loading && !error && Object.keys(warnings).length > 0 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                  label="Tìm kiếm dự án"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Button variant="outlined" onClick={handleExportExcel}>
                  Xuất Excel
                </Button>
              </Box>

              {filteredWarnings.length === 0 ? (
                <Typography>Không tìm thấy dự án phù hợp.</Typography>
              ) : (
                filteredWarnings.map(([project, issues]) => (
                  <Accordion key={project}>
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                      <Typography fontWeight="bold">{project}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul>
                        {issues.map((issue, idx) => (
                          <li key={idx}>
                            <Typography>{issue}</Typography>
                          </li>
                        ))}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
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
