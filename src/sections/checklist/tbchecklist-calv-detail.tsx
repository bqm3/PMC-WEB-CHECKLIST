import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { CSVLink, CSVDownload } from 'react-csv';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Label from 'src/components/label';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Image from 'src/components/image';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/material/';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetChecklistWeb, useGetCalv, useGetKhoiCV } from 'src/api/khuvuc';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
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
import ChecklistTableFiltersResult from './detail/checklist-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Checklist', label: 'Tên checklist', width: 150, align: 'left' },
  { id: 'ID_Hangmuc', label: 'Hạng mục', width: 150, align: 'center' },
  { id: 'Maso', label: 'Mã số', width: 100, align: 'center' },
  { id: 'Ketqua', label: 'Kết quả', width: 100, align: 'center' },
  { id: 'Gioht', label: 'Giờ checklist', width: 100, align: 'center' },
  { id: 'Anh', label: 'Ảnh', width: 100, align: 'center' },
  { id: 'Ghichu', label: 'Ghi chú', width: 100, align: 'center' },

  { id: '', width: 88 },
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

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState<TbChecklistCalv[]>([]);

  const [dataFormatExcel, setDataFormatExcel] = useState<any>([]);

  const { calv } = useGetCalv();

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

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios
        .put(`https://checklist.pmcweb.vn/be//api/ent_checklist/delete/${id}`, [], {
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
              autoHideDuration: 2000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    },
    [accessToken, enqueueSnackbar, dataInPage.length, table, tableData] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData?.filter((row) => !table.selected.includes(row.ID_Checklist));
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
        item.Anh !== undefined && item.Anh !== null
          ? `https://lh3.googleusercontent.com/d/${item.Anh}=s1000?authuser=0$`
          : '',
    }));
    setDataFormatExcel(formattedData);
  }, [tableData]);

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

          <CSVLink
            data={dataFormatExcel}
            headers={headers}
            filename={`${dataChecklistC?.Ngay}_${dataChecklistC?.ent_khoicv.KhoiCV}_${dataChecklistC?.ent_calv.Tenca}_${dataChecklistC?.ent_giamsat.Hoten}.csv`}
          >
            <Button variant="contained" startIcon={<Iconify icon="solar:export-bold" />}>
              Export
            </Button>
          </CSVLink>
        </Stack>
        <Card>
          <ChecklistTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
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
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Checklist))
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
                  {dataInPage.map((row) => (
                    <ChecklistTableRow
                      key={row.ID_Checklist}
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

          <TablePaginationCustom
            count={dataFiltered?.length}
            rowsPerPageOptions={[20, 30, 50]}
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
            src={`https://lh3.googleusercontent.com/d/${detailChecklist?.Anh}=s1000?authuser=0`}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: TbChecklistCalv[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (checklist) =>
        `${checklist.ent_checklist.Checklist}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_checklist.Maso}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_checklist.ent_hangmuc.Hangmuc}`
          .toLowerCase()
          .indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_checklist.ent_hangmuc.ent_khuvuc.Tenkhuvuc}`
          .toLowerCase()
          .indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
