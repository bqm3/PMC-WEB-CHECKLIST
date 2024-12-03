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
import { Box, CircularProgress, Divider, TextField, List, ListItem, } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// utils
import { getImageUrls } from 'src/utils/get-image';
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
import EcommerceYearlySales from '../ecommerce-yearly-sales';
import PercentChecklistWidgetSummary from '../percent-checklist-widget-summary';
import ChecklistsSuCo from '../checklist-su-co';
import ChecklistsSuCoNgoai from '../checklist-su-co-ngoai';
import SuCoNgoaiListView from '../sucongoai/su-co-ngoai-list-view';
import SuCoListView from '../suco/su-co-list-view';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import BankingExpensesCategories from '../banking-expenses-categories';


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
    width: 150,
    editable: true,
  },
  {
    field: 'Khối dịch vụ',
    headerName: 'Khối dịch vụ',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối bảo vệ',
    headerName: 'Khối bảo vệ',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối F&B',
    headerName: 'Khối F&B',
    width: 150,
    editable: true,
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
  const [isLoading, setIsLoading] = useState(false);
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
  const [loadingReport, setLoadingReport] = useState<any>();
  const [openDataChecklistMonth, setOpenDataChecklistMonth] = useState<any>(false);
  const [openDataChecklistLocation, setOpenDataChecklistLocation] = useState<any>(false);
  const [dataChecklistMonth, setDataChecklistMonth] = useState<any>({
    month: null,
    year: null,
  });

  const [spreadsheetData, setSpreadsheetData] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]); // Danh sách tin nhắn
  const [inputMessage, setInputMessage] = useState(""); // Tin nhắn người dùng nhập
  const [loading, setLoading] = useState(false); // Trạng thái đang gửi API

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Thêm tin nhắn người dùng vào danh sách
    setMessages((prev: any) => [...prev, { role: "user", content: inputMessage }]);
    setLoading(true);

    try {
      // Gửi tin nhắn đến API
      const response = await axios.post("http://localhost:6868/api/v2/chat", {
        message: inputMessage,
      });

      // Thêm phản hồi của bot vào danh sách
      const botReply = response.data.reply;
      setMessages((prev: any) => [...prev, { role: "assistant", content: botReply }]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setInputMessage("");
      setLoading(false);
    }
  };
  const isCodeBlock = (content: any) => content.startsWith("```") && content.endsWith("```");

  const renderMessageContent = (message: any) => {
    if (isCodeBlock(message.content)) {
      // Xử lý code block (loại bỏ dấu ``` và hiển thị giao diện code)
      const codeContent = message.content.slice(3, -3);
      return (
        <Box
          sx={{
            fontFamily: "monospace",
            backgroundColor: "#f4f4f4",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "8px",
            whiteSpace: "pre-wrap",
            overflowX: "auto",
          }}
        >
          {codeContent}
        </Box>
      );
    }
    // Trả về nội dung bình thường nếu không phải code block
    return <Typography>{message.content}</Typography>;
  };

  const handleOpenModal = async (name: string, key: string) => {
    setSelectedCode(name);
    await axios
      .get(
        `http://localhost:6868/api/v2/tb_sucongoai/${key}?name=${name}&year=${dataTotalYearSuCoNgoai}`
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
      .get(`http://localhost:6868/api/v2/tb_checklistc/${key}?name=${name}`)
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
      setIsLoading(true);
      await axios
        .get('http://localhost:6868/api/v2/ent_duan/du-an-theo-nhom', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const chartData = Object.keys(res.data.data).map((location) => ({
            label: location,
            value: res.data.data[location].length,
          }));
          setDataDuan(chartData);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log('err', err);
        });
    };

    handleDataDuan();
  }, [accessToken]);

  useEffect(() => {
    const handleDataPercent = async () => {
      await axios
        .get('http://localhost:6868/api/v2/tb_checklistc/percent-checklist-project', {
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
        .get('http://localhost:6868/api/v2/tb_checklistc/report-checklist-percent-yesterday', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
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
        .get('http://localhost:6868/api/v2/tb_checklistc/list-checklist-error', {
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
          `http://localhost:6868/api/v2/tb_checklistc/ti-le-hoan-thanh?
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
        .get(`http://localhost:6868/api/v2/tb_checklistc/report-checklist-percent-week`, {
          headers: {
            'Content-Type': 'application/json',
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
        .get(`http://localhost:6868/api/v2/tb_checklistc/report-problem-percent-week`, {
          headers: {
            'Content-Type': 'application/json',
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
        .get(`http://localhost:6868/api/v2/tb_sucongoai/report-external-incident-percent-week`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
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
          `http://localhost:6868/api/v2/tb_sucongoai/dashboard?year=${selectedYearSuCoNgoai}&khoi=${selectedKhoiCVSuCoNgoai}`,
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

  const handleDownload = async (data: any) => {
    try {
      const response = await axios.post(
        `http://localhost:6868/api/v2/tb_checklistc/report-checklist-project-percent-excel`,
        null, // Use null as the second parameter because POST requests without a body can pass null
        { responseType: 'blob' } // Important to specify responseType as blob
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Bao_cao_checklist_du_an.xlsx`
      ); // Set the file name

      // Trigger the download by clicking the link
      link.click();

      // Optional: Revoke the object URL after download
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error fetching Excel data:', error);
      setShowModal(false);
    }
  };


  const fetchExcelData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6868/api/v2/tb_checklistc/report-checklist-project-excel`
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

  const handleOpenChecklistLocation = () => {
    setOpenDataChecklistLocation(true);
  };

  const handleCloseChecklistLocation = () => {
    setOpenDataChecklistLocation(false);
  };

  const handleOpenChecklistMonth = () => {
    setOpenDataChecklistMonth(true);
  };

  const handleCloseChecklistMonth = () => {
    setOpenDataChecklistMonth(false);
  };

  const handleYearChange = (value: Date | null) => {
    // Check if the selected date is valid and update the year
    if (value) {
      setDataChecklistMonth((prev: any) => ({
        ...prev,
        year: value.getFullYear(), // Get the year from the date
      }));
    }
  };

  const handleMonthChange = (value: Date | null) => {
    if (value) {
      setDataChecklistMonth((prev: any) => ({
        ...prev,
        month: value.getMonth() + 1, // Months are 0-indexed in JavaScript
      }));
    }
  };

  const fetchChecklistMonth = async () => {
    try {
      setLoadingReport(true);
      const response = await axios.post(
        `http://localhost:6868/api/v2/tb_checklistc/report-checklist-years?year=${dataChecklistMonth.year}&month=${dataChecklistMonth.month}`,
        null, // Use null as the second parameter because POST requests without a body can pass null
        { responseType: 'blob' } // Important to specify responseType as blob
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Bao_cao_checklist_du_an_${dataChecklistMonth.month}_${dataChecklistMonth.year}.xlsx`
      ); // Set the file name

      // Append to body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove(); // Prefer link.remove() over parentNode to directly remove the element

      // Release the blob URL after downloading
      window.URL.revokeObjectURL(url);

      // Close the modal or perform any other UI updates
      setOpenDataChecklistMonth(false);
      setLoadingReport(false);
    } catch (error) {
      console.error('Error downloading the file:', error);
      setOpenDataChecklistMonth(false);
      setLoadingReport(false);
    }
  };
  const fetchChecklistLocation = async () => {
    try {
      setLoadingReport(true);
      const response = await axios.post(
        `http://localhost:6868/api/v2/tb_checklistc/report-location-times?year=${dataChecklistMonth.year}&month=${dataChecklistMonth.month}`,
        null, // Use null as the second parameter because POST requests without a body can pass null
        { responseType: 'blob' } // Important to specify responseType as blob
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Bao_cao_checklist_vi_pham_${dataChecklistMonth.month}_${dataChecklistMonth.year}.xlsx`
      ); // Set the file name

      // Append to body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove(); // Prefer link.remove() over parentNode to directly remove the element

      // Release the blob URL after downloading
      window.URL.revokeObjectURL(url);

      // Close the modal or perform any other UI updates
      setOpenDataChecklistMonth(false);
      setLoadingReport(false);
    } catch (error) {
      console.error('Error downloading the file:', error);
      setOpenDataChecklistMonth(false);
      setLoadingReport(false);
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
            {user?.ent_chucvu?.Role === 10 && (
              <>
                <Button variant="contained" color="info" onClick={handleOpenChecklistLocation}>
                  Báo cáo vị trí
                </Button>
                <Button variant="contained" color="info" onClick={handleOpenChecklistMonth}>
                  Báo cáo checklist
                </Button>
              </>
            )}
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
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Hiển thị danh sách tin nhắn */}
            <List
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: 2,
              }}
            >
              {messages.map((message: any, index: number) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                    textAlign: message.role === "user" ? "right" : "left",
                  }}
                >
                  <Box
                    sx={{
                      padding: "8px 12px",
                      borderRadius: "12px",
                      backgroundColor: message.role === "user" ? "#1976d2" : "#e0e0e0",
                      color: message.role === "user" ? "#fff" : "#000",
                      maxWidth: "70%",
                      overflowWrap: "break-word",
                    }}
                  >
                    {renderMessageContent(message)}
                  </Box>
                </ListItem>
              ))}
            </List>

            {/* Nhập tin nhắn */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) handleSendMessage();
                }}
                disabled={loading}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
              >
                Gửi
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Tỉ lệ hoàn thành checklist"
              key="0"
              percent={
                Number(dataReportChecklistPercentWeek?.lastWeekPercentage) -
                Number(dataReportChecklistPercentWeek?.previousWeekPercentage)
              }
              total={`${dataReportChecklistPercentWeek?.lastWeekPercentage}%`}
              chart={{
                series: [
                  Number(dataReportChecklistPercentWeek?.previousWeekPercentage),
                  Number(dataReportChecklistPercentWeek?.lastWeekPercentage),
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Số lượng ca checklist"
              key="1"
              percent={
                ((Number(dataReportProblemChecklistPercentWeek?.lastWeekTotalCount) -
                  Number(dataReportProblemChecklistPercentWeek?.twoWeeksAgoTotalCount)) /
                  Number(dataReportProblemChecklistPercentWeek?.twoWeeksAgoTotalCount)) *
                100
              }
              total={`${dataReportProblemChecklistPercentWeek?.lastWeekTotalCount}`}
              chart={{
                series: [
                  Number(dataReportProblemChecklistPercentWeek?.twoWeeksAgoTotalCount),
                  Number(dataReportProblemChecklistPercentWeek?.lastWeekTotalCount),
                ],
                colors: [theme.palette.error.light, theme.palette.error.main], // Màu đỏ cho sự cố
              }}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Số lượng sự cố ngoài"
              key="1"
              percent={dataReportExternalIncidentChecklistPercentWeek?.percentageChange}
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
          <Grid xs={12} md={5}>
            <BankingExpensesCategories
              title="Số lượng dự án"
              isLoading={isLoading}
              chart={{
                series: dataDuan,
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.info.darker,
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.success.darker,
                  theme.palette.error.main,
                  theme.palette.info.dark,
                  theme.palette.warning.dark,
                ],
              }}
            />
          </Grid>
          {/* <Grid xs={12} md={7} lg={7}>
            <EcommerceYearlySales
              title="Yearly Sales"
              subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Thứ 2',
                  'Thứ 3',
                  'Thứ 4',
                  'Thứ 5',
                  'Thứ 6',
                  'Thứ 7',
                  'Chủ nhật',

                ],
                series: [
                  {
                    year: '2024',
                    data: [
                      {
                        name: 'Khối bảo vệ',
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                      },
                      {
                        name: 'Khối làm sạch',
                        data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                      },
                      {
                        name: 'Khối kỹ thuật',
                        data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                      },
                    ],
                  },

                ],
              }}
            />
          </Grid> */}

          <Grid container xs={12} md={7} sx={{ flexDirection: 'row', gap: 0 }} rowSpacing={0}>
            <Grid xs={12} md={6} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối kỹ thuật"
                total={`${dataReportPercentChecklist ? dataReportPercentChecklist['Khối kỹ thuật'] : ''
                  }`}
              />
            </Grid>
            <Grid xs={12} md={6} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối bảo vệ"
                total={`${dataReportPercentChecklist ? dataReportPercentChecklist['Khối bảo vệ'] : ''
                  }`}
              />
            </Grid>
            <Grid xs={12} md={6} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối dịch vụ"
                total={`${dataReportPercentChecklist ? dataReportPercentChecklist['Khối dịch vụ'] : ''
                  }`}
              />
            </Grid>
            <Grid xs={12} md={6} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối làm sạch"
                total={`${dataReportPercentChecklist ? dataReportPercentChecklist['Khối làm sạch'] : ''
                  }`}
              />
            </Grid>
            <Grid xs={12} md={6} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối F&B"
                total={`${dataReportPercentChecklist ? dataReportPercentChecklist['Khối F&B'] : ''
                  }`}
              />
            </Grid>
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <ChecklistsHoanThanh
              title="Tỉ lệ hoàn thành checklist hôm trước"
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
          <Grid xs={12} md={12} lg={12}>
            <ChecklistsSuCo
              title="Số lượng sự cố trong ngày"
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
              handleOpenModalSuCo={handleOpenModalSuCo}
              handleCloseModalSuCo={handleCloseModalSuCo}
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
                  '&::-webkit-scrollbar': { display: 'none' }, // Ẩn thanh cuộn trong WebKit
                  '-ms-overflow-style': 'none', // Ẩn thanh cuộn trong IE và Edge
                  'scrollbar-width': 'none', // Ẩn thanh cuộn trong Firefox
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
          <Button color="success" variant="contained" onClick={() => handleDownload(spreadsheetData)}>
            Download
          </Button>
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
            src={`${getImageUrls(1, detailChecklist?.Anh)}`}
            ratio="1/1"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Dialog
        open={openDataChecklistMonth}
        onClose={handleCloseChecklistMonth}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Báo cáo checklist</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} m={1}>
            <DatePicker
              label="Tháng" // Corrected
              openTo="month"
              views={['month']}
              value={dataChecklistMonth.month ? new Date(2024, dataChecklistMonth.month - 1) : null}
              onChange={handleMonthChange}
            />
            <DatePicker
              label="Năm" // Corrected
              views={['year']}
              value={dataChecklistMonth.year ? new Date(dataChecklistMonth.year, 0) : null}
              onChange={handleYearChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChecklistMonth}>Close</Button>
          <Button
            color="success"
            variant="contained"
            disabled={loadingReport}
            onClick={fetchChecklistMonth}
          >
            {loadingReport ? <CircularProgress size={24} color="inherit" /> : 'Xuất file'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDataChecklistLocation}
        onClose={handleCloseChecklistLocation}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Báo cáo vị trí</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} m={1}>
            <DatePicker
              label="Tháng" // Corrected
              openTo="month"
              views={['month']}
              value={dataChecklistMonth.month ? new Date(2024, dataChecklistMonth.month - 1) : null}
              onChange={handleMonthChange}
            />
            <DatePicker
              label="Năm" // Corrected
              views={['year']}
              value={dataChecklistMonth.year ? new Date(dataChecklistMonth.year, 0) : null}
              onChange={handleYearChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChecklistLocation}>Close</Button>
          <Button
            color="success"
            variant="contained"
            disabled={loadingReport}
            onClick={fetchChecklistLocation}
          >
            {loadingReport ? <CircularProgress size={24} color="inherit" /> : 'Xuất file'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
