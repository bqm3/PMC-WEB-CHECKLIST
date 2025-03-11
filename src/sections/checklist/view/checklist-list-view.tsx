import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
// @mui
import { alpha } from '@mui/material/styles';
import Label from 'src/components/label';
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
import Stack from '@mui/material/Stack';
import {
  Pagination,
  paginationClasses,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, KHUVUC_STATUS_OPTIONS, PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { useGetChecklistWeb, useGetCalv, useGetKhoiCV, useGetToanha } from 'src/api/khuvuc';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
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
// types
import {
  IChecklist,
  IKhuvucTableFilters,
  IKhuvucTableFilterValue,
  IChecklistTableFilters,
} from 'src/types/khuvuc';
//
import ChecklistTableRow from '../checklist-table-row';
import ChecklistTableToolbar from '../checklist-table-toolbar';
import ChecklistTableFiltersResult from '../checklist-table-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';
import TableHeadCustom from '../table-head-custom';
import TableSelectedAction from '../table-selected-action';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Checklist', label: 'Mã', width: 10 },
  { id: 'Checklist', label: 'Tên checklist' },
  { id: 'ID_Hangmuc', label: 'Hạng mục', width: 230, align: 'center' },
  { id: 'ID_Khuvuc', label: 'Khu vực', width: 230, align: 'center' },
  { id: 'ID_KhoiCVs', label: 'Khối công việc', width: 200, align: 'center' },
  { id: '', width: 10 },
];

