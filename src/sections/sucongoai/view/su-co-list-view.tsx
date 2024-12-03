import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import { m } from 'framer-motion';
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
import { Box, FormControl, InputLabel, Menu, MenuItem, Select, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Image from 'src/components/image';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { useGetKhoiCV, useGetKhuVuc, useGetSuCoNgoai } from 'src/api/khuvuc';
// utils
import { fTimestamp } from 'src/utils/format-time';
import { getImageUrls } from 'src/utils/get-image';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
// components
import Label from 'src/components/label';
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
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';
// types
import { IKhuvucTableFilters, IBaoCaoTableFilterValue, ISucongoai } from 'src/types/khuvuc';
//
import AreaTableRow from '../su-co-table-row';
import AreaTableToolbar from '../su-co-table-toolbar';
import OrderTableFiltersResult from '../area-table-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';

import TableSelectedAction from '../table-selected-action';
import TableHeadCustom from '../table-head-custom';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Suco', label: 'Mã', width: 50 },
  { id: 'ID_Hangmuc', label: 'Hạng mục' },
  { id: 'Ngaysuco', label: 'Ngày sự cố', width: 150 },
  { id: 'Ngayxuly', label: 'Ngày xử lý', width: 150 },
  { id: 'Noidungsuco', label: 'Thông tin', width: 200 },
  { id: 'Tinhtrangxuly', label: 'Tình trạng xử lý', width: 150 },
  { id: '', width: 50 },
];

