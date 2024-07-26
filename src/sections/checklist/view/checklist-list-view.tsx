import { useState, useCallback, useEffect } from 'react';
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
import { LoadingButton } from '@mui/lab';
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
import { IChecklist, IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';
//
import ChecklistTableRow from '../checklist-table-row';
import ChecklistTableToolbar from '../checklist-table-toolbar';
import ChecklistTableFiltersResult from '../checklist-table-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Checklist', label: 'Mã', width: 50 },
  { id: 'Checklist', label: 'Tên checklist' },
  { id: 'Giatridinhdanh', label: 'Giá trị định danh', width: 100, align: 'center' },
  { id: 'Giatrinhan', label: 'Giá trị nhận', width: 120, align: 'center' },
  { id: 'ID_Tang', label: 'Tầng', width: 100, align: 'center' },
  { id: 'Sothutu', label: 'Số thứ tự', width: 100, align: 'center' },
  { id: 'Maso', label: 'Mã số', width: 100, align: 'center' },
  { id: 'ID_Hangmuc', label: 'Hạng mục', width: 150, align: 'center' },
  { id: 'sCalv', label: 'Ca làm việc', width: 140, align: 'center' },
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

export default function ChecklistCalvListView() {
  const table = useTable({ defaultOrderBy: 'ID_Checklist' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const upload = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [loading, setLoading] = useState<Boolean | any>(false)

  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState<IChecklist[]>([]);

  const { checkList } = useGetChecklistWeb();

  const { calv } = useGetCalv();

  const { khoiCV } = useGetKhoiCV();

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([{ value: 'all', label: 'Tất cả' }]);

  useEffect(() => {
    // Assuming khoiCV is set elsewhere in your component
    khoiCV.forEach((khoi) => {
      set_STATUS_OPTIONS((prevOptions) => [
        ...prevOptions,
        { value: khoi.ID_Khoi.toString(), label: khoi.KhoiCV },
      ]);
    });
  }, [khoiCV]);

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
        .put(`https://checklist.pmcweb.vn/be/api/ent_checklist/delete/${id}`, [], {
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
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered?.length,
    });
  }, [dataFiltered?.length, dataInPage.length, table, tableData]);

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
    { label: 'STT', key: 'stt' },
    { label: 'Tên checklist', key: 'Checklist' },
    { label: 'Giá trị định danh', key: 'Giatridinhdanh' },
    { label: 'Giá trị nhận', key: 'Giatrinhan' },
    { label: 'Tầng', key: 'Tentang' },
    { label: 'Số thứ tự', key: 'Sothutu' },
    { label: 'Mã số', key: 'Maso' },
    { label: 'Hạng mục', key: 'Hangmuc' },
    { label: 'Ca làm việc', key: 'caLvs' },
  ];

  const [dataFormatExcel, setDataFormatExcel] = useState<any>([]);

  useEffect(() => {
    const formattedData = dataFiltered?.map((item, index) => {
      const shiftNames = [item.calv_1, item.calv_2, item.calv_3, item.calv_4]
        .map((calvId : any) => {
          const workShift = calv?.find((shift) => `${shift.ID_Calv}` === `${calvId}`);
          return workShift ? workShift.Tenca : null;
        })
        .filter((name: any) => name !== null)
        .join(', ');

      const shiftNamesArray = shiftNames?.split(', ');

      return {
        stt: index + 1,
        Checklist: item.Checklist || '',
        Giatridinhdanh: item.Giatridinhdanh || '',
        Giatrinhan: item.Giatrinhan || '',
        Tentang: item.ent_tang.Tentang || '',
        Sothutu: item.Sothutu || '',
        Maso: item.Maso || '',
        Hangmuc: item.ent_hangmuc.Hangmuc || '',
        caLvs: shiftNamesArray || '',
      };
    });
    setDataFormatExcel(formattedData);
  }, [dataFiltered, calv]);


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Checklists"
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
                    {tab.value === 'all' && checkList?.length}
                    {tab.value === '1' &&
                      checkList?.filter(
                        (item) => `${item.ent_hangmuc.ID_KhoiCV}` === '1'
                      ).length}

                    {tab.value === '2' &&
                      checkList?.filter(
                        (item) => `${item.ent_hangmuc.ID_KhoiCV}` === '2'
                      ).length}
                    {tab.value === '3' &&
                      checkList?.filter(
                        (item) => `${item.ent_hangmuc.ID_KhoiCV}` === '3'
                      ).length}
                    {tab.value === '4' &&
                      checkList?.filter(
                        (item) => `${item.ent_hangmuc.ID_KhoiCV}` === '4'
                      ).length}
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Checklist))
                  }
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
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(0, table.rowsPerPage, tableData?.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
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

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} setLoading={setLoading}/>

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
  inputData: IChecklist[];
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
      (checklist) =>
        `${checklist.Checklist}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.Giatridinhdanh}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.Giatrinhan}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.MaQrCode}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.Maso}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_hangmuc.Hangmuc}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_tang.Tentang}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${checklist.ent_hangmuc.MaQrCode}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData?.filter((item) => `${item.ent_hangmuc.ID_KhoiCV}` === status);
  }

  return inputData;
}
