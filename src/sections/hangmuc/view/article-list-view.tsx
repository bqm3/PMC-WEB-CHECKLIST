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
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders } from 'src/_mock';
import { useGetHangMuc, useGetKhoiCV, useGetToanha } from 'src/api/khuvuc';
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

import TableSelectedAction from '../table-selected-action';
import TableHeadCustom from '../table-head-custom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Hangmuc', label: 'Mã', width: 50 },
  { id: 'Hangmuc', label: 'Tên hạng mục' },
  { id: 'MaQrCode', label: 'Mã Qr Code', width: 200 },
  { id: 'ID_Khuvuc', label: 'Khu vực', width: 200 },
  { id: 'Important', label: 'Quan trọng', width: 120 },
  { id: 'ID_KhoiCV', label: 'Khối công việc', width: 240 },
  { id: '', width: 10 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
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

  const [loading, setLoading] = useState<Boolean | any>(false);

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { hangMuc } = useGetHangMuc();

  const { khoiCV } = useGetKhoiCV();

  const [tableData, setTableData] = useState<IHangMuc[]>([]);

  const [dataSelect, setDataSelect] = useState<IHangMuc>();

  const { toanha } = useGetToanha();

  const BUILDING_OPTIONS = useMemo(
    () => [
      ...toanha.map((khoi) => ({
        value: khoi.ID_Toanha.toString(),
        label: khoi.Toanha,
      })),
    ],
    [toanha]
  );

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...khoiCV.map((khoi) => ({
        value: khoi.ID_KhoiCV.toString(),
        label: khoi.KhoiCV,
      })),
    ],
    [khoiCV]
  );

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
        .put(`${process.env.REACT_APP_HOST_API}/ent_hangmuc/delete/${id}`, [], {
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

  const handleDownloadImage = async () => {
    const qrCodeData = encodeURIComponent(String(dataSelect?.MaQrCode || ''));
    const caption = encodeURIComponent(`${dataSelect?.Hangmuc} - ${dataSelect?.MaQrCode}`);
    const originalImage = `https://quickchart.io/qr?text=${qrCodeData}&caption=${caption}&size=300x300&captionFontSize=8`;
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
    const deleteRows = tableData.filter((row) => table.selected.includes(row.ID_Hangmuc));
    await axios
      .put(`${process.env.REACT_APP_HOST_API}/ent_hangmuc/delete-mul`, deleteRows, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        table.onUpdatePageDeleteRow(dataInPage.length);
        enqueueSnackbar('Xóa thành công!');
        const notDeleteRows = tableData.filter((row) => !table.selected.includes(row.ID_Hangmuc));
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
  }, [accessToken, enqueueSnackbar, dataFiltered.length, dataInPage.length, table, tableData]);

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

  const handleDownloadImages = async () => {
    try {
      const selectedRows = table.selected;
      // Assuming you have dataInPage which holds the information for each row
      const selectedQrCodes = dataInPage
        .filter((row) => selectedRows.includes(row.ID_Hangmuc)) // Filter the selected rows
        .map((row) => row.MaQrCode); // Replace QrCodeValue with the appropriate field

      const selectedHangMucs = dataInPage
        .filter((row) => selectedRows.includes(row.ID_Hangmuc)) // Filter the selected rows
        .map((row) => row.Hangmuc);


      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/ent_hangmuc/generate-qr-codes`,
        {
          maQrCodes: selectedQrCodes,  // gửi mảng thay vì chuỗi
          hangMucs: selectedHangMucs,   // gửi mảng thay vì chuỗi
        },
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
      link.setAttribute('download', 'qr_code_hangmuc.zip'); // Set the name for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error while generating QR codes:', error);
    }
  };

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
              mb: { xs: 1, md: 3 },
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
                      (tab.value === '4' && 'info') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && hangMuc?.length}
                    {tab.value === '1' &&
                      hangMuc?.filter((item) => {
                        let ids = item.ent_khuvuc.ID_KhoiCVs;

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
                      hangMuc?.filter((item) => {
                        let ids = item.ent_khuvuc.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '2'
                        return (
                          ids === '2' ||
                          ids.startsWith('2,') ||
                          ids.includes(',2,') ||
                          ids.endsWith(',2')
                        );
                      }).length}
                    {tab.value === '3' &&
                      hangMuc?.filter((item) => {
                        let ids = item.ent_khuvuc.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '3'
                        return (
                          ids === '3' ||
                          ids.startsWith('3,') ||
                          ids.includes(',3,') ||
                          ids.endsWith(',3')
                        );
                      }).length}
                    {tab.value === '4' &&
                      hangMuc?.filter((item) => {
                        let ids = item.ent_khuvuc.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '4'
                        return (
                          ids === '4' ||
                          ids.startsWith('4,') ||
                          ids.includes(',4,') ||
                          ids.endsWith(',4')
                        );
                      }).length}
                    {tab.value === '5' &&
                      hangMuc?.filter((item) => {
                        let ids = item.ent_khuvuc.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '1'
                        return (
                          ids === '5' ||
                          ids.startsWith('5,') ||
                          ids.includes(',5,') ||
                          ids.endsWith(',5')
                        );
                      }).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            headers={headers}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            buildingOptions={BUILDING_OPTIONS}
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
              rowCount={dataInPage?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataInPage.map((row) => row?.ID_Hangmuc)
                )
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
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, dataInPage?.map((row) => row.ID_Hangmuc))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <OrderTableRow
                        key={row.ID_Hangmuc}
                        row={row}
                        selected={table.selected.includes(row.ID_Hangmuc)}
                        onSelectRow={() => table.onSelectRow(row.ID_Hangmuc)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Hangmuc)}
                        onViewRow={() => handleViewRow(row.ID_Hangmuc)}
                        onQrRow={() => handleQrRow(row)}
                        khoiCV={khoiCV}
                        index={index}
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

      <FileManagerNewFolderDialog
        open={upload.value}
        onClose={upload.onFalse}
        setLoading={setLoading}
      />

      <Dialog open={confirmQr.value} onClose={confirmQr.onFalse} maxWidth="sm">
        <DialogTitle sx={{ pb: 2 }}>Ảnh Qr Code</DialogTitle>

        <DialogContent>
          <Card>
            <Image
              src={`https://quickchart.io/qr?text=${dataSelect?.MaQrCode}&caption=${`${dataSelect?.Hangmuc} - ${dataSelect?.MaQrCode}`}&size=350x350&captionFontSize=8`}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Bạn có muốn xóa <strong> {table.selected.length} </strong> hạng mục?
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
  inputData: IHangMuc[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  // dateError: boolean;
}) {
  const { status, name, building } = filters;

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
        order.Hangmuc?.normalize('NFC')?.toLowerCase().indexOf(name?.normalize('NFC')?.toLowerCase()) !== -1 ||
        order.ent_khuvuc.Tenkhuvuc?.normalize('NFC')?.toLowerCase().indexOf(name?.normalize('NFC')?.toLowerCase()) !== -1 ||
        order?.MaQrCode?.normalize('NFC')?.toLowerCase().indexOf(name?.normalize('NFC')?.toLowerCase()) !== -1 ||
        order.ent_khuvuc.ent_toanha.Toanha?.normalize('NFC')?.toLowerCase().indexOf(name?.normalize('NFC')?.toLowerCase()) !== -1
    );
  }

  if (building.length) {
    inputData = inputData.filter((item) => building.includes(String(item?.ent_khuvuc.ent_toanha?.ID_Toanha)));
  }

  if (status !== 'all') {
    // Convert status to a number for comparison
    const statusAsNumber = parseInt(status, 10);

    // Filter inputData based on ID_KhoiCV
    inputData = inputData.filter((order) => {
      const ids = order?.ent_khuvuc?.ent_khuvuc_khoicvs;

      // Check if ids is an array and contains the statusAsNumber
      return (
        Array.isArray(ids) && ids.some((item) => Number(item.ID_KhoiCV) === Number(statusAsNumber))
      );
    });
  }

  return inputData;
}
