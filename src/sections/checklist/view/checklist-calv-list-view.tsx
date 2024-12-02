import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
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
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders, KHUVUC_STATUS_OPTIONS } from 'src/_mock';
import {
  useGetChecklist,
  useGetCalv,
  useGetTb_Checklist,
  useGetChecklistWeb,
  useGetKhoiCV,
} from 'src/api/khuvuc';

import { fTimestamp } from 'src/utils/format-time';
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
import { usePopover } from 'src/components/custom-popover';
// types
import {
  IChecklist,
  IKhuvucTableFilters,
  IKhuvucTableFilterValue,
  ITbChecklist,
  ITbChecklistTableFilters,
  ITbChecklistTableFilterValue,
} from 'src/types/khuvuc';
//
import ChecklistTableRow from '../tbchecklist-table-row';
import ChecklistTableToolbar from '../tbchecklist-table-toolbar';
import ChecklistTableFiltersResult from '../tbchecklist-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Ngay', label: 'Ngày checklist' },
  { id: 'Hoten', label: 'Người checklist' },
  { id: 'Tong', label: 'Số Checklist' },
  { id: 'Giobd', label: 'Giờ ' },
  { id: 'ID_Calv', label: 'Ca làm việc' },
  { id: 'ID_ThietLapCa', label: 'Thiết lập ca' },
  { id: 'ID_KhoiCV', label: 'Khối công việc' },
  { id: 'Tinhtrang', label: 'Trạng thái' },
  { id: '', width: 50 },
];

