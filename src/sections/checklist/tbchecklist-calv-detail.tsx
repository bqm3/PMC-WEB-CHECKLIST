import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { CSVLink, CSVDownload } from 'react-csv';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Typography from '@mui/material/Typography';
import Image from 'src/components/image';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/material/';
import Stack from '@mui/material/Stack';
import {
  Pagination,
  paginationClasses,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetChecklistWeb, useGetCalv, useGetKhoiCV } from 'src/api/khuvuc';
// utils
import { getImageUrls } from 'src/utils/get-image';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
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
  IChecklist,
  IKhuvucTableFilters,
  IKhuvucTableFilterValue,
  TbChecklistCalv,
} from 'src/types/khuvuc';
//
import ChecklistTableRow from './detail/checklist-table-row';
import ChecklistTableToolbar from './detail/checklist-table-toolbar';
import ChecklistTableFiltersResult from './detail/checklist-table-filters-result'; //
import ChecklistPDF from './checklist-pdf';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Checklist', label: 'Tên checklist' },
  { id: 'ID_Hangmuc', label: 'Hạng mục (Khu vực- Tòa)', width: 250 },
  { id: 'ID_Tang', label: 'Tầng', width: 100 },
  { id: 'Ketqua', label: 'Kết quả', width: 120 },
  { id: 'Gioht', label: 'Giờ', width: 80 },
  { id: 'Anh', label: 'Hình ảnh', width: 100 },
  { id: 'Ghichu', label: 'Ghi chú', width: 100 },
  { id: '', width: 10 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';

type Props = {
  currentChecklist?: TbChecklistCalv[];
  dataChecklistC: any;
};

const headers = [
  { label: 'STT', key: 'stt' },
  { label: 'Hạng mục', key: 'hangMuc' },
  { label: 'Nội dung kiểm tra', key: 'tenChecklist' },
  { label: 'Giờ kiểm tra', key: 'gioKt' },
  { label: 'Kết quả', key: 'kq' },
  { label: 'Ghi chú', key: 'ghichu' },
  { label: 'Ảnh', key: 'anh' },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function TbChecklistCalvListView({ currentChecklist, dataChecklistC }: Props) {
  const table = useTable({ defaultOrderBy: 'ID_Checklist' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const view = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const [filtersTrangthai, setFiltersTrangthai] = useState<any>("all");

  const [tableData, setTableData] = useState<TbChecklistCalv[]>([]);

  const [dataFormatExcel, setDataFormatExcel] = useState<any>([]);

  const { calv } = useGetCalv();

  const [rowsPerPageCustom, setRowsPerPageCustom] = useState(table?.rowsPerPage || 30); // Giá trị mặc định của số mục trên mỗi trang

  // Use the checklist data in useEffect to set table data
  useEffect(() => {
    if (currentChecklist) {
      setTableData(currentChecklist);
    }
  }, [currentChecklist, table.page, table.rowsPerPage]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    filtersTrangthai,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

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

  const handleFiltersTinhtrang = useCallback(
    (name: string, value: any) => {
      table.onResetPage();
      setFiltersTrangthai(value);
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios
        .put(`https://checklist.pmcweb.vn/be/api/v2/ent_checklist/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const deleteRow = tableData?.filter((row) => row.ID_Checklist !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar('Xóa thành công!');
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

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData?.filter((row) => !table.selected.includes(row?.ID_Checklist));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData?.length,
      totalRowsInPage: dataInPage?.length,
      totalRowsFiltered: dataFiltered?.length,
    });
  }, [dataFiltered?.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const [open, setOpen] = useState(false);
  const [detailChecklist, setDetailChecklist] = useState<TbChecklistCalv>();

  const handleClickOpen = (data: TbChecklistCalv) => {
    setOpen(true);
    setDetailChecklist(data);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.checklist.edit(id));
    },
    [router]
  );

  useEffect(() => {
    const formattedData = tableData?.map((item, index) => ({
      stt: index + 1,
      hangMuc: item.ent_checklist.ent_hangmuc.Hangmuc || '',
      tenChecklist: item.ent_checklist.Checklist || '',
      gioKt: item.Gioht || '',
      kq: item.Ketqua,
      ghichu: item.Ghichu || '',
      anh:
        // const arrImage: any = typeof Anh === 'string' && Anh.trim().length > 0 ? Anh.split(',') : null
        item.Anh !== undefined && item.Anh !== null ? getImageUrls(1, item.Anh) : '',
    }));
    setDataFormatExcel(formattedData);
  }, [tableData]);

  const formatDateString = (dateString: any) => {
    if (dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Checklist trong ca"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              {
                name: 'Checklist',
                href: paths.dashboard.checklist.root,
              },
              { name: 'Danh sách' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <CSVLink
              data={dataFormatExcel}
              headers={headers}
              filename={`${dataChecklistC?.Ngay}_${dataChecklistC?.ent_khoicv.KhoiCV}_${dataChecklistC?.ent_calv.Tenca}_${dataChecklistC?.ent_user.Hoten}.csv`}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<Iconify icon="solar:export-bold" />}
              >
                Excel
              </Button>
            </CSVLink>
            <Button
              onClick={view.onTrue}
              variant="contained"
              color="error"
              startIcon={<Iconify icon="solar:export-bold" />}
            >
              PDF
            </Button>
          </Stack>
        </Stack>

        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          sx={{ pb: 2 }}
        >
          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Thông tin trong ca
            </Typography>
            Ca: {dataChecklistC?.ent_calv?.Tenca}
            <br />
            Người Checklist: {dataChecklistC?.ent_user?.Hoten}
            <br />
            Khối công việc: {dataChecklistC?.ent_khoicv?.KhoiCV}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'white' }}>
              {' '}
            </Typography>
            Ngày:{' '}
            {dataChecklistC?.Ngay ? formatDateString(dataChecklistC?.Ngay) : dataChecklistC?.Ngay}
            <br />
            Giờ bắt đầu - kết thúc: {dataChecklistC?.Giobd} - {dataChecklistC?.Giokt}
            <br />
            Tình trạng: {dataChecklistC?.Tinhtrang === 0 ? 'Mở ra' : 'Đóng ca'}
            <br />
          </Stack>
        </Box>
        <Card>
          <ChecklistTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            handleFiltersTinhtrang={handleFiltersTinhtrang}
          />

          {canReset && (
            <ChecklistTableFiltersResult
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
              rowCount={dataInPage?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataInPage.map((row) => row?.ID_Checklist)
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
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  //   onSelectAllRows={(checked) =>
                  //     table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Checklist))
                  //   }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <ChecklistTableRow
                        key={`${row.ID_Checklist}_${index}`}
                        calv={calv}
                        row={row}
                        selected={table.selected.includes(row.ID_Checklist)}
                        onSelectRow={() => table.onSelectRow(row.ID_Checklist)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Checklist)}
                        onViewRow={() => handleViewRow(row.ID_Checklist)}
                        handleClickOpen={() => handleClickOpen(row)}
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

          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '16px',
            }}
          >
            {/* Bộ chọn số mục hiển thị mỗi trang */}
            <FormControl variant="outlined" size="small">
              <InputLabel>Số mục mỗi trang</InputLabel>
              <Select
                value={rowsPerPageCustom}
                onChange={(event: any) => {
                  setRowsPerPageCustom(Number(event.target.value));
                  table.onChangeRowsPerPage(event); // Truyền trực tiếp event vào table.onChangeRowsPerPage
                }}
                label="Số mục mỗi trang"
                style={{ width: '150px' }}
              >
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            {/* Thành phần phân trang */}
            <Stack>
              <Pagination
                count={Math.ceil(dataFiltered.length / rowsPerPageCustom)} // Số trang
                page={table.page + 1} // Phân trang bắt đầu từ 1
                onChange={(event, newPage) => table.onChangePage(event, newPage - 1)} // Điều chỉnh để bắt đầu từ 0
                boundaryCount={2}
                sx={{
                  my: 1,
                  // mx: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{ textAlign: 'right', fontSize: 14, paddingRight: 1 }}
              >
                Tổng: {dataFiltered?.length}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Container>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {/* <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">

        </DialogTitle> */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {/* <CloseIcon /> */}
        </IconButton>
        <DialogContent dividers>
          <Image
            minWidth={500}
            minHeight={500}
            alt={detailChecklist?.ent_checklist?.Checklist}
            // src={`https://lh3.googleusercontent.com/d/${detailChecklist?.Anh}=s1000?authuser=0`}
            src={`${getImageUrls(1, detailChecklist?.Anh)}`}
            ratio="1/1"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </BootstrapDialog>

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

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <ChecklistPDF currentChecklist={currentChecklist} dataChecklistC={dataChecklistC} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
  filtersTrangthai,
}: {
  inputData: TbChecklistCalv[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  // dateError: boolean;
  filtersTrangthai: any;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filtersTrangthai !== "all") {
    inputData = inputData.filter(
      (checklist) => `${checklist?.ent_checklist?.Tinhtrang}` === `${filtersTrangthai}`
    );
  }

  if (name) {
    inputData = inputData.filter(
      (checklist) =>
        `${checklist.ent_checklist.Checklist}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_checklist.ent_khuvuc.Tenkhuvuc}`
          .toLowerCase()
          .indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_checklist.ent_hangmuc.Hangmuc}`
          .toLowerCase()
          .indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_checklist.ent_tang.Tentang}`.toLowerCase().indexOf(name.toLowerCase()) !==
          -1 ||
        `${checklist.Gioht}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.Ghichu}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
