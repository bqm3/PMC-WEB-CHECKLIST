import { useState, useEffect } from 'react';
// @mui
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _orders } from 'src/_mock';
import { useGetKhoiCV } from 'src/api/khuvuc';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, TableHeadCustom, TableNoData } from 'src/components/table';

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

type Props = {
  checkList: any;
};

// ----------------------------------------------------------------------

export default function TbDayNotChecklistCalvView({ checkList }: Props) {


  const table = useTable({ defaultOrderBy: 'ID_Khuvuc' });

  const { khoiCV } = useGetKhoiCV();
  const [data, setData] = useState<any>();
  useEffect(() => {
    setData(checkList)
  }, [checkList])

  const settings = useSettingsContext();

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

            { name: 'Danh sách' },
          ]}
          sx={{
            mb: { xs: 1, md: 3 },
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
