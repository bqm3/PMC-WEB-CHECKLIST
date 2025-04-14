import { useMemo } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Định nghĩa các interface
interface ProjectData {
  id: number;
  stt: number;
  projectName: string;
  [key: string]: any; // Cho phép các trường khác như 'Khối kỹ thuật', 'Khối làm sạch', v.v.
}

interface TableConfig {
  title: string;
  data: ProjectData[];
  columns: GridColDef[];
}

interface ProjectTableProps {
  title: string;
  data: ProjectData[];
  columns: GridColDef[];
}

interface ProjectsOverviewProps {
  dataPercent: any[]; // Hoặc định nghĩa kiểu dữ liệu cụ thể cho dataPercent
}

const ProjectTable = ({ title, data, columns }: ProjectTableProps) => (
  <Grid item xs={12} md={6} lg={3}>
    <Paper elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <Box sx={{ height: 340, width: '100%', p: 1 }}>
        <DataGrid
          rows={data}
          columns={columns}
          disableRowSelectionOnClick
          disableColumnMenu
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            },
          }}
          hideFooter
        />
      </Box>
    </Paper>
  </Grid>
);

const ProjectsOverview = ({ dataPercent }: ProjectsOverviewProps) => {
  // Cột chung cho các bảng chỉ hiển thị STT và tên dự án
  const basicColumns: GridColDef[] = useMemo(() => [
    {
      field: 'stt',
      headerName: 'STT',
      width: 60,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'projectName', headerName: 'Tên dự án', flex: 1 },
  ], []);

  // Cột cho bảng hiển thị tỉ lệ hoàn thành
  const percentColumns: GridColDef[] = useMemo(() => [
    ...basicColumns,
    {
      field: 'Khối kỹ thuật',
      headerName: 'Tỉ lệ hoàn thành',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
  ], [basicColumns]);

  // Dữ liệu cho các bảng, được tính toán một lần khi component render
  const tables: TableConfig[] = useMemo(
    () => [
      {
        title: 'Tỉ lệ hoàn thành Khối kỹ thuật thấp nhất',
        data: dataPercent
          .filter((row) => row['Khối kỹ thuật'] !== null)
          .sort((a, b) => {
            const valueA = parseFloat(a['Khối kỹ thuật']?.replace(' %', '') || '100');
            const valueB = parseFloat(b['Khối kỹ thuật']?.replace(' %', '') || '100');
            return valueA - valueB;
          })
          .slice(0, 10)
          .map((row, index) => ({ ...row, id: index + 1, stt: index + 1 })),
        columns: percentColumns,
      },
      {
        title: 'Dự án chưa thực hiện Khối làm sạch',
        data: dataPercent
          .filter((row) => row['Khối làm sạch'] === null)
          .map((row, index) => ({ ...row, id: index + 1, stt: index + 1 })),
        columns: basicColumns,
      },
      {
        title: 'Dự án chưa thực hiện Khối dịch vụ',
        data: dataPercent
          .filter((row) => row['Khối dịch vụ'] === null)
          .map((row, index) => ({ ...row, id: index + 1, stt: index + 1 })),
        columns: basicColumns,
      },
      {
        title: 'Dự án chưa thực hiện Khối an ninh',
        data: dataPercent
          .filter((row) => row['Khối an ninh'] === null)
          .map((row, index) => ({ ...row, id: index + 1, stt: index + 1 })),
        columns: basicColumns,
      },
    ],
    [basicColumns, dataPercent, percentColumns]
  );

  return (
    <Grid container spacing={3} sx={{ mt: 0 }}>
      {tables.map((table, index) => (
        <ProjectTable key={index} title={table.title} data={table.data} columns={table.columns} />
      ))}
    </Grid>
  );
};

export default ProjectsOverview;