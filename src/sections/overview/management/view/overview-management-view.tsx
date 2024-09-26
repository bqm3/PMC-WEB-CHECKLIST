import { useEffect, useMemo, useState } from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
// components
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import IconButton from '@mui/material/IconButton';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import { Box, TextField } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import MenuItem from '@mui/material/MenuItem';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
  _ecommerceSalesOverview,
  _appInstalled,
  _bankingRecentTransitions,
} from 'src/_mock';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
import { ISucongoai } from 'src/types/khuvuc';
// api
import axios from 'axios';
import { useGetKhoiCV } from 'src/api/khuvuc';
//
import ChecklistsHoanThanh from '../checklist-hoan-thanh';
import ChecklistsSuCo from '../checklist-su-co';
import ChecklistsSuCoNgoai from '../checklist-su-co-ngoai';
import AnaLyticsDuan from '../analytics-areas';
import SuCoListView from '../suco/su-co-list-view';
import BankingRecentTransitions from '../banking-recent-transitions'
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type SeriesData = {
  label: string;
  value: number;
};

type SeriesDataYear = {
  name: string;
  data: number[];
};

type ChartSeries = {
  type: string;
  data: SeriesDataYear[];
};

type ChartData = {
  categories: string[];
  series: ChartSeries[];
};

const columns: GridColDef<[number]>[] = [
  { field: 'id', headerName: 'Mã dự án', width: 0 },
  {
    field: 'projectName',
    headerName: 'Tên dự án',
    width: 200,
    editable: true,
  },
  {
    field: 'Khối kỹ thuật',
    headerName: 'Khối kỹ thuật',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối làm sạch',
    headerName: 'Khối làm sạch',
    // type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối dịch vụ',
    headerName: 'Khối dịch vụ',
    width: 150,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
  {
    field: 'Khối bảo vệ',
    headerName: 'Khối bảo vệ',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 160,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
];

const months = [
  { value: 'all', label: 'Tất cả' },
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
];

const nhoms = [
  { value: 'all', label: 'Tất cả' },
  { value: '1', label: 'Nhóm A' },
  { value: '2', label: 'Nhóm B' },
  { value: '3', label: 'Nhóm C' },
  { value: '4', label: 'Nhóm D' },
];

const tangGiam = [
  { value: 'desc', label: 'Giảm' },
  { value: 'asc', label: 'Tăng' },
];

const top = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];

export default function OverviewAnalyticsView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user, logout } = useAuthContext();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [dataDuan, setDataDuan] = useState<any>([]);
  const [dataPercent, setDataPercent] = useState<any>([]);

  const [showMax, setShowMax] = useState<any>('6');

  const [dataTotalErrorWeek, setDataTotalErrorWeek] = useState<any>([]);
  const [dataTotalYear, setDataTotalYear] = useState<ChartData>({ categories: [], series: [] });
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState(`all`);
  const [selectedKhoiCV, setSelectedKhoiCV] = useState('all');
  const [selectedNhom, setSelectedNhom] = useState('4');
  const [selectedTangGiam, setSelectedTangGiam] = useState('asc');
  const [selectedTop, setSelectedTop] = useState('5');

  // ===========================
  const [dataTotalYearSuco, setDataTotalYearSuco] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const [selectedYearSuco, setSelectedYearSuco] = useState('2024');
  const [selectedMonthSuco, setSelectedMonthSuco] = useState(`all`);
  const [selectedKhoiCVSuco, setSelectedKhoiCVSuco] = useState('all');
  const [selectedNhomSuco, setSelectedNhomSuco] = useState('4');
  const [selectedTangGiamSuco, setSelectedTangGiamSuco] = useState('desc');
  const [selectedTopSuco, setSelectedTopSuco] = useState('5');

  // ===============

  const [dataTotalYearSuCoNgoai, setDataTotalYearSuCoNgoai] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const [selectedYearSuCoNgoai, setSelectedYearSuCoNgoai] = useState('2024');
  const [selectedKhoiCVSuCoNgoai, setSelectedKhoiCVSuCoNgoai] = useState('all');
  const [selectedTangGiamSuCoNgoai, setSelectedTangGiamSuCoNgoai] = useState('desc');

  // ===============

  const [openModal, setOpenModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [dataTable, setDataTable] = useState<ISucongoai[]>();

  const handleOpenModal = async (name: string, key: string) => {
    setSelectedCode(name);
    await axios
      .get(
        `https://checklist.pmcweb.vn/be/api/v2/tb_sucongoai/${key}?name=${name}&year=${dataTotalYearSuCoNgoai}`
      )
      .then((data) => {
        setDataTable(data?.data?.data);
        setOpenModal(true);
      })
      .catch((error) => console.log('error'));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const { khoiCV } = useGetKhoiCV();

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

  useEffect(() => {
    const handleDataDuan = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/ent_duan/du-an-theo-nhom', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataDuan(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataDuan();
  }, [accessToken]);

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

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/list-checklist-error', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setDataTotalErrorWeek(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/ti-le-hoan-thanh?
          year=${selectedYear}&khoi=${selectedKhoiCV}&month=${selectedMonth}&nhom=${selectedNhom}&tangGiam=${selectedTangGiam}&top=${selectedTop}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          setDataTotalYear(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [
    accessToken,
    selectedYear,
    selectedKhoiCV,
    selectedMonth,
    selectedNhom,
    selectedTangGiam,
    selectedTop,
  ]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/ti-le-su-co?
          year=${selectedYearSuco}&khoi=${selectedKhoiCVSuco}&month=${selectedMonthSuco}&nhom=${selectedNhomSuco}&tangGiam=${selectedTangGiamSuco}&top=${selectedTopSuco}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          setDataTotalYearSuco(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [
    accessToken,
    selectedYearSuco,
    selectedKhoiCVSuco,
    selectedMonthSuco,
    selectedNhomSuco,
    selectedTangGiamSuco,
    selectedTopSuco,
  ]);

  // Sự cố ngoài
  useEffect(() => {
    const handleTangGiam = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/be/api/v2/tb_sucongoai/dashboard?year=${selectedYearSuCoNgoai}&khoi=${selectedKhoiCVSuCoNgoai}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setDataTotalYearSuCoNgoai(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTangGiam();
  }, [accessToken, selectedYearSuCoNgoai, selectedKhoiCVSuCoNgoai, selectedTangGiamSuCoNgoai]);

  const handleLinkHSSE = () => {
    const url =
      'https://pmcwebvn.sharepoint.com/sites/PMCteam/SitePages/B%C3%A1o-c%C3%A1o-HSSE.aspx?csf=1&web=1&share=EUBekLeeP6hLszUcIm2kXQEBm6ZHozG95Gn14yIxExnPFw&e=HsaK0H';
    window.open(url, '_blank');
  };
  
  const [open, setOpen] = useState(false);
  const [detailChecklist, setDetailChecklist] = useState<any>();

  const handleClickOpen = (data: any) => {
    setOpen(true);
    setDetailChecklist(data);
  };
  const handleClose = () => {
    setOpen(false);
    setDetailChecklist(null)
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 1, md: 2 },
          }}
        >
          <Typography variant="h4">
            Hi, {user?.Hoten} {user?.ent_chucvu?.Chucvu ? `(${user?.ent_chucvu?.Chucvu})` : ''}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:link-2-fill" />}
            onClick={handleLinkHSSE}
          >
            Báo cáo HSSE
          </Button>
        </Grid>
        <Grid container spacing={3}>
          <Grid xs={12} md={12} lg={12}>
            <div>
              {Object.keys(dataDuan)
                .sort((a, b) => b.localeCompare(a))
                .map((groupName) => (
                  <Accordion key={groupName}>
                    <AccordionSummary
                      expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                      aria-controls={`${groupName}-content`}
                      id={`${groupName}-header`}
                      sx={{ fontWeight: '700' }}
                    >
                      {groupName}
                    </AccordionSummary>
                    <AccordionDetails>
                      <AnaLyticsDuan
                        title={`Thông tin các dự án thuộc ${groupName}`}
                        list={dataDuan[groupName]}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
            </div>
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <Box sx={{ maxHeight: 400, width: '100%', my: 3 }}>
              <Typography sx={{ pb: 1.5, fontWeight: '600', fontSize: 18 }}>
                Tỉ lệ hoàn thành checklist hôm qua
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

          <Grid xs={12} md={12} lg={(selectedTop || selectedTopSuco) === '5' ? 6 : 12}>
            <ChecklistsHoanThanh
              title="Tỉ lệ hoàn thành checklist "
              subheader="Hoàn thành checklist theo ca"
              chart={{
                categories: dataTotalYear.categories,
                series: dataTotalYear.series,
              }}
              selectedYear={selectedYear}
              selectedKhoiCV={selectedKhoiCV}
              selectedMonth={selectedMonth}
              selectedTangGiam={selectedTangGiam}
              selectedNhom={selectedNhom}
              selectedTop={selectedTop}
              onYearChange={setSelectedYear}
              onTangGiamChange={setSelectedTangGiam}
              onNhomChange={setSelectedNhom}
              onKhoiChange={setSelectedKhoiCV}
              onMonthChange={setSelectedMonth}
              onTopChange={setSelectedTop}
              STATUS_OPTIONS={STATUS_OPTIONS}
              months={months}
              nhoms={nhoms}
              tangGiam={tangGiam}
              top={top}
              showMax={showMax}
              setShowMax={setShowMax}
            />
          </Grid>
          <Grid xs={12} md={12} lg={(selectedTop || selectedTopSuco) === '5' ? 6 : 12}>
            <ChecklistsSuCo
              title="Sự cố"
              subheader="Số lượng sự cố chưa hoàn thành"
              chart={{
                categories: dataTotalYearSuco.categories,
                series: dataTotalYearSuco.series,
              }}
              selectedYear={selectedYearSuco}
              selectedKhoiCV={selectedKhoiCVSuco}
              selectedTangGiam={selectedTangGiamSuco}
              selectedTop={selectedTopSuco}
              selectedNhom={selectedNhomSuco}
              selectedMonth={selectedMonthSuco}
              onYearChange={setSelectedYearSuco}
              onTangGiamChange={setSelectedTangGiamSuco}
              onKhoiChange={setSelectedKhoiCVSuco}
              onNhomChange={setSelectedNhomSuco}
              onTopChange={setSelectedTopSuco}
              onMonthChange={setSelectedMonthSuco}
              STATUS_OPTIONS={STATUS_OPTIONS}
              months={months}
              nhoms={nhoms}
              tangGiam={tangGiam}
              top={top}
              //
            />
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <ChecklistsSuCoNgoai
              title="Sự cố ngoài"
              chart={{
                categories: dataTotalYearSuCoNgoai.categories || [],
                series: dataTotalYearSuCoNgoai.series,
              }}
              selectedYear={selectedYearSuCoNgoai}
              selectedKhoiCV={selectedKhoiCVSuCoNgoai}
              selectedTangGiam={selectedTangGiamSuCoNgoai}
              onYearChange={setSelectedYearSuCoNgoai}
              onTangGiamChange={setSelectedTangGiamSuCoNgoai}
              onKhoiChange={setSelectedKhoiCVSuCoNgoai}
              STATUS_OPTIONS={STATUS_OPTIONS}
              tangGiam={tangGiam}
              handleOpenModal={handleOpenModal}
              handleCloseModal={handleCloseModal}
            />
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            {dataTotalErrorWeek && (
              <BankingRecentTransitions
                title="Sự cố ngày hôm trước"
                tableData={dataTotalErrorWeek}
                handleViewRow={handleClickOpen}
                tableLabels={[
                  { id: 'checklistName', label: 'Tên checklist' },
                  { id: 'Ngay', label: 'Ngày' },
                  { id: 'note', label: 'Ghi chú' },
                  { id: 'image', label: 'Ảnh' },
                  { id: 'duan', label: 'Dự án' },
                  { id: '' },
                ]}
              />
            )}
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
        <DialogTitle>Dự án: {selectedCode}</DialogTitle>
        <DialogContent>
           {
            dataTable && dataTable?.length > 0 && openModal === true &&
            <SuCoListView data={dataTable}/>
           }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {/* <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
  
</DialogTitle> */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'gray',
          }}
        >
          {/* <CloseIcon /> */}
        </IconButton>
        <DialogContent dividers>
          <Image
            minWidth={500}
            minHeight={500}
            alt={detailChecklist?.ent_checklist?.Checklist}
            src={`https://lh3.googleusercontent.com/d/${detailChecklist?.Anh}=s1000?authuser=0`}
            ratio="1/1"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
