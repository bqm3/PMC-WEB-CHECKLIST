import { useState, useCallback, useEffect, useMemo } from 'react';
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
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, ORDER_STATUS_OPTIONS, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingButton } from '@mui/lab';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import { IHangMuc, IKhuvuc, IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';
//
import AreaTableRow from '../area-table-row';
import AreaTableToolbar from '../area-table-toolbar';
import OrderTableFiltersResult from '../area-table-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';

import TableSelectedAction from '../table-selected-action';
import TableHeadCustom from '../table-head-custom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Khuvuc', label: 'Mã', width: 50 },
  { id: 'Tenkhuvuc', label: 'Tên khu vực' },
  { id: 'ID_Toanha', label: 'Tòa nhà', width: 150 },
  { id: 'MaQrCode', label: 'Mã Qr Code', width: 150 },
  { id: 'ID_KhoiCV', label: 'Khối công việc', width: 250 },
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
  const table = useTable({ defaultOrderBy: 'ID_Khuvuc' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();
  const popover1 = usePopover();

  const confirm = useBoolean();
  const confirm1 = useBoolean();

  const confirmQr = useBoolean();
  const confirmQrHm = useBoolean();

  const upload = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [loading, setLoading] = useState<Boolean | any>(false);

  const [filters, setFilters] = useState(defaultFilters);

  const { khuvuc, khuvucLoading, khuvucEmpty } = useGetKhuVuc();

  const { khoiCV } = useGetKhoiCV();

  const [tableData, setTableData] = useState<IKhuvuc[]>([]);

  const [dataSelect, setDataSelect] = useState<IKhuvuc>();

  useEffect(() => {
    if (khuvuc.length > 0) {
      setTableData(khuvuc);
    }
  }, [khuvuc]);

  const STATUS_OPTIONS = useMemo(() => [
    { value: 'all', label: 'Tất cả' },
    ...khoiCV.map(khoi => ({
      value: khoi.ID_KhoiCV.toString(),
      label: khoi.KhoiCV
    }))
  ], [khoiCV]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    // dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
        .put(`https://checklist.pmcweb.vn/be/api/v2/ent_khuvuc/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData.filter((row) => row.ID_Khuvuc !== id);
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
    const qrCodeData = encodeURIComponent(String(dataSelect?.MaQrCode || ''));
    const originalImage = `https://quickchart.io/qr?text=${qrCodeData}&caption=${dataSelect?.Tenkhuvuc}`;
    const image = await fetch(originalImage);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = `${dataSelect?.MaQrCode}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteRows = useCallback(async () => {
    const deleteRows = tableData.filter((row) => table.selected.includes(row.ID_Khuvuc));
    await axios
      .put(`https://checklist.pmcweb.vn/be/api/v2/ent_khuvuc/delete-mul`, deleteRows, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        table.onUpdatePageDeleteRow(dataInPage.length);
        enqueueSnackbar('Xóa thành công!');
        const notDeleteRows = tableData.filter((row) => !table.selected.includes(row.ID_Khuvuc));
        setTableData(notDeleteRows);

        table.onUpdatePageDeleteRows({
          totalRows: tableData.length,
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
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
  }, [accessToken, enqueueSnackbar, dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.khuvuc.edit(id));
    },
    [router]
  );

  const handleViewRow1 = useCallback((data: any) => {
    const url = paths.dashboard.hangmuc.edit(data);
    window.open(url, '_blank');
  }, []);

  const handleQrRow = useCallback(
    (data: IKhuvuc) => {
      confirmQr.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirmQr, popover]
  );

  const handleQrRowHM = useCallback(
    (data: any) => {
      confirmQrHm.onTrue();
      popover1.onClose();
      setDataSelect(data);
    },
    [confirmQrHm, popover1]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const headers = [
    { label: 'STT', key: 'stt' },
    { label: 'Tên khu vực', key: 'Tenkhuvuc' },
    { label: 'Tòa nhà', key: 'Toanha' },
    { label: 'Mã Qr Code', key: 'MaQrCode' },
    { label: 'Số thứ tự', key: 'Sothutu' },
    { label: 'Mã khu vực', key: 'Makhuvuc' },
    { label: 'Khối công việc', key: 'KhoiCV' },
  ];

  const handleDownloadImages  = async () => {
    try {
      const selectedRows = table.selected; 
      // Assuming you have dataInPage which holds the information for each row
      const selectedQrCodes = dataInPage
        .filter((row) => selectedRows.includes(row.ID_Khuvuc)) // Filter the selected rows
        .map((row) => row.MaQrCode); // Replace QrCodeValue with the appropriate field
  
      const maQrCodes = selectedQrCodes.join(',');

      const response = await axios.post(
        `https://checklist.pmcweb.vn/be/api/v2/ent_khuvuc/generate-qr-codes?maQrCodes=${maQrCodes}`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob', // Specify the response type as blob to handle the file download
        }
      );
  
      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'qr_code_khuvuc.zip'); // Set the name for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error while generating QR codes:', error);
    }
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Khu vực"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              {
                name: 'Khu vực',
                href: paths.dashboard.khuvuc.root,
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
                    {tab.value === 'all' && khuvuc?.length}
                    {tab.value === '1' &&
                      khuvuc?.filter((item) => {
                        let ids = item.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '1' ||
                          ids.startsWith('1,') ||
                          ids.includes(',1,') ||
                          ids.endsWith(',1')
                        );
                      }).length}

                    {tab.value === '2' &&
                      khuvuc?.filter((item) => {
                        let ids = item.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '2' ||
                          ids.startsWith('2,') ||
                          ids.includes(',2,') ||
                          ids.endsWith(',2')
                        );
                      }).length}
                    {tab.value === '3' &&
                      khuvuc?.filter((item) => {
                        let ids = item.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '3' ||
                          ids.startsWith('3,') ||
                          ids.includes(',3,') ||
                          ids.endsWith(',3')
                        );
                      }).length}
                    {tab.value === '4' &&
                      khuvuc?.filter((item) => {
                        let ids = item.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '4' ||
                          ids.startsWith('4,') ||
                          ids.includes(',4,') ||
                          ids.endsWith(',4')
                        );
                      }).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <AreaTableToolbar
            filters={filters}
            onFilters={handleFilters}
            headers={headers}
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
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataInPage?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, dataInPage?.map((row) => row?.ID_Khuvuc))
              }
              action={
               <>
                 <Tooltip title="Download">
                  <IconButton color="primary" onClick={handleDownloadImages}>
                    <Iconify icon="solar:download-square-bold" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>

               </>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={khuvuc?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, dataInPage?.map((row) => row.ID_Khuvuc))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <AreaTableRow
                        key={row.ID_Khuvuc}
                        row={row}
                        selected={table.selected.includes(row.ID_Khuvuc)}
                        onSelectRow={() => table.onSelectRow(row.ID_Khuvuc)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Khuvuc)}
                        onViewRow={() => handleViewRow(row.ID_Khuvuc)}
                        onViewRow1={(data: any) => handleViewRow1(data)}
                        onQrRow={() => handleQrRow(row)}
                        onQrRowHM={(data: any) => handleQrRowHM(data)}
                        khoiCV={khoiCV}
                        index={index}
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

      <FileManagerNewFolderDialog
        open={upload.value}
        onClose={upload.onFalse}
        setLoading={setLoading}
      />

      <Dialog open={confirmQr.value} onClose={confirmQr.onFalse} maxWidth="sm">
        <DialogTitle sx={{ pb: 2 }}>Ảnh Qr Code Khu vực</DialogTitle>

        <DialogContent>
          <Card>
            <Image
              src={`https://quickchart.io/qr?text=${dataSelect?.MaQrCode}&size=300`}
              alt=""
              title=""
            />
          </Card>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="success" onClick={handleDownloadImage}>
            Download
          </Button>
          <Button variant="outlined" color="inherit" onClick={confirmQr.onFalse}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmQrHm.value} onClose={confirmQrHm.onFalse} maxWidth="sm">
        <DialogTitle sx={{ pb: 2 }}>Ảnh Qr Code Hạng mục</DialogTitle>

        <DialogContent>
          <Card>
            <Image
              src={`https://quickchart.io/qr?text=${dataSelect?.MaQrCode}&size=300`}
              alt=""
              title=""
            />
          </Card>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="success" onClick={handleDownloadImage}>
            Download
          </Button>
          <Button variant="outlined" color="inherit" onClick={confirmQrHm.onFalse}>
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
            Bạn có muốn xóa <strong> {table.selected.length} </strong> khu vực?
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
            Xóa
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
  inputData: IKhuvuc[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        `${order.Tenkhuvuc}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.MaQrCode}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.ent_toanha.Toanha}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    // Convert status to a number for comparison
    const statusAsNumber = parseInt(status, 10);
  
    // Filter inputData based on ID_KhoiCV
    inputData = inputData.filter((order) => {
      const ids = order?.ent_khuvuc_khoicvs;
  
      // Check if ids is an array and contains the statusAsNumber
      return Array.isArray(ids) && ids.some((item) => Number(item.ID_KhoiCV) === Number(statusAsNumber));
    });
  }

  return inputData;
}

// 13000 + 1000 + 1000
// </dfn></dfn>
