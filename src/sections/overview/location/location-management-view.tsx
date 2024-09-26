import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, TextField } from '@mui/material';
//
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';


const STORAGE_KEY = 'accessToken';

const columns: GridColDef<[number]>[] = [
  // { field: 'id', headerName: '', width: 0 },
  {
    field: 'projectName',
    headerName: 'Tên dự án',
    width: 200,
    editable: true,
  },
  {
    field: 'date',
    headerName: 'Ngày',
    width: 150,
    editable: true,
  },
  {
    field: 'calv',
    headerName: 'Ca làm việc',
    // type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'user',
    headerName: 'Người làm việc',
    width: 150,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
  {
    field: 'percent',
    headerName: 'Tỉ lệ',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 160,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
];

export default function LocationManagementsView() {
  const settings = useSettingsContext();
  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [dataPercent, setDataPercent] = useState<any>([]);

  useEffect(() => {
    const handleDataPercent = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/list-project-none', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const dataRes = res.data.data;
          const transformedRows = dataRes.map((project: any) => ({
            id: project.projectId,
            projectName: project.projectName,
            'Khối kỹ thuật': project.createdKhois['Khối kỹ thuật']?.completionRatio
              ? `${project.createdKhois['Khối kỹ thuật']?.completionRatio} %`
              : null,
            'Khối làm sạch': project.createdKhois['Khối làm sạch']?.completionRatio
              ? `${project.createdKhois['Khối làm sạch']?.completionRatio} %`
              : null,
            'Khối dịch vụ': project.createdKhois['Khối dịch vụ']?.completionRatio
              ? `${project.createdKhois['Khối dịch vụ']?.completionRatio} %`
              : null,
            'Khối bảo vệ': project.createdKhois['Khối bảo vệ']?.completionRatio
              ? `${project.createdKhois['Khối bảo vệ']?.completionRatio} %`
              : null,
          }));

          setDataPercent(transformedRows);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataPercent();
  }, [accessToken]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid xs={12} md={12} lg={12}>
        <Box sx={{ maxHeight: 600, width: '100%', my: 3 }}>
          <Typography sx={{ pb: 1.5, fontWeight: '600', fontSize: 18 }}>
            Tỉ lệ checklist hôm qua
          </Typography>
          <DataGrid
            rows={dataPercent}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[20, 30, 50]}
            disableRowSelectionOnClick
          />
        </Box>
      </Grid>
    </Container>
  );
}
