import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Grid } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { LoadingButton } from '@mui/lab';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { useGetLoaiChiSo, useGetLoaiChiSoByDuan, useGetSuCoNgoai, useGetLoaiCS } from 'src/api/khuvuc';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
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
import { usePopover } from 'src/components/custom-popover';
// types
import { IKhuvucTableFilters, IHangMucChiSo } from 'src/types/khuvuc';
//
import BaoCaoTableRow from '../bao-cao-chi-so-table-row';

import TableSelectedAction from '../table-selected-action';
import TableHeadCustom from '../table-head-custom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Hangmuc_Chiso', label: 'Mã', width: 50 },
  { id: 'ID_LoaiCS', label: 'Chỉ số', width: 180 },
  { id: 'Ten_Hangmuc_Chiso', label: 'Tên chỉ số' },
  { id: 'Heso', label: 'Hệ số', width: 80 },
  { id: 'Donvi', label: 'Đơn vị', width: 100 },
  { id: '', width: 20 },
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

export default function BaoCaoListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();
  const popoverChiSo = usePopover();

  const confirm = useBoolean();
  const confirmChiSo = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [loading, setLoading] = useState<Boolean | any>(false);
  const [selectedLoaiChiSo, setSelectedLoaiChiSo] = useState<string[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { loaichiso } = useGetLoaiChiSo();
  const { hmCS } = useGetLoaiChiSoByDuan();

  const [tableData, setTableData] = useState<IHangMucChiSo[]>([]);

  const { loaiCS } = useGetLoaiCS();

  useEffect(() => {
    if (loaiCS.length > 0) {
      setSelectedLoaiChiSo(loaiCS.map((item) => item.ID_LoaiCS))
    }
  }, [loaiCS])

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

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleViewNew = useCallback(() => {
    confirmChiSo.onTrue();
    popoverChiSo.onClose();
  }, [popoverChiSo, confirmChiSo]);

  const handleCheckLoaiChiSo = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setSelectedLoaiChiSo((prev) => [...prev, id]); // Thêm ID mới vào danh sách
    } else {
      setSelectedLoaiChiSo((prev) => prev.filter((item) => item !== id)); // Loại bỏ ID khỏi danh sách
    }
  };

  // Submit dữ liệu
  const handleSubmit = async () => {
    const idsString = selectedLoaiChiSo.join(','); // Tạo chuỗi cách nhau bằng dấu phẩy

    await axios
      .put(
        `${process.env.REACT_APP_HOST_API}/duan-loaics/update`,
        {
          ID_LoaiCS: idsString,
        },

        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((data) => {
        popoverChiSo.onClose(); // Đóng dialog sau khi xử lý xong
        popover.onClose(); // Đóng dialog sau khi xử lý xong
        confirmChiSo.onFalse();
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Cập nhật thành công',
        });
      })
      .catch((error) => {
        enqueueSnackbar({
          variant: 'error',
          autoHideDuration: 4000,
          message: 'Cập nhật thất bại',
        });
      });
  };

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios
        .put(`${process.env.REACT_APP_HOST_API}/tb_sucongoai/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData.filter((row) => row.ID_Hangmuc_Chiso !== id);
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

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.baocaochiso.edit(id));
    },
    [router]
  );

  return (
    <>
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
          <LoadingButton loading={loading} variant="contained" onClick={handleViewNew}>
            Tạo mới
          </LoadingButton>
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
                  rowCount={hmCS?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <BaoCaoTableRow
                        key={row.ID_Hangmuc_Chiso}
                        row={row}
                        selected={table.selected.includes(row.ID_Hangmuc_Chiso)}
                        onSelectRow={() => table.onSelectRow(row.ID_Hangmuc_Chiso)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Hangmuc_Chiso)}
                        onViewRow={() => handleViewRow(row.ID_Hangmuc_Chiso)}
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

      <ChiSoDialogAdd
        open={confirmChiSo.value}
        onClose={confirmChiSo.onFalse}
        loaichiso={loaichiso}
        selectedLoaiChiSo={selectedLoaiChiSo}
        handleCheckLoaiChiSo={handleCheckLoaiChiSo}
        handleSubmit={handleSubmit}
        loaichisoDuan={loaiCS}
      />
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

function ChiSoDialogAdd({
  open,
  onClose,
  loaichiso,
  selectedLoaiChiSo,
  handleSubmit,
  handleCheckLoaiChiSo,
  loaichisoDuan
}: any) {
  // 3 (chưa check) 
  // 2 ( đã check)
  // setselectedLoaiChiSo (0)
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>
      {loaichiso ? (
        <DialogContent sx={{ overflow: 'hidden', height: 'auto', p: 2 }}>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <FormGroup sx={{ flexDirection: 'row' }}>
              {loaichiso &&
                loaichiso?.map((item: any) => (
                  <FormControlLabel
                    key={item?.ID_LoaiCS}
                    control={
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                        value={item?.ID_LoaiCS}
                        checked={selectedLoaiChiSo?.includes(item?.ID_LoaiCS)} // Kiểm tra nếu đã chọn
                        onChange={(event) => handleCheckLoaiChiSo(event, item?.ID_LoaiCS)} // Xử lý thay đổi
                      />
                    }
                    label={item?.TenLoaiCS}
                    sx={{
                      '.MuiFormControlLabel-label': {
                        fontWeight: 'medium',
                        fontSize: '17px',
                      },
                    }}
                  />
                ))}
            </FormGroup>
          </Grid>
          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
              Lưu
            </Button>
          </Grid>
        </DialogContent>
      ) : (
        <DialogContent>
          <Alert severity="warning">Chưa có loại chỉ số nào để thêm</Alert>
        </DialogContent>
      )}
    </Dialog>
  );
}
