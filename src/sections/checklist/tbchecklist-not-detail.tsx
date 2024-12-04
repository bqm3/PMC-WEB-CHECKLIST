import { useState, useEffect } from 'react';
import axios from 'axios';

// @mui
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
// import { useRouter } from 'src/routes/hooks';
// _mock
import { _orders } from 'src/_mock';
import { useGetKhoiCV } from 'src/api/khuvuc';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, TableHeadCustom, TableNoData, getComparator } from 'src/components/table';
// types
import { TbChecklistCalv } from 'src/types/khuvuc';
//
import AreaTableRow from './area-not-checklist';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Khuvuc', label: 'Mã', width: 50 },
  { id: 'Tenkhuvuc', label: 'Tên khu vực' },
  { id: 'ID_Toanha', label: 'Tòa nhà', width: 150 },
  { id: 'MaQrCode', label: 'Mã Qr Code', width: 150 },
  { id: 'ID_KhoiCV', label: 'Khối công việc', width: 250 },
  { id: '', width: 88 },
];

const STORAGE_KEY = 'accessToken';

type Props = {
  currentChecklist?: TbChecklistCalv[];
  dataChecklistC: any;
};

// ----------------------------------------------------------------------

export default function TbChecklistCalvListView({ currentChecklist, dataChecklistC }: Props) {
  const params = useParams();
  const { id } = params;

  const table = useTable({ defaultOrderBy: 'ID_Khuvuc' });

  const { khoiCV } = useGetKhoiCV();
  const [data, setData] = useState<any>();

  const settings = useSettingsContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEY);
        const response = await axios.put(
          `https://checklist.pmcweb.vn/be/api/v2/ent_checklist/filter-mul-web/${id}`,
          { dataHangmuc: dataChecklistC?.ID_Hangmucs, ID_KhoiCV: dataChecklistC?.ID_KhoiCV },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, dataChecklistC]);

  const formatDateString = (dateString: any) => {
    if (dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  return (
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

      <Box
        rowGap={5}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
        sx={{ pb: 2 }}
      >
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Thông tin trong ca
          </Typography>
          Ca: {dataChecklistC?.ent_calv?.Tenca}
          <br />
          Người Checklist: {dataChecklistC?.ent_user?.Hoten}
          <br />
          Khối công việc: {dataChecklistC?.ent_khoicv?.KhoiCV}
          <br />
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'white' }}>
            {' '}
          </Typography>
          Ngày: {formatDateString(dataChecklistC?.Ngay)}
          <br />
          Giờ bắt đầu - kết thúc: {dataChecklistC?.Giobd} - {dataChecklistC?.Giokt}
          <br />
          Tình trạng: {dataChecklistC?.Tinhtrang === 0 ? 'Mở ra' : 'Đóng ca'}
          <br />
        </Stack>
      </Box>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={data?.length}
              numSelected={table.selected.length}
              // onSort={table.onSort}
            // onSelectAllRows={(checked) =>
            //   table.onSelectAllRows(checked, dataInPage?.map((row: any) => row.ID_Khuvuc))
            // }
            />

            <TableBody>
              {data?.map((row: any, index: any) => (
                <AreaTableRow
                  key={index}
                  row={row}
                  selected={table.selected.includes(row?.ent_khuvuc?.ID_Khuvuc)}
                  onSelectRow={() => table.onSelectRow(row?.ent_khuvuc?.ID_Khuvuc)}
                  khoiCV={khoiCV}
                  index={index}
                />
              ))}
              <TableNoData notFound={!data} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Container>
  );
}
