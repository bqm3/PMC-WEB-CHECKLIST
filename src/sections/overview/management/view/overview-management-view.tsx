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
import {
  Box,
  CircularProgress,
  Divider,
  TextField,
  List,
  ListItem,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
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
import { useGetKhoiCV, useGetDuanWeb } from 'src/api/khuvuc';
import moment from 'moment';
//
import BansucoDialog from 'src/sections/sucongoai/bansuco-table-dialog';
import ChecklistsHoanThanh from '../checklist-hoan-thanh';
import EcommerceYearlySales from '../ecommerce-yearly-sales';
import PercentChecklistWidgetSummary from '../percent-checklist-widget-summary';
import ChecklistsSuCo from '../checklist-su-co';
import ChecklistsSuCoNgoai from '../checklist-su-co-ngoai';
import SuCoNgoaiListView from '../sucongoai/su-co-ngoai-list-view';
import ManagementSuCoListView from '../suco/su-co-list-view';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import BankingExpensesCategories from '../banking-expenses-categories';
import ThongKeTongHopDialog from './canhbao-xathai';
import ProjectsOverview from '../project-table';

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
    field: 'Khối an ninh',
    headerName: 'Khối an ninh',
    width: 150,
    editable: true,
  },
  // {
  //   field: 'Khối F&B',
  //   headerName: 'Khối F&B',
  //   width: 150,
  //   editable: true,
  // },
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

const chiNhanhs = [
  { value: 'all', label: 'Tất cả' },
  { value: '1', label: 'Hà Nội' },
  { value: '2', label: 'Quảng Ninh - Hải Phòng' },
  { value: '3', label: 'Đà Nẵng' },
  { value: '4', label: 'HCM - HO' },
  { value: '5', label: 'HCM - Thủ Đức' },
  { value: '6', label: 'HCM - Nam Sài Gòn' },
];

const tangGiam = [
  { value: 'desc', label: 'Giảm' },
  { value: 'asc', label: 'Tăng' },
];

const top = [
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];

const years = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
];

// interface ChartData {
//   categories: string[];
//   series: {
//     year: string;
//     data: {
//       name: string;
//       data: number[];
//     }[];
//   }[];
// }

const headerRow = [
  'STT',
  'Dự án',
  'Chi nhánh',
  'Loại hình',
  'Phân loại dự án',
  'Lĩnh vực',
  'Tình trạng',
  'Ngày bắt đầu',
  'Khối kỹ thuật',
  'Khối an ninh',
  'Khối làm sạch',
  'Khối dịch vụ',
  // 'Khối F&B',
];

