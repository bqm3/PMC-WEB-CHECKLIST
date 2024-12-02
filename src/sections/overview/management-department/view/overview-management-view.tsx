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
import { Box, Divider, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
import { ISucongoai } from 'src/types/khuvuc';
// api
import axios from 'axios';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Spreadsheet from 'react-spreadsheet';
import { useGetKhoiCV } from 'src/api/khuvuc';
//
import ChecklistsHoanThanh from '../checklist-hoan-thanh';
import ChecklistsSuCo from '../checklist-su-co';
import ChecklistsSuCoNgoai from '../checklist-su-co-ngoai';
import SuCoNgoaiListView from '../sucongoai/su-co-ngoai-list-view';
import SuCoListView from '../suco/su-co-list-view';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import PercentChecklistWidgetSummary from '../percent-checklist-widget-summary';
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
    width: 150,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
  {
    field: 'Khối F&B',
    headerName: 'Khối F&B',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 150,
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
  { value: '1', label: 'Nhóm A1: Trụ sở, văn phòng' },
  { value: '2', label: 'Nhóm A2: Logistic' },
  { value: '3', label: 'Nhóm A3: Hợp đồng dịch vụ nhỏ lẻ' },
  { value: '4', label: 'Nhóm B: Nhà ở - Khoán trọn gói' },
  { value: '5', label: 'Nhóm C: Nhà ở - Hỗn hợp' },
  { value: '6', label: 'Nhóm D: Nhà ở - Thực thanh thực chi' },
];

const tangGiam = [
  { value: 'desc', label: 'Giảm' },
  { value: 'asc', label: 'Tăng' },
];

const top = [
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
  const [selectedNhom, setSelectedNhom] = useState('all');
  const [selectedTangGiam, setSelectedTangGiam] = useState('asc');
  const [selectedTop, setSelectedTop] = useState('10');

  // ===========================
  const [dataTotalYearSuco, setDataTotalYearSuco] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const [selectedYearSuco, setSelectedYearSuco] = useState('2024');
  const [selectedMonthSuco, setSelectedMonthSuco] = useState(`all`);
  const [selectedKhoiCVSuco, setSelectedKhoiCVSuco] = useState('all');
  const [selectedNhomSuco, setSelectedNhomSuco] = useState('all');
  const [selectedTangGiamSuco, setSelectedTangGiamSuco] = useState('desc');
  const [selectedTopSuco, setSelectedTopSuco] = useState('10');

  // ===============

  const [dataTotalYearSuCoNgoai, setDataTotalYearSuCoNgoai] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const [selectedYearSuCoNgoai, setSelectedYearSuCoNgoai] = useState('2024');
  const [selectedKhoiCVSuCoNgoai, setSelectedKhoiCVSuCoNgoai] = useState('all');
  const [selectedTangGiamSuCoNgoai, setSelectedTangGiamSuCoNgoai] = useState('desc');

  // ===============
  const [dataReportChecklistPercentWeek, setDataReportChecklistPercentWeek] = useState<any>();
  const [dataReportProblemChecklistPercentWeek, setDataProblemChecklistPercentWeek] =
    useState<any>();
  const [
    dataReportExternalIncidentChecklistPercentWeek,
    setDataExternalIncidentChecklistPercentWeek,
  ] = useState<any>();
  const [dataReportPercentChecklist, setDataReportPercentChecklist] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const [openModalSuCo, setOpenModalSuCo] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedCodeSuCo, setSelectedCodeSuCo] = useState('');
  const [dataTable, setDataTable] = useState<ISucongoai[]>();
  const [dataTableSuCo, setDataTableSuCo] = useState<any>();

  const [spreadsheetData, setSpreadsheetData] = useState([]);

  const handleOpenModal = async (name: string, key: string) => {
    setSelectedCode(name);
    await axios
      .get(
        `http://localhost:6868/api/v2/tb_sucongoai/${key}?name=${name}&year=${dataTotalYearSuCoNgoai}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
  const handleCloseModalSuCo = () => {
    setOpenModalSuCo(false);
  };

  const handleOpenModalSuCo = async (name: string, key: string) => {
    setSelectedCodeSuCo(name);
    await axios
      .get(`http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-${key}?name=${name}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((data) => {
        setDataTableSuCo(data?.data?.data);
        setOpenModalSuCo(true);
      })
      .catch((error) => console.log('error', error));
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
        .get('http://localhost:6868/api/v2/ent_duan/du-an-theo-nhom', {
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
        .get('http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-percent-checklist-project', {
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
            'Khối F&B': project.createdKhois['Khối F&B']?.completionRatio
              ? `${project.createdKhois['Khối F&B']?.completionRatio} %`
              : null,
          }));

          setDataPercent(transformedRows);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataPercent();
  }, [accessToken]);

  useEffect(() => {
    const handleDataPercent = async () => {
      await axios
        .get(
          'http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-report-checklist-percent-yesterday',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          const dataRes = res.data.avgCompletionRatios;
          setDataReportPercentChecklist(dataRes);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataPercent();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-list-checklist-error', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
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
          `http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-ti-le-hoan-thanh?
          year=${selectedYear}&khoi=${selectedKhoiCV}&month=${selectedMonth}&nhom=${selectedNhom}&tangGiam=${selectedTangGiam}&top=${selectedTop}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
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
        .get(`http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-report-checklist-percent-week`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataReportChecklistPercentWeek(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(`http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-report-problem-percent-week`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataProblemChecklistPercentWeek(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(
          `http://localhost:6868/api/v2/tb_sucongoai/chi-nhanh-report-external-incident-percent-week`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setDataExternalIncidentChecklistPercentWeek(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(
          `http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-ti-le-su-co?
          year=${selectedYearSuco}&khoi=${selectedKhoiCVSuco}&month=${selectedMonthSuco}&nhom=${selectedNhomSuco}&tangGiam=${selectedTangGiamSuco}&top=${selectedTopSuco}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
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
          `http://localhost:6868/api/v2/tb_sucongoai/chi-nhanh-dashboard?year=${selectedYearSuCoNgoai}&khoi=${selectedKhoiCVSuCoNgoai}`,
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
    setDetailChecklist(null);
  };
  const [showModal, setShowModal] = useState<any>(false);
  const fetchExcelData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6868/api/v2/tb_checklistc/chi-nhanh-report-checklist-project-excel`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Kiểm tra phản hồi API để đảm bảo có dữ liệu
      if (response && response.data) {
        // Chuyển đổi dữ liệu nhận được thành định dạng phù hợp cho react-spreadsheet
        const formattedData = response.data.map((row: any) =>
          row.map((cell: any) => ({ value: cell }))
        );
        // Cập nhật state với dữ liệu đã được format
        setSpreadsheetData(formattedData);
        setShowModal(true); // Hiển thị modal khi bắt đầu tải dữ liệu
      } else {
        console.error('No data returned from API');
      }
    } catch (error) {
      console.error('Error fetching Excel data:', error);
      setShowModal(false);
    }
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
          <Box display="flex" gap={2} alignItems="center">
            <Button variant="contained" color="success" onClick={fetchExcelData}>
              Danh sách dự án
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:link-2-fill" />}
              onClick={handleLinkHSSE}
            >
              Báo cáo HSSE
            </Button>
          </Box>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Tỉ lệ hoàn thành checklist"
              percent={
                Number(dataReportChecklistPercentWeek?.lastWeekPercentage) -
                Number(dataReportChecklistPercentWeek?.previousWeekPercentage)
              }
              total={`${dataReportChecklistPercentWeek?.lastWeekPercentage}%`}
              chart={{
                series: [
                  Number(dataReportChecklistPercentWeek?.previousWeekPercentage) || 0,
                  Number(dataReportChecklistPercentWeek?.lastWeekPercentage) || 0,
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Số lượng sự cố"
              percent={
                ((Number(dataReportProblemChecklistPercentWeek?.lastWeekTotalCount) -
                  Number(dataReportProblemChecklistPercentWeek?.twoWeeksAgoTotalCount)) /
                  Number(dataReportProblemChecklistPercentWeek?.twoWeeksAgoTotalCount)) *
                100
              }
              total={`${dataReportProblemChecklistPercentWeek?.lastWeekTotalCount}`}
              chart={{
                series: [
                  Number(dataReportProblemChecklistPercentWeek?.twoWeeksAgoTotalCount) || 0,
                  Number(dataReportProblemChecklistPercentWeek?.lastWeekTotalCount) || 0,
                ],
                colors: [theme.palette.error.light, theme.palette.error.main], // Màu đỏ cho sự cố
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Số lượng sự cố ngoài"
              key="1"
              percent={
                ((Number(dataReportExternalIncidentChecklistPercentWeek?.currentWeekCount) -
                  Number(dataReportExternalIncidentChecklistPercentWeek?.lastWeekCount)) /
                  Number(dataReportExternalIncidentChecklistPercentWeek?.lastWeekCount)) *
                100
              }
              total={`${dataReportExternalIncidentChecklistPercentWeek?.currentWeekCount}`}
              chart={{
                series: [
                  Number(dataReportExternalIncidentChecklistPercentWeek?.lastWeekCount),
                  Number(dataReportExternalIncidentChecklistPercentWeek?.currentWeekCount),
                ],
                colors: [theme.palette.error.light, theme.palette.error.main], // Màu đỏ cho sự cố ngoài
              }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <PercentChecklistWidgetSummary
              title="Khối kỹ thuật"
              total={`${dataReportPercentChecklist && dataReportPercentChecklist['Khối kỹ thuật']
                ? dataReportPercentChecklist['Khối kỹ thuật']
                : 0
                }`}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <PercentChecklistWidgetSummary
              title="Khối bảo vệ"
              total={`${dataReportPercentChecklist && dataReportPercentChecklist['Khối bảo vệ']
                ? dataReportPercentChecklist['Khối bảo vệ']
                : 0
                }`}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <PercentChecklistWidgetSummary
              title="Khối dịch vụ"
              total={`${dataReportPercentChecklist && dataReportPercentChecklist['Khối dịch vụ']
                ? dataReportPercentChecklist['Khối dịch vụ']
                : 0
                }`}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <PercentChecklistWidgetSummary
              title="Khối làm sạch"
              total={`${dataReportPercentChecklist && dataReportPercentChecklist['Khối làm sạch']
                ? dataReportPercentChecklist['Khối làm sạch']
                : 0
                }`}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <PercentChecklistWidgetSummary
              title="Khối F&B"
              total={`${dataReportPercentChecklist && dataReportPercentChecklist['Khối F&B']
                ? dataReportPercentChecklist['Khối F&B']
                : 0
                }`}
            />
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            {dataTotalYear && (
              <ChecklistsHoanThanh
                title="Tỉ lệ hoàn thành checklist hôm trước"
                subheader="Hoàn thành checklist theo ca"
                chart={{
                  categories: dataTotalYear?.categories || [],
                  series: dataTotalYear?.series || [],
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
            )}
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            {dataTotalYearSuco && (
              <ChecklistsSuCo
                title="Số lượng sự cố trong ngày"
                subheader="Số lượng sự cố chưa hoàn thành"
                chart={{
                  categories: dataTotalYearSuco?.categories || [],
                  series: dataTotalYearSuco?.series || [],
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
                handleOpenModalSuCo={handleOpenModalSuCo}
                handleCloseModalSuCo={handleCloseModalSuCo}
              //
              />
            )}
          </Grid>
          {/* <Grid xs={12} md={12} lg={12}>
            {
              dataTotalYearSuCoNgoai &&
              <ChecklistsSuCoNgoai
                title="Sự cố ngoài"
                chart={{
                  categories: dataTotalYearSuCoNgoai?.categories || [],
                  series: dataTotalYearSuCoNgoai?.series || [],
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
            }

          </Grid> */}
          <Grid xs={12} md={12} lg={12}>
            <Box sx={{ maxHeight: 450, width: '100%', my: 2 }}>
              <Typography sx={{ pb: 1.5, fontWeight: '600', fontSize: 18 }}>
                Tỉ lệ hoàn thành checklist hôm qua
              </Typography>
              <DataGrid
                rows={dataPercent}
                columns={columns}
                sx={{
                  maxHeight: 450,
                  overflowY: 'auto',
                }}
                disableRowSelectionOnClick
              />
            </Box>
          </Grid>
          {/* <Grid xs={12} md={12} lg={12}>
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
          </Grid> */}
        </Grid>
      </Container>

      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="lg">
        <DialogContent
          sx={{
            m: 2,
            scrollBehavior: 'auto', // Loại bỏ smooth scroll
            overflow: 'auto', // Đảm bảo cuộn không mượt
          }}
        >
          {spreadsheetData.length > 0 ? (
            <Spreadsheet data={spreadsheetData} />
          ) : (
            <div>Không có dữ liệu để hiển thị</div>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="contained" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalSuCo} onClose={handleCloseModalSuCo} fullWidth maxWidth="lg">
        <DialogTitle>Dự án: {selectedCodeSuCo}</DialogTitle>
        <DialogContent>
          {dataTableSuCo && dataTableSuCo?.length > 0 && openModalSuCo === true && (
            <SuCoListView data={dataTableSuCo} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalSuCo}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
        <DialogTitle>Dự án: {selectedCode}</DialogTitle>
        <DialogContent>
          {dataTable && dataTable?.length > 0 && openModal === true && (
            <SuCoNgoaiListView data={dataTable} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
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
