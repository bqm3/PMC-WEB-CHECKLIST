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

// const TABLE_HEAD = [
//   { id: 'Checklist', label: 'Tên checklist', width: 150 },
//   { id: 'ID_Hangmuc', label: 'Hạng mục (Khu vực- Tòa)', width: 250 },
//   { id: 'ID_Tang', label: 'Tầng', width: 100 },
//   { id: 'Ketqua', label: 'Kết quả', width: 100 },
//   { id: 'Gioht', label: 'Giờ Checklist', width: 100 },
//   { id: 'Anh', label: 'Hình ảnh', width: 100 },
//   { id: 'Ghichu', label: 'Ghi chú', width: 100 },
//   { id: '', width: 88 },
// ];

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

type Props = {
  currentChecklist?: TbChecklistCalv[];
  dataChecklistC: any;
};

// ----------------------------------------------------------------------

export default function TbChecklistCalvListView({ currentChecklist, dataChecklistC }: Props) {
  const table = useTable({ defaultOrderBy: 'ID_Khuvuc' });
  const [data, setData] = useState<any>();

  const settings = useSettingsContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEY);
        const response = await axios.put(
          `https://checklist.pmcweb.vn/be/api/v2/ent_checklist/filter-mul/${dataChecklistC.ID_ChecklistC}/${dataChecklistC.ID_Calv}`,
          { dataHangmuc: dataChecklistC?.ID_Hangmucs, ID_KhoiCV: dataChecklistC?.ID_KhoiCV },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData(response.data);
        console.log('data', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataChecklistC]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Danh mục chưa checklist theo ca"
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
        </Stack>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={data?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(checked, data?.map((row) => row.ID_Khuvuc))
                // }
              />
            </Table>
          </Scrollbar>
        </TableContainer>
      </Container>
    </>
  );
}