const defaultFilters: IChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function ChecklistCalvListView() {
  const table = useTable({ defaultOrderBy: 'ID_Checklist' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const upload = useBoolean();

  const uploadData = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [loading, setLoading] = useState<Boolean | any>(false);

  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState<IChecklist[]>([]);

  const { checkList } = useGetChecklistWeb();

  const { calv } = useGetCalv();

  const { khoiCV } = useGetKhoiCV();

  const { toanha } = useGetToanha();

  const [rowsPerPageCustom, setRowsPerPageCustom] = useState(table?.rowsPerPage || 30); // Giá trị mặc định của số mục trên mỗi trang


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

  const BUILDING_OPTIONS = useMemo(
    () => [
      ...toanha.map((khoi) => ({
        value: khoi.ID_Toanha.toString(),
        label: khoi.Toanha,
      })),
    ],
    [toanha]
  );

  // Use the checklist data in useEffect to set table data
  useEffect(() => {
    if (checkList) {
      setTableData(checkList);
    }
  }, [checkList, table.page, table.rowsPerPage]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );


  const denseHeight = table.dense ? 60 : 60;

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

  const handleDeleteRows = useCallback(async () => {
    const deleteRows = tableData.filter((row) => table.selected.includes(row.ID_Checklist));
    await axios
      .put(`https://checklist.pmcweb.vn/be/api/v2/ent_checklist/delete-mul`, deleteRows, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        table.onUpdatePageDeleteRow(dataInPage.length);
        enqueueSnackbar('Xóa thành công!');
        const notDeleteRows = tableData.filter((row) => !table.selected.includes(row.ID_Checklist));
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
      router.push(paths.dashboard.checklist.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const headers = [
    { label: 'Tên tòa nhà', key: 'tentoanha' },
    { label: 'Tên khu vực', key: 'tenkhuvuc' },
    { label: 'Tên hạng mục', key: 'tenhangmuc' },
    { label: 'Tên tầng', key: 'Tentang' },
    { label: 'Tên khối công việc', key: 'tenkhoicongviec' },
    { label: 'Tên checklist', key: 'tencl' },
    { label: 'Tiêu chuẩn checklist', key: 'tieuchuan' },
    { label: 'Giá trị định danh', key: 'Giatridinhdanh' },
    { label: 'Giá trị lỗi', key: 'Giatriloi' },
    { label: 'Nhập', key: 'Nhap' },
    { label: 'Các giá trị nhận', key: 'Giatrinhan' },
    { label: 'Quan trọng', key: 'Quantrong' },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const khoiCVNames: { [key: string]: string } = {
    '1': 'Khối làm sạch',
    '2': 'Khối kỹ thuật',
    '3': 'Khối an ninh',
    '4': 'Khối dịch vụ',
    '5': 'Khối F&B',
    // Add other mappings here
  };

  const getKhoiCVNamesByIds = useCallback(
    (idKhoiCVs: string[] = []): string =>
      idKhoiCVs
        .map((id: string) => khoiCVNames[id] || '') // Đảm bảo 'id' là string
        .filter(Boolean) // Loại bỏ chuỗi rỗng
        .join(', '), // Nối các tên bằng dấu phẩy
    [khoiCVNames]
  );

  const [dataFormatExcel, setDataFormatExcel] = useState<any>([]);

  const prepareCsvData = () =>
    tableData?.map((item, index) => ({
      tentoanha: item?.ent_khuvuc?.ent_toanha?.Toanha || '',
      // makhuvuc: item?.ent_khuvuc?.Makhuvuc || '',
      // maqrcodekhuvuc: item?.ent_khuvuc?.MaQrCode || '',
      tenkhuvuc: item?.ent_khuvuc?.Tenkhuvuc || '',
      // maqrcodehangmuc: item?.ent_hangmuc?.MaQrCode || '',
      tenhangmuc: item?.ent_hangmuc?.Hangmuc || '',
      Tentang: item?.ent_tang?.Tentang || '',
      tenkhoicongviec: Array.isArray(item?.ent_khuvuc?.ID_KhoiCVs)
        ? getKhoiCVNamesByIds(item?.ent_khuvuc?.ID_KhoiCVs)
        : getKhoiCVNamesByIds([item?.ent_khuvuc?.ID_KhoiCVs]) || '',
      // thutucheck: item?.Sothutu || '',
      // macl: item?.Maso || '',
      tencl: item?.Checklist || '',
      tieuchuan: item?.Tieuchuan || '',
      Giatridinhdanh: item?.Giatridinhdanh || '',
      Giatrinhan: item?.Giatrinhan || '',
      Giatriloi: item?.Giatriloi || '',
      Nhap: item?.isCheck ? "X" : "",
      Quantrong: item?.isImportant ? "X" : "",
    }));


  const handleExport = () => {
    // Tạo dữ liệu CSV và cập nhật trạng thái trước khi tải xuống
    const formattedData = prepareCsvData();
    setDataFormatExcel(formattedData);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Danh sách Checklist"
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
          <div style={{ display: 'flex', gap: 12 }}>
            <LoadingButton
              loading={loading}
              variant="contained"
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              onClick={uploadData.onTrue}
            >
              Cập nhật
            </LoadingButton>

            <LoadingButton
              loading={loading}
              variant="contained"
              startIcon={<Iconify icon="fa-cloud-download" />}
              onClick={upload.onTrue}
            >
              Upload
            </LoadingButton>
          </div>
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
                    {tab.value === 'all' && checkList?.length}
                    {tab.value === '1' &&
                      checkList?.filter((item) => {
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
                      checkList?.filter((item) => {
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
                      checkList?.filter((item) => {
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
                      checkList?.filter((item) => {
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
                      checkList?.filter((item) => {
                        let ids = item.ent_khuvuc.ID_KhoiCVs;

                        // Chuyển đổi IDs thành chuỗi nếu nó không phải là chuỗi
                        if (typeof ids !== 'string') {
                          ids = String(ids);
                        }

                        // Kiểm tra các điều kiện để tìm '5'
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
          <ChecklistTableToolbar
            filters={filters}
            onFilters={handleFilters}
            headers={headers}
            dataFormatExcel={dataFormatExcel}
            buildingOptions={BUILDING_OPTIONS}
            canReset={canReset}
            onResetFilters={handleResetFilters}
            handleExport={handleExport}
          />

          {canReset && (
            <ChecklistTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              //
              results={dataInPage?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataInPage.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataInPage.map((row) => row?.ID_Checklist)
                )
              }
              action={
                <Tooltip title="Xóa">
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
                  onSelectAllRows={(checked: any) =>
                    table.onSelectAllRows(
                      checked,
                      dataInPage.map((row) => row.ID_Checklist)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <ChecklistTableRow
                        index={index}
                        key={row.ID_Checklist}
                        calv={calv}
                        row={row}
                        selected={table.selected.includes(row.ID_Checklist)}
                        onSelectRow={() => table.onSelectRow(row.ID_Checklist)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Checklist)}
                        onViewRow={() => handleViewRow(row.ID_Checklist)}
                        khoiCV={khoiCV}
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
              <Typography variant='subtitle2' sx={{ textAlign: 'right', fontSize: 14, paddingRight: 1 }}>
                Tổng: {dataFiltered?.length}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Container>

      <FileManagerNewFolderDialog
        open={upload.value}
        onClose={upload.onFalse}
        setLoading={setLoading}
        isNewFolder={upload.value}
      />

      <FileManagerNewFolderDialog
        open={uploadData.value}
        onClose={uploadData.onFalse}
        setLoading={setLoading}
        isNewFolder={false}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC Thông báo"
        content={
          <>
            Bạn có muốn xóa <strong> {table.selected.length} </strong> dữ liệu?
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
  inputData: IChecklist[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
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
      (checklist) =>
        `${checklist?.Checklist}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.MaQrCode}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_hangmuc?.Hangmuc}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_tang?.Tentang}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_hangmuc?.MaQrCode}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_khuvuc?.MaQrCode}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_khuvuc?.Tenkhuvuc}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (building.length) {
    inputData = inputData.filter((item) => building.includes(String(item?.ent_khuvuc?.ent_toanha?.ID_Toanha)));
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
