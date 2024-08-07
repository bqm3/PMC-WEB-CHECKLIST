import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
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
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Image from 'src/components/image';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, ORDER_STATUS_OPTIONS, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetKhuVuc, useGetHangMuc, useGetKhoiCV } from 'src/api/khuvuc';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingButton } from '@mui/lab';
import Stack from '@mui/material/Stack';
// routes
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
import { usePopover } from 'src/components/custom-popover';
// types
import { IHangMuc, IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';
//
import OrderTableRow from '../article-table-row';
import OrderTableToolbar from '../article-table-toolbar';
import OrderTableFiltersResult from '../article-table-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';



// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Hangmuc', label: 'Mã hạng mục', width: 150 },
  { id: 'Hangmuc', label: 'Tên hạng mục' },
  { id: 'MaQrCode', label: 'Mã Qr Code', width: 150, align: 'center' },
  { id: 'ID_Khuvuc', label: 'Khu vực', width: 200, align: 'center' },
  { id: 'ID_KhoiCV', label: 'Khối công việc', width: 150, align: 'center' },
  { id: '', width: 88 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function AreaListView() {
  const table = useTable({ defaultOrderBy: 'Hangmuc' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const popover = usePopover();

  const upload = useBoolean();

  const confirmQr = useBoolean();

  const [loading, setLoading] = useState<Boolean |any>(false)

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { hangMuc } = useGetHangMuc();

  const { khoiCV } = useGetKhoiCV();

  const [tableData, setTableData] = useState<IHangMuc[]>([]);

  const [dataSelect, setDataSelect] = useState<IHangMuc>();

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([{ value: 'all', label: 'Tất cả' }]);

  useEffect(() => {
    // Assuming khoiCV is set elsewhere in your component
    khoiCV.forEach(khoi => {
      set_STATUS_OPTIONS(prevOptions => [
        ...prevOptions,
        { value: khoi.ID_Khoi.toString(), label: khoi.KhoiCV }
      ]);
    });
  }, [khoiCV]);

  useEffect(() => {
    if (hangMuc?.length > 0) {
      setTableData(hangMuc);
    }
  }, [hangMuc]);

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

  const canReset = !!filters.name || filters.status !== 'all';

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
        .put(`https://checklist.pmcweb.vn/be/api/ent_hangmuc/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Hangmuc !== id);
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

  const handleDownloadImage = async () => {
    const originalImage = `https://api.qrserver.com/v1/create-qr-code/?data=${dataSelect?.MaQrCode}`;
    const image = await fetch(originalImage);
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
    const link = document.createElement('a')
    link.href = imageURL;
    link.download = `${dataSelect?.MaQrCode}`;
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  };

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData?.filter((row) => !table.selected.includes(row.ID_Hangmuc));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData?.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered?.length,
    });
  }, [dataFiltered?.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.hangmuc.edit(id));
    },
    [router]
  );

  const handleQrRow = useCallback(
    (data: IHangMuc) => {
      confirmQr.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirmQr, popover]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const headers = [
    { label: 'STT', key: 'stt' },
    { label: 'Tên hạng mục', key: 'Hangmuc' },
    { label: 'Mã Qr Code', key: 'MaQrCode' },
    { label: 'Khu vực', key: 'Tenkhuvuc' },
    { label: 'Tiêu chuẩn kiểm tra', key: 'Tieuchuankt' },
    { label: 'Khối công việc', key: 'KhoiCV' },
  ];

  const [dataFormatExcel, setDataFormatExcel] = useState<any>([]);

  useEffect(() => {
    const formattedData = dataFiltered?.map((item, index) => ({
      stt:index + 1,
      Hangmuc: item.Hangmuc || '',
      MaQrCode: item.MaQrCode || '',
      Tenkhuvuc: item.ent_khuvuc.Tenkhuvuc,
      Tieuchuankt: item.Tieuchuankt || '',
      KhoiCV:
        item.ent_khoicv.KhoiCV || '',
    }));
    setDataFormatExcel(formattedData);
  }, [dataFiltered]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomBreadcrumbs
          heading="Hạng mục"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Hạng mục',
              href: paths.dashboard.hangmuc.root,
            },
            { name: 'Danh sách' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
         <LoadingButton
         loading={loading}
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload
          </LoadingButton>
        </Stack>

        <Card>
        <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
        {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === '1' && 'success') ||
                      (tab.value === '2' && 'warning') ||
                      (tab.value === '3' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && hangMuc?.length}
                    {tab.value === '1' &&
                      hangMuc?.filter((item) => `${item.ID_KhoiCV}` === '1').length}

                    {tab.value === '2' &&
                      hangMuc?.filter((item) => `${item.ID_KhoiCV}` === '2').length}
                    {tab.value === '3' &&
                      hangMuc?.filter((item) => `${item.ID_KhoiCV}` === '3').length}
                    {tab.value === '4' &&
                      hangMuc?.filter((item) => `${item.ID_KhoiCV}` === '4').length}
                  </Label>
                }
              />
            ))}
            </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            headers={headers}
            dataFormatExcel={dataFormatExcel}
            
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <OrderTableFiltersResult
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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Hangmuc))
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Hangmuc))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.ID_Hangmuc}
                        row={row}
                        selected={table.selected.includes(row.ID_Hangmuc)}
                        onSelectRow={() => table.onSelectRow(row.ID_Hangmuc)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Hangmuc)}
                        onViewRow={() => handleViewRow(row.ID_Hangmuc)}
                        onQrRow={()=> handleQrRow(row)}
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

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} setLoading={setLoading}/>

      <Dialog open={confirmQr.value} onClose={confirmQr.onFalse} maxWidth="sm">
        <DialogTitle sx={{ pb: 2 }}>Ảnh Qr Code</DialogTitle>

        <DialogContent>
          <Card>
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${dataSelect?.MaQrCode}&amp;size=300x300`}
              alt=""
              title=""
            />
          </Card>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color='success' onClick={handleDownloadImage}>Download</Button>
          <Button variant="outlined" color="inherit" onClick={confirmQr.onFalse}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
  inputData: IHangMuc[];
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
    inputData = inputData?.filter(
      (order) =>
        order.Hangmuc.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_khuvuc.Tenkhuvuc.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order?.MaQrCode?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_khuvuc.ent_toanha.Toanha.toLowerCase().indexOf(name.toLowerCase()) !== -1 
    );
  }

  if (status !== 'all') {
    inputData = inputData?.filter((order) => `${order?.ID_KhoiCV}` === status);
  }

  return inputData;
}