const defaultFilters: ITbChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function ChecklistCalvListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();
  const popover2 = usePopover();

  const confirm = useBoolean();
  const confirm2 = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState<ITbChecklist[]>([]);

  const { tb_checkList, tb_checkListTotalPages, tb_checklistTotalCount, mutateTb_Checklist } =
    useGetTb_Checklist({
      page: table.page,
      limit: table.rowsPerPage,
    });

  const { calv } = useGetCalv();

  const { khoiCV } = useGetKhoiCV();

  // Use the checklist data in useEffect to set table data
  useEffect(() => {
    if (tb_checkList) {
      setTableData(tb_checkList);
    }
  }, [tb_checkList]);

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

  const denseHeight = 52;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const GroupPolicySchema = Yup.object().shape({
    Tenphongban: Yup.string().required('Không được để trống'),
  });

  const defaultValues = {
    Tenphongban: '',
  };

  const methods = useForm({
    resolver: yupResolver(GroupPolicySchema),
    defaultValues,
  });

  const { reset } = methods;

  const handleFilters = useCallback(
    (name: string, value: ITbChecklistTableFilterValue) => {
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
        .put(`http://localhost:6868/api/v2/ent_checklist/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_ChecklistC !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar({
            variant: 'success',
            autoHideDuration: 4000,
            message: `Xóa thành công`,
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
    },
    [accessToken, enqueueSnackbar, dataInPage.length, table, tableData] // Add accessToken and enqueueSnackbar as dependencies
  );

  const getStatusText = (status: any) => {
    switch (status) {
      case '1':
        return 'Khối làm sạch';
      case '2':
        return 'Khối kỹ thuật';
      case '3':
        return 'Khối bảo vệ';
      case '4':
        return 'Khối dự án';
      case '5':
        return 'Khối F&B';
      case 'all':
        return 'Khối Bảo vệ, Làm sạch, Kỹ thuật, Dự án, F&B';
      default:
        return '';
    }
  };

  const handlePrint = useCallback(async () => {
    try {
      const idChecklistCArray = dataFiltered.map((item) => item.ID_ChecklistC);
      const khoiText = getStatusText(filters.status);
      const data = {
        list_IDChecklistC: idChecklistCArray,
        startDate: filters.startDate,
        endDate: filters.endDate,
        tenBoPhan: khoiText,
      };
      const response = await axios.post('http://localhost:6868/api/v2/tb_checklistc/baocao', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob', // Ensure response is treated as a blob
      });

      // Create a new Blob object using the response data of the file
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      // Create a link element
      const link = document.createElement('a');

      // Set the download attribute with a filename
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Báo cáo Checklist.xlsx';

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to download the file
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      console.log('Excel file downloaded successfully.');
    } catch (error) {
      console.error('Error downloading the Excel file', error);
    }
  }, [accessToken, dataFiltered, filters]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback((id: string) => {
    const url = paths.dashboard.checklist.detail(id);
    window.open(url, '_blank');
  }, []);

  const handleViewNot = useCallback((id: string) => {
    const url = paths.dashboard.checklist.not(id);
    window.open(url, '_blank');
  }, []);

  const handleOpenChecklistC = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:6868/api/v2/tb_checklistc/open/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          // reset();
          await mutateTb_Checklist();
          enqueueSnackbar({
            variant: 'success',
            autoHideDuration: 4000,
            message: 'Cập nhật thành công',
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
    },
    [accessToken, enqueueSnackbar, mutateTb_Checklist]
  );

  const handleRemoveChecklistC = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:6868/api/v2/tb_checklistc/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          await mutateTb_Checklist();
          enqueueSnackbar({
            variant: 'success',
            autoHideDuration: 4000,
            message: 'Xóa ca thành công',
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
    },
    [accessToken, enqueueSnackbar, mutateTb_Checklist]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Ca Checklist"
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
                  {tab.value === 'all' && tb_checkList?.length}
                  {tab.value === '1' &&
                    tb_checkList?.filter((item) => `${item.ID_KhoiCV}` === '1').length}

                  {tab.value === '2' &&
                    tb_checkList?.filter((item) => `${item.ID_KhoiCV}` === '2').length}
                  {tab.value === '3' &&
                    tb_checkList?.filter((item) => `${item.ID_KhoiCV}` === '3').length}
                  {tab.value === '4' &&
                    tb_checkList?.filter((item) => `${item.ID_KhoiCV}` === '4').length}
                  {tab.value === '5' &&
                    tb_checkList?.filter((item) => `${item.ID_KhoiCV}` === '5').length}
                </Label>
              }
            />
          ))}
        </Tabs>
        <ChecklistTableToolbar
          filters={filters}
          onFilters={handleFilters}
          onPrint={handlePrint}
          dateError={dateError}
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
              table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_ChecklistC))
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
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_ChecklistC))
              // }
              />

              <TableBody>
                {dataInPage.map((row) => (
                  <ChecklistTableRow
                    key={row.ID_ChecklistC}
                    calv={calv}
                    row={row}
                    selected={table.selected.includes(row.ID_ChecklistC)}
                    onSelectRow={() => table.onSelectRow(row.ID_ChecklistC)}
                    onDeleteRow={() => handleDeleteRow(row.ID_ChecklistC)}
                    onViewRow={() => handleViewRow(row.ID_ChecklistC)}
                    onViewNot={()=> handleViewNot(row.ID_ChecklistC)}
                    onOpenChecklist={() => handleOpenChecklistC(row.ID_ChecklistC)}
                    onRemoveChecklist={() => handleRemoveChecklistC(row.ID_ChecklistC)}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: ITbChecklist[];
  comparator: (a: any, b: any) => number;
  filters: ITbChecklistTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

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
        `${checklist?.ent_calv?.Tenca}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_giamsat?.Hoten}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_user?.Hoten}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_user?.UserName}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist?.ent_user?.Email}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (status !== 'all') {
    inputData = inputData.filter((tbchecklist) => `${tbchecklist.ID_KhoiCV}` === `${status}`);
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
        const nxTimestamp = fTimestamp(item.Ngay);
        return nxTimestamp >= startTimestamp && nxTimestamp < endTimestamp;
      });
    }
  }

  return inputData;
}