const defaultFilters: IKhuvucTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function SuCoListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  const upload = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [loading, setLoading] = useState<Boolean | any>(false);

  const [filters, setFilters] = useState(defaultFilters);

  const { sucongoai } = useGetSuCoNgoai();

  const [tableData, setTableData] = useState<ISucongoai[]>([]);

  const [dataSelect, setDataSelect] = useState<ISucongoai>();

  const [tinhTrangXuLy, setTinhTrangXuLy] = useState(null);
  const [ngayXuLy, setNgayXuLy] = useState(new Date());

  useEffect(() => {
    if (sucongoai.length > 0) {
      setTableData(sucongoai);
    }
  }, [sucongoai]);

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: '0', label: 'Chưa xử lý' },
      { value: '1', label: 'Đang xử lý' },
      { value: '2', label: 'Đã xử lý' },
    ],
    []
  );


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

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IBaoCaoTableFilterValue) => {
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
        .put(`https://checklist.pmcweb.vn/be/api/v2/tb_sucongoai/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData.filter((row) => row.ID_Suco !== id);
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

  const handleUpdate = async (id: string) => {
    await axios
      .put(
        `https://checklist.pmcweb.vn/be/api/v2/tb_sucongoai/status/${id}`,
        { Tinhtrangxuly: tinhTrangXuLy, ngayXuLy },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Cập nhật thành công',
        });
        window.location.reload();
        handleCloseRow();
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
  };

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (data: ISucongoai) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirm, popover]
  );

  const handleCloseRow = useCallback(() => {
    confirm.onFalse();
    popover.onClose();
  }, [confirm, popover]);

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

  const [dataFormatExcel, setDataFormatExcel] = useState<any>([]);

  console.log('dataSelect?.Tinhtrangxuly', tinhTrangXuLy)
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Sự cố ngoài Checklist"
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
          {/* <LoadingButton
            loading={loading}
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload
          </LoadingButton> */}
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
                      (tab.value === '2' && 'success') ||
                      (tab.value === '1' && 'warning') ||
                      (tab.value === '0' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && sucongoai?.length}
                    {tab.value === '0' &&
                      sucongoai?.filter((item) => `${item?.Tinhtrangxuly}` === '0').length}
                    {tab.value === '1' &&
                      sucongoai?.filter((item) => `${item?.Tinhtrangxuly}` === '1').length}
                    {tab.value === '2' &&
                      sucongoai?.filter((item) => `${item?.Tinhtrangxuly}` === '2').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <AreaTableToolbar
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
                table.onSelectAllRows(checked, dataInPage?.map((row) => row?.ID_Suco))
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
                  rowCount={sucongoai?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, dataInPage?.map((row) => row.ID_Suco))
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
                        key={row.ID_Suco}
                        row={row}
                        selected={table.selected.includes(row.ID_Suco)}
                        onSelectRow={() => table.onSelectRow(row.ID_Suco)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Suco)}
                        onViewRow={() => handleViewRow(row)}
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

      {dataSelect && (
        <NhomTSDialog
          open={confirm.value}
          dataSelect={dataSelect}
          onClose={confirm.onFalse}
          setNgayXuLy={setNgayXuLy}
          ngayXuLy={ngayXuLy}
          setTinhTrangXuLy={setTinhTrangXuLy}
          tinhTrangXuLy={tinhTrangXuLy}
          handleUpdate={() => handleUpdate(dataSelect?.ID_Suco)}
        />
      )}

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: ISucongoai[];
  comparator: (a: any, b: any) => number;
  filters: IKhuvucTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

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
        `${order.ent_hangmuc.Hangmuc}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order.Noidungsuco}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData?.filter((order) => `${order?.Tinhtrangxuly}` === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      // Đặt endDate vào cuối ngày
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      const startTimestamp = fTimestamp(startDate);
      const endTimestamp = fTimestamp(endDate);
      inputData = inputData.filter((item) => {
        const nxTimestamp = fTimestamp(item.Ngaysuco);
        return nxTimestamp >= startTimestamp && nxTimestamp < endTimestamp;
      });
    }
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: ISucongoai;
  onClose: VoidFunction;
  setNgayXuLy: any;
  setTinhTrangXuLy: any;
  ngayXuLy: any;
  tinhTrangXuLy: any;
  handleUpdate: VoidFunction;
}

function NhomTSDialog({
  open,
  dataSelect,
  setNgayXuLy,
  setTinhTrangXuLy,
  ngayXuLy,
  tinhTrangXuLy,
  onClose,
  handleUpdate,
}: ConfirmTransferDialogProps) {
  const arr: any = dataSelect?.Duongdancacanh?.split(',').map((slide: any) =>
    `${getImageUrls(3, slide)}`);

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(arr);

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cập nhật trạng thái</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ p: 2 }}>
          <TextField value={dataSelect?.ent_hangmuc?.Hangmuc} label="Hạng mục" disabled />
          <TextField
            value={`${dataSelect?.Giosuco} ${moment(dataSelect?.Ngaysuco).format('DD-MM-YYYY')}`}
            label="Ngày sự cố"
            disabled
          />
          <TextField
            value={dataSelect?.Noidungsuco}
            label="Nội dung sự cố"
            disabled
            multiline
            rows={4}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tình trạng xử lý</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tinhTrangXuLy || dataSelect?.Tinhtrangxuly}
              label="Age"
              disabled={`${dataSelect?.Tinhtrangxuly}` === '2' && true}
              onChange={(val) => setTinhTrangXuLy(val.target.value)}
            >
              <MenuItem value="0">Chưa xử lý</MenuItem>
              <MenuItem value="1">Đang xử lý</MenuItem>
              <MenuItem value="2">Đã xử lý</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label="Ngày xử lý"
            onChange={(val: unknown) => setNgayXuLy(val)}
            value={ngayXuLy || dataSelect?.Ngayxuly}
            disabled={`${dataSelect?.Tinhtrangxuly}` === '2' && true}
          />

          <Scrollbar>
            <Stack sx={{ flexDirection: 'row', width: '100%', gap: 2 }}>
              {arr?.map((slide: any) => (
                <m.div
                  key={slide}
                  whileHover="hover"
                  variants={{
                    hover: { opacity: 0.8 },
                  }}
                  transition={varTranHover()}
                >
                  <Image
                    alt={slide}
                    src={slide}
                    ratio="1/1"
                    onClick={() => handleOpenLightbox(slide)}
                    sx={{ borderRadius: 1, cursor: 'pointer', width: 150, height: 150 }}
                  />
                </m.div>
              ))}
            </Stack>
          </Scrollbar>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="info" onClick={() => handleUpdate()}>
          Cập nhật
        </Button>
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>

      {arr &&
        <Lightbox
          index={selectedImage}
          slides={arr}
          open={openLightbox}
          close={handleCloseLightbox}
        />
      }
    </Dialog>
  );
}