export default function OverviewAnalyticsView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user, logout } = useAuthContext();

  const router = useRouter();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [dataDuan, setDataDuan] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataPercent, setDataPercent] = useState<any>([]);

  const [showMax, setShowMax] = useState<any>('6');

  const [dataTotalErrorWeek, setDataTotalErrorWeek] = useState<any>([]);
  const [dataTotalYear, setDataTotalYear] = useState<ChartData>({ categories: [], series: [] });
  const [selectedYear, setSelectedYear] = useState('2025');
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
  const [selectedYearSuco, setSelectedYearSuco] = useState('2025');
  const [selectedMonthSuco, setSelectedMonthSuco] = useState(`all`);
  const [selectedKhoiCVSuco, setSelectedKhoiCVSuco] = useState('all');
  const [selectedNhomSuco, setSelectedNhomSuco] = useState('all');
  const [selectedChinhanh, setSelectedChinhanh] = useState('all');
  const [selectedTangGiamSuco, setSelectedTangGiamSuco] = useState('desc');
  const [selectedTopSuco, setSelectedTopSuco] = useState('10');

  // ===============

  const [dataTotalYearSuCoNgoai, setDataTotalYearSuCoNgoai] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const [selectedYearSuCoNgoai, setSelectedYearSuCoNgoai] = useState('2025');
  const [selectedKhoiCVSuCoNgoai, setSelectedKhoiCVSuCoNgoai] = useState('all');
  const [selectedTangGiamSuCoNgoai, setSelectedTangGiamSuCoNgoai] = useState('desc');

  // ===============
  const [dataSCN, setDataSCN] = useState([]);
  const [showModalSCN, setShowModalSCN] = useState(false);
  const [showModalDateSCN, setShowModalDateSCN] = useState(false);
  const [fromDateSCN, setFromDateSCN] = useState<string | null>(null);
  const [toDateSCN, setToDateSCN] = useState<string>(moment().format('YYYY-MM-DD'));
  const [selectedTopSCN, setSelectedTopSucoSCN] = useState('10');

  // ==============
  const [dataDuanChecklist, setDataDuanChecklist] = useState<any>();
  const [showDuanChecklist, setShowDuanChecklist] = useState(false);

  // ============= 21/02/2025 manhnd
  const [showTilehoanthanhh, setShowTilehoanthanhh] = useState(false);
  // ============= hsse
  const [openHsse, setOpenHsse] = useState(false);
  // ===============
  const [dataReportChecklistPercentWeek, setDataReportChecklistPercentWeek] = useState<any>();
  const [dataReportProblemChecklistPercentWeek, setDataProblemChecklistPercentWeek] =
    useState<any>();
  const [
    dataReportExternalIncidentChecklistPercentWeek,
    setDataExternalIncidentChecklistPercentWeek,
  ] = useState<any>();
  const [dataReportPercentChecklist, setDataReportPercentChecklist] = useState<any>();

  const [dataReportPercentWeekChecklist, setDataReportPercentWeekChecklist] = useState<
    ChartData | null | any
  >(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalSCN_lastWeek, setOpenModal_lastWeek] = useState(false);
  const [openModalSuCo, setOpenModalSuCo] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedCodeSuCo, setSelectedCodeSuCo] = useState('');
  const [dataTable, setDataTable] = useState<ISucongoai[]>();
  const [dataTableSuCo, setDataTableSuCo] = useState<any>();
  const [loadingReport, setLoadingReport] = useState<any>();
  const [openDataChecklistMonth, setOpenDataChecklistMonth] = useState<any>(false);
  const [openDataChecklistLocation, setOpenDataChecklistLocation] = useState<any>(false);
  const [openModalAI, setOpenModalAI] = useState(false);
  const [dataChecklistMonth, setDataChecklistMonth] = useState<any>({
    month: null,
    year: null,
  });

  const filteredColumns =
    `${user?.ID_Chucvu}` === `11`
      ? columns.filter(
          (col: any) =>
            col.field === 'id' ||
            col.field === 'projectName' ||
            `${col.field}` === `${user?.ent_khoicv?.KhoiCV}`
        )
      : columns;

  const [spreadsheetData, setSpreadsheetData] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]); // Danh sách tin nhắn
  const [inputMessage, setInputMessage] = useState(''); // Tin nhắn người dùng nhập
  const [loading, setLoading] = useState(false); // Trạng thái đang gửi API

  const handleCloseModal_lastWeek = () => {
    setOpenModal_lastWeek(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseModalSuCo = () => {
    setOpenModalSuCo(false);
  };

  const handleCloseModalAI = () => {
    setOpenModalAI(false);
  };

  const { duan } = useGetDuanWeb();

  const options = [
    { ID_Duan: '-1', Duan: 'Tất cả' },
    ...duan.filter((item) => `${item.ID_Duan}` !== `1`),
  ];
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['-1']);

  const handleOnChange = (event: any, newValue: any) => {
    if (newValue.some((option: any) => option.ID_Duan === '-1')) {
      // Nếu "Tất cả" được chọn
      if (selectedOptions.includes('-1')) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions(['-1']);
      }
    } else {
      setSelectedOptions(newValue.map((option: any) => option.ID_Duan));
    }
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Thêm tin nhắn người dùng vào danh sách
    setMessages((prev: any) => [...prev, { role: 'user', content: inputMessage }]);
    setLoading(true);

    try {
      // Gửi tin nhắn đến API
      const response = await axios.post(`${process.env.REACT_APP_HOST_API}/chat`, {
        message: inputMessage,
      });

      // Thêm phản hồi của bot vào danh sách
      const botReply = response.data.answer;
      setMessages((prev: any) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setInputMessage('');
      setLoading(false);
    }
  };
  const isCodeBlock = (content: any) => content?.startsWith('```') && content?.endsWith('```');

  const renderMessageContent = (message: any) => {
    if (isCodeBlock(message.content)) {
      // Xử lý code block (loại bỏ dấu ``` và hiển thị giao diện code)
      const codeContent = message.content.slice(3, -3);
      return (
        <Box
          sx={{
            fontFamily: 'monospace',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px',
            whiteSpace: 'pre-wrap',
            overflowX: 'auto',
          }}
        >
          {codeContent}
        </Box>
      );
    }
    return (
      <Box
        sx={{
          fontFamily: 'Arial, sans-serif',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          maxWidth: '100%',
          overflowWrap: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
    );
  };

  const handleOpenModal = async (name: string, key: string) => {
    setSelectedCode(name);
    await axios
      .get(
        `${process.env.REACT_APP_HOST_API}/tb_sucongoai/${key}?name=${name}&year=${dataTotalYearSuCoNgoai}`
      )
      .then((data) => {
        setDataTable(data?.data?.data);
        setOpenModal(true);
      })
      .catch((error) => console.log('error'));
  };

  const handleOpenModalSuCo = async (name: string, key: string) => {
    setSelectedCodeSuCo(name);
    await axios
      .get(
        `${process.env.REACT_APP_HOST_API}/tb_checklistc/${key}?name=${name}&khoi=${selectedKhoiCVSuco}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
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
      ...khoiCV
        .filter((khoi) => `${khoi.ID_KhoiCV}` !== `5`)
        .map((khoi) => ({
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
        .get(`${process.env.REACT_APP_HOST_API}/ent_duan/du-an-theo-nhom`, {
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
        });
    };

    handleDataDuan();
  }, [accessToken]);

  useEffect(() => {
    const handleDataPercent = async () => {
      await axios
        .get(`${process.env.REACT_APP_HOST_API}/tb_checklistc/percent-checklist-project`, {
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
            'Khối an ninh': project.createdKhois['Khối an ninh']?.completionRatio
              ? `${project.createdKhois['Khối an ninh']?.completionRatio} %`
              : null,
            // 'Khối F&B': project.createdKhois['Khối F&B']?.completionRatio
            //   ? `${project.createdKhois['Khối F&B']?.completionRatio} %`
            //   : null,
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
        .get(`${process.env.REACT_APP_HOST_API}/tb_checklistc/report-checklist-percent-yesterday`, {
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
    const handleDataPercent = async () => {
      await axios
        .get(`${process.env.REACT_APP_HOST_API}/tb_checklistc/report-checklist-percent-a-week`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const dataRes = res.data.data;
          setDataReportPercentWeekChecklist(dataRes);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataPercent();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get(`${process.env.REACT_APP_HOST_API}/tb_checklistc/list-checklist-error`, {
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
          `${process.env.REACT_APP_HOST_API}/tb_checklistc/ti-le-hoan-thanh?
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
        .get(`${process.env.REACT_APP_HOST_API}/tb_checklistc/report-checklist-percent-week`, {
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
        .get(`${process.env.REACT_APP_HOST_API}/tb_checklistc/report-problem-percent-week`, {
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
          `${process.env.REACT_APP_HOST_API}/tb_sucongoai/report-external-incident-percent-week`,
          {
            headers: {
              'Content-Type': 'application/json',
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
          `${process.env.REACT_APP_HOST_API}/tb_checklistc/ti-le-su-co?
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
    if (
      !accessToken ||
      !selectedYearSuCoNgoai ||
      !selectedKhoiCVSuCoNgoai ||
      !selectedChinhanh ||
      !selectedTopSCN
    ) {
      return;
    }

    const handleTangGiam = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST_API}/tb_sucongoai/dashboard?year=${selectedYearSuCoNgoai}&khoi=${selectedKhoiCVSuCoNgoai}&chinhanh=${selectedChinhanh}&top=${selectedTopSCN}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDataTotalYearSuCoNgoai(res.data.data);
      } catch (err) {
        console.log('Lỗi khi gọi API:', err);
      }
    };

    handleTangGiam();
  }, [
    accessToken,
    selectedYearSuCoNgoai,
    selectedKhoiCVSuCoNgoai,
    selectedChinhanh,
    selectedTopSCN,
  ]);

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
        `${process.env.REACT_APP_HOST_API}/tb_checklistc/report-checklist-project-percent-excel`,
        null, // Use null as the second parameter because POST requests without a body can pass null
        { responseType: 'blob' } // Important to specify responseType as blob
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao_cao_checklist_du_an.xlsx`); // Set the file name

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
        `${process.env.REACT_APP_HOST_API}/tb_checklistc/report-checklist-project-excel`
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

  const handleShowDuanSCN = () => {
    setShowModalDateSCN(true);
  };

  const handleCloseShowDuanSCN = () => {
    setShowModalDateSCN(false);
  };

  const handleFromDateChange = (newValue: any) => {
    setFromDateSCN(moment(newValue).format('YYYY-MM-DD'));
  };

  const handleToDateChange = (newValue: any) => {
    setToDateSCN(moment(newValue).format('YYYY-MM-DD'));
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
        `${process.env.REACT_APP_HOST_API}/tb_checklistc/report-checklist-years?year=${dataChecklistMonth.year}&month=${dataChecklistMonth.month}`,
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
        `${process.env.REACT_APP_HOST_API}/tb_checklistc/report-location-times?year=${dataChecklistMonth.year}&month=${dataChecklistMonth.month}`,
        { duan: selectedOptions }, // Use null as the second parameter because POST requests without a body can pass null
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

  const fetchListDuanUploadSCN = async () => {
    setLoadingReport(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/tb_sucongoai/duan-upload?fromDate=${fromDateSCN}&toDate=${toDateSCN}`
      );
      if (response.data) {
        let index = 1; // Initialize index before iterating
        const formattedData = response.data.flatMap((item: any) =>
          item.duans.map((project: any) => {
            const row = [
              { value: index.toString() }, // Use the current index
              { value: item.chinhanh },
              { value: project.Duan },
            ];
            index += 1;
            return row;
          })
        );
        setDataSCN(formattedData);
        setShowModalSCN(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingReport(false);
    }
  };

  const DownloadListDuanUploadSCN = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/tb_sucongoai/duan-upload?format=excel&fromDate=${fromDateSCN}&toDate=${toDateSCN}`,
        { responseType: 'blob' } // Chỉ định phản hồi là blob (nhị phân)
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      // Tạo một liên kết giả để tải tệp
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DuanUploadSCN.xlsx'); // Tên tệp khi tải về
      document.body.appendChild(link);
      link.click(); // Bắt đầu tải về
      document.body.removeChild(link); // Loại bỏ liên kết sau khi tải về

      // Giải phóng URL blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const fetchListDSduan = async () => {
    setLoadingReport(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/tb_checklistc/first-checklist`
      );
      if (response.data) {
        let index = 1;
        const formattedData = [
          ...response.data.map((item: any) => {
            const row = [
              { value: index },
              { value: item.Du_an },
              { value: item.Chi_Nhanh },
              { value: item.Loai_Hinh },
              { value: item.Phan_loai_du_an },
              { value: item.Linh_vuc },
              {
                value: item.Tinh_trang,
                style: {
                  backgroundColor:
                    item.Tinh_trang.trim() === 'Chưa tiến hành' ? 'yellow' : 'transparent',
                },
              },
              { value: item.Ngay_bat_dau },
              { value: item.Khoi_ky_thuat },
              { value: item.Khoi_an_ninh },
              { value: item.Khoi_lam_sach },
              { value: item.Khoi_dich_vu },
              { value: item.Khoi_F_B },
            ];
            index += 1;
            return row;
          }),
        ];

        setDataDuanChecklist(formattedData);
        setShowDuanChecklist(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingReport(false);
    }
  };
  const DownloadListDSduan = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/tb_checklistc/first-checklist?format=excel`,
        { responseType: 'blob' } // Chỉ định phản hồi là blob (nhị phân)
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      // Tạo một liên kết giả để tải tệp
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'duandanghoatdong.xlsx'); // Tên tệp khi tải về
      document.body.appendChild(link);
      link.click(); // Bắt đầu tải về
      document.body.removeChild(link); // Loại bỏ liên kết sau khi tải về

      // Giải phóng URL blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const DashboardMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    const handleMenuItemClick = (action: any) => {
      handleCloseMenu();
      action();
    };

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          endIcon={<Iconify icon="material-symbols:keyboard-arrow-down" />}
        >
          Báo cáo
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <BansucoDialog isMenu />
          <MenuItem
            onClick={() => handleMenuItemClick(() => router.push(paths.dashboard.p0.analytics))}
          >
            <Iconify icon="mdi:chart-box" style={{ marginRight: '8px' }} />
            Báo cáo S0
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuItemClick(() => router.push(paths.dashboard.beboi.analytics))}
          >
            <Iconify icon="mdi:chart-box" style={{ marginRight: '8px' }} />
            Báo cáo bể bơi
          </MenuItem>

          <MenuItem onClick={() => handleMenuItemClick(() => setOpenHsse(true))}>
            <Iconify icon="mdi:alert" style={{ marginRight: '8px' }} />
            Cảnh báo xả thải
          </MenuItem>

          <MenuItem onClick={() => handleMenuItemClick(fetchExcelData)}>
            <Iconify icon="mdi:file-document-outline" style={{ marginRight: '8px' }} />
            Danh sách dự án
          </MenuItem>

          {`${user?.ent_chucvu?.Role}` === `10` && (
            <>
              <MenuItem onClick={() => handleMenuItemClick(fetchListDSduan)}>
                <Iconify icon="mdi:folder-outline" style={{ marginRight: '8px' }} />
                Danh sách dự án đang triển khai
              </MenuItem>

              <MenuItem onClick={() => handleMenuItemClick(handleOpenChecklistLocation)}>
                <Iconify icon="mdi:map-marker" style={{ marginRight: '8px' }} />
                Báo cáo vị trí
              </MenuItem>

              <MenuItem onClick={() => handleMenuItemClick(handleOpenChecklistMonth)}>
                <Iconify icon="mdi:clipboard-check-outline" style={{ marginRight: '8px' }} />
                Báo cáo checklist
              </MenuItem>

              <MenuItem onClick={() => handleMenuItemClick(handleShowDuanSCN)}>
                <Iconify icon="mdi:format-list-bulleted" style={{ marginRight: '8px' }} />
                Danh sách SCN
              </MenuItem>
            </>
          )}
        </Menu>
      </div>
    );
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">BÁO CÁO CHECKLIST</Typography>
        </Box>
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
            Hi, {user?.Hoten} {user?.ent_chucvu?.Chucvu ? `(${user?.ent_chucvu?.Chucvu})` : ''}{' '}
            {user?.ent_khoicv?.KhoiCV ? `- ${user?.ent_khoicv?.KhoiCV}` : ''}
            {user?.ent_chinhanh?.Tenchinhanh ? `- ${user?.ent_chinhanh?.Tenchinhanh}` : ''}
          </Typography>
          <DashboardMenu />
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title={`Tỉ lệ checklist ngày ${
                dataReportChecklistPercentWeek?.yesterdayDate
                  ? dataReportChecklistPercentWeek?.yesterdayDate
                  : ''
              }`}
              key="0"
              percent={
                Number(dataReportChecklistPercentWeek?.lastWeekPercentage) -
                Number(dataReportChecklistPercentWeek?.previousWeekPercentage)
              }
              total={`${dataReportChecklistPercentWeek?.lastWeekPercentage} % `}
              chart={{
                series: [
                  Number(dataReportChecklistPercentWeek?.previousWeekPercentage),
                  Number(dataReportChecklistPercentWeek?.lastWeekPercentage),
                ],
              }}
              compare={` so với ngày ${
                dataReportChecklistPercentWeek?.previousYesterdayDate
                  ? dataReportChecklistPercentWeek?.previousYesterdayDate
                  : ''
              }`}
              onClick={() => setShowTilehoanthanhh(true)}
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
              compare=" so với tuần trước"
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
              compare=" so với tuần trước"
              onClick={() => setOpenModal_lastWeek(true)}
            />
          </Grid>

          {/* <Grid container md={12} lg={12} spacing={2} sx={{ flexDirection: 'row' }}>
            <Grid xs={4} md={2.4} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối kỹ thuật"
                total={`${ dataReportPercentChecklist? dataReportPercentChecklist['Khối kỹ thuật']: '' }`}
              />
            </Grid>
            <Grid xs={4} md={2.4} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối an ninh"
                total={`${ dataReportPercentChecklist? dataReportPercentChecklist['Khối an ninh']: '' }`}
              />
            </Grid>
            <Grid xs={4} md={2.4} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối dịch vụ"
                total={`${ dataReportPercentChecklist? dataReportPercentChecklist['Khối dịch vụ']: '' }`}
              />
            </Grid>
            <Grid xs={4} md={2.4} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối làm sạch"
                total={`${ dataReportPercentChecklist? dataReportPercentChecklist['Khối làm sạch']: '' }`}
              />
            </Grid>
            <Grid xs={4} md={2.4} sx={{ mb: 0 }}>
              <PercentChecklistWidgetSummary
                title="Khối F&B"
                total={`${ dataReportPercentChecklist? dataReportPercentChecklist['Khối F&B']: '' }`}
              />
            </Grid>
          </Grid> */}

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
          <Grid xs={12} md={7} lg={7}>
            <EcommerceYearlySales
              title="Tỉ lệ hoàn thành checklist"
              subheader="7 ngày trước"
              chart={{
                categories: dataReportPercentWeekChecklist?.categories,
                series: dataReportPercentWeekChecklist?.series,
              }}
            />
          </Grid>

          {/* <Grid xs={12} md={12} lg={12}> */}
          <Grid xs={12} md={6}>
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
              // top={top}
              showMax={showMax}
              setShowMax={setShowMax}
            />
          </Grid>

          <Grid xs={12} md={6}>
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
              // top={top}
              handleOpenModalSuCo={handleOpenModalSuCo}
              handleCloseModalSuCo={handleCloseModalSuCo}
              //
            />
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <ProjectsOverview dataPercent={dataPercent} />
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
              selectedChiNhanh={selectedChinhanh}
              onYearChange={setSelectedYearSuCoNgoai}
              onTangGiamChange={setSelectedTangGiamSuCoNgoai}
              onKhoiChange={setSelectedKhoiCVSuCoNgoai}
              onChinhanhChange={setSelectedChinhanh}
              STATUS_OPTIONS={STATUS_OPTIONS}
              tangGiam={tangGiam}
              chiNhanhs={chiNhanhs}
              years={years}
              handleOpenModal={handleOpenModal}
              handleCloseModal={handleCloseModal}
              onTopChange={setSelectedTopSucoSCN}
              selectedTop={selectedTopSCN}
              top={top}
            />
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={showTilehoanthanhh}
        onClose={() => setShowTilehoanthanhh(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 0, // Loại bỏ bo góc
          },
        }}
      >
        <Typography sx={{ ml: 1, pb: 1.5, fontWeight: '600', fontSize: 18 }}>
          Tỉ lệ hoàn thành checklist hôm qua
        </Typography>
        <DataGrid
          rows={dataPercent}
          columns={filteredColumns}
          sx={{
            maxHeight: 450,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { display: 'none' }, // Ẩn thanh cuộn trong WebKit
            '-ms-overflow-style': 'none', // Ẩn thanh cuộn trong IE và Edge
            'scrollbar-width': 'none', // Ẩn thanh cuộn trong Firefox
          }}
          disableRowSelectionOnClick
          hideFooter
        />

        <DialogActions>
          <Button color="inherit" variant="contained" onClick={() => setShowTilehoanthanhh(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDuanChecklist}
        onClose={() => setShowDuanChecklist(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent
          sx={{
            m: 2,
            scrollBehavior: 'auto',
            overflow: 'auto',
          }}
        >
          {dataDuanChecklist ? (
            <Spreadsheet data={dataDuanChecklist} columnLabels={headerRow} />
          ) : (
            <div>Không có dữ liệu để hiển thị</div>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="success" variant="contained" onClick={() => DownloadListDSduan()}>
            Download
          </Button>
          <Button color="inherit" variant="contained" onClick={() => setShowDuanChecklist(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showModalSCN} onClose={() => setShowModalSCN(false)} fullWidth maxWidth="lg">
        <DialogContent
          sx={{
            m: 2,
            scrollBehavior: 'auto',
            overflow: 'auto',
          }}
        >
          {dataSCN.length > 0 ? (
            <Spreadsheet data={dataSCN} />
          ) : (
            <div>Không có dữ liệu để hiển thị</div>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="success" variant="contained" onClick={() => DownloadListDuanUploadSCN()}>
            Download
          </Button>
          <Button color="inherit" variant="contained" onClick={() => setShowModalSCN(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button
            color="success"
            variant="contained"
            onClick={() => handleDownload(spreadsheetData)}
          >
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
            <ManagementSuCoListView data={dataTableSuCo} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalSuCo}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalAI} onClose={handleCloseModalAI} fullWidth maxWidth="lg">
        <DialogTitle>Tra cứu nhanh về HSSE</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: '100%',
              maxWidth: '700px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '500px',
              marginBottom: 10,
            }}
          >
            <List
              sx={{
                maxHeight: '500px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: 2,
                '&::-webkit-scrollbar': { display: 'none' }, // Ẩn thanh cuộn trong WebKit
                '-ms-overflow-style': 'none', // Ẩn thanh cuộn trong IE và Edge
                'scrollbar-width': 'none', // Ẩn thanh cuộn trong Firefox
              }}
            >
              {messages.map((message: any, index: number) => (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    textAlign: message.role === 'user' ? 'right' : 'left',
                  }}
                >
                  <Box
                    sx={{
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: message.role === 'user' ? '#1976d2' : '#e0e0e0',
                      color: message.role === 'user' ? '#fff' : '#000',
                      maxWidth: '70%',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {renderMessageContent(message)}
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) handleSendMessage();
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
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseModalAI}>Close</Button>
        </DialogActions> */}
      </Dialog>

      <Dialog
        open={openModalSCN_lastWeek}
        onClose={handleCloseModal_lastWeek}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Danh sách sự cố ngoài tuần trước: {selectedCode}</DialogTitle>
        <DialogContent>
          {dataReportExternalIncidentChecklistPercentWeek?.list &&
            dataReportExternalIncidentChecklistPercentWeek?.list?.length > 0 &&
            openModalSCN_lastWeek === true && (
              // eslint-disable-next-line react/jsx-boolean-value
              <SuCoNgoaiListView
                data={dataReportExternalIncidentChecklistPercentWeek?.list}
                tenduan
              />
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal_lastWeek}>Close</Button>
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
              value={dataChecklistMonth.month ? new Date(2025, dataChecklistMonth.month - 1) : null}
              onChange={handleMonthChange}
            />
            <DatePicker
              label="Năm" // Corrected
              views={['year']}
              value={dataChecklistMonth.year ? new Date(dataChecklistMonth.year, 0) : null}
              onChange={handleYearChange}
            />
            <Autocomplete
              multiple
              id="checkbox-autocomplete-with-ids"
              fullWidth
              disableCloseOnSelect
              limitTags={2}
              options={options}
              getOptionLabel={(option) => option.Duan}
              value={options.filter((option) => selectedOptions.includes(option.ID_Duan))}
              onChange={handleOnChange}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.Duan}
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    // key={index}
                    label={option.Duan}
                    {...getTagProps({ index })}
                    sx={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'inherit',
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dự án"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
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

      <Dialog open={showModalDateSCN} onClose={handleShowDuanSCN} fullWidth maxWidth="sm">
        <DialogTitle>Báo cáo dự án upload sự cố ngoài</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} m={1}>
            <DatePicker
              label="Từ ngày"
              value={fromDateSCN ? new Date(fromDateSCN) : null}
              onChange={(newValue) => handleFromDateChange(newValue)}
              format="yyyy/MM/dd"
              minDate={new Date('2020-01-01')}
              maxDate={new Date()}
            />
            <DatePicker
              label="Đến ngày"
              value={toDateSCN ? new Date(toDateSCN) : null}
              onChange={(newValue) => handleToDateChange(newValue)}
              format="yyyy/MM/dd"
              minDate={fromDateSCN ? new Date(fromDateSCN) : new Date('2020-01-01')}
              maxDate={new Date()}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShowDuanSCN}>Close</Button>
          <Button
            color="success"
            variant="contained"
            disabled={loadingReport}
            onClick={fetchListDuanUploadSCN}
          >
            {loadingReport ? <CircularProgress size={24} color="inherit" /> : 'Xuất file'}
          </Button>
        </DialogActions>
      </Dialog>

      <ThongKeTongHopDialog open={openHsse} onClose={() => setOpenHsse(false)} />
    </>
  );
}
