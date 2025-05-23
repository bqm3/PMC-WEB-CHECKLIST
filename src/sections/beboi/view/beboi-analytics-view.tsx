import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Container,
  Typography,
  Card,
  Stack,
  CircularProgress,
  Skeleton,
  TextField,
  TablePagination,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import moment from 'moment';
import axios from 'axios';
import * as XLSX from 'xlsx';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import EcommerceWidgetSummary from '../../overview/management/ecommerce-widget-summary';

const STORAGE_KEY = 'accessToken';

type GroupedType = {
  [khuVuc: string]: {
    [hangMuc: string]: {
      [checklist: string]: {
        [ca: string]: any[];
      };
    };
  };
};

export default function BeBoi_AnalyticsView() {
  const theme = useTheme();

  const accessToken = localStorage.getItem(STORAGE_KEY);
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(moment().subtract(1, 'days'));
  const [selectedDate2, setSelectedDate2] = useState(moment().subtract(1, 'days'));
  const [selectedDate3, setSelectedDate3] = useState(moment().subtract(1, 'days'));
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [detailDate, setDetailDate] = useState(moment().subtract(1, 'days'));
  const [detailData, setDetailData] = useState<any[]>([]);

  const [loadingData1, setLoadingData1] = useState<boolean>(true);
  const [loadingData2, setLoadingData2] = useState<boolean>(true);
  const [loadingData3, setLoadingData3] = useState<boolean>(true);

  const [data1, setData1] = useState<any>(); // BEBOI_DuAn_DaLamChecklist
  const [data2, setData2] = useState<any>(); // BEBOI_Phan1
  const [data3, setData3] = useState<any>(); // BeBoi_Danhsachdachualam
  const [data4, setData4] = useState<any>(); // Danh sách dự án nhập bể bơi
  const [data5, setData5] = useState<any>(); // St_ThongTinBeBoi
  const [data6, setData6] = useState<any>(); // Beboi_duan_csbt
  const yesterday = moment().subtract(1, 'days').format('YYYY/MM/DD');

  // Thêm state cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Lấy danh sách chi nhánh duy nhất
  const uniqueBranches = Array.from(
    new Set(data4?.map((item: any) => item.ent_chinhanh?.Tenchinhanh) || [])
  ) as string[];

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm và chi nhánh
  const filteredData = data4?.filter((item: any) => {
    const matchesSearch =
      item.Duan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Diachi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ent_nhom?.Tennhom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ent_phanloaida?.Phanloai?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = !filterBranch || item.ent_chinhanh?.Tenchinhanh === filterBranch;

    return matchesSearch && matchesBranch;
  });

  const isWarningProject = (idDuan: string) => data6?.some((item: any) => item.ID_Duan === idDuan);

  const getAnalytics1 = useCallback(
    async (date: string): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/beboi/analytics`,
          {
            p_ngay: date,
            type: 1,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData1(response.data || []);
      } catch (error: any) {
        console.error('Lỗi khi lấy dữ liệu analytics 1:', error.message);
      } finally {
        setLoadingData1(false);
      }
    },
    [accessToken]
  );

  const getAnalytics2 = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/beboi/analytics`,
        {
          p_ngay: yesterday,
          type: 2,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData2(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu analytics 2:', error.message);
    } finally {
      setLoadingData2(false);
    }
  }, [yesterday, accessToken]);

  const getAnalytics3 = useCallback(
    async (date: string): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/beboi/analytics`,
          {
            p_ngay: date,
            type: 3,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData3(response.data || []);
      } catch (error: any) {
        console.error('Lỗi khi lấy dữ liệu analytics 3:', error.message);
      } finally {
        setLoadingData3(false);
      }
    },
    [accessToken]
  );

  const getAnalytics4 = useCallback(
    async (date: string, id_duan: string): Promise<void> => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/beboi/analytics`,
          {
            p_ngay: date,
            p_ID_Duan: id_duan,
            type: 4,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData5(response.data || []);
      } catch (error: any) {
        console.error('Lỗi khi lấy dữ liệu analytics 4:', error.message);
      }
    },
    [accessToken]
  );

  const getAnalytics6 = useCallback(
    async (date: string): Promise<void> => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/beboi/analytics`,
          {
            p_ngay: date,
            type: 5,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData6(response.data || []);
      } catch (error: any) {
        console.error('Lỗi khi lấy dữ liệu analytics 4:', error.message);
      }
    },
    [accessToken]
  );

  const getData4 = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_API}/beboi/duan`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData4(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu analytics 3:', error.message);
    }
  }, [accessToken]);

  const handleViewDetail = (project: any) => {
    setSelectedProject(project);
    setDetailDate(moment().subtract(1, 'days'));
    setOpenDetailDialog(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getAnalytics1(selectedDate.format('YYYY/MM/DD')),
        getAnalytics2(),
        getAnalytics3(selectedDate2.format('YYYY/MM/DD')),
        getData4(),
        getAnalytics6(selectedDate3.format('YYYY/MM/DD')),
      ]);
    };
    fetchData();
  }, [
    getAnalytics1,
    getAnalytics2,
    getAnalytics3,
    getData4,
    getAnalytics6,
    selectedDate,
    selectedDate2,
    selectedDate3
  ]);

  useEffect(() => {
    if (!loadingData1 && !loadingData2 && !loadingData3) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [loadingData1, loadingData2, loadingData3]);

  useEffect(() => {
    if (selectedProject && openDetailDialog) {
      getAnalytics4(detailDate.format('YYYY/MM/DD'), selectedProject.ID_Duan);
    }
  }, [selectedProject, detailDate, openDetailDialog, getAnalytics4]);

  const handleExportDetail = () => {
    if (!data5 || data5.length === 0) return;

    // 1. Nhóm dữ liệu
    const grouped: GroupedType = {};
    data5.forEach((item: any) => {
      const khuVuc = item.Tenkhuvuc || 'Khác';
      const hangMuc = item.Hangmuc || 'Khác';
      const checklist = item.Checklist || 'Khác';
      const ca = item.Tenca || 'Khác';
      if (!grouped[khuVuc]) grouped[khuVuc] = {};
      if (!grouped[khuVuc][hangMuc]) grouped[khuVuc][hangMuc] = {};
      if (!grouped[khuVuc][hangMuc][checklist]) grouped[khuVuc][hangMuc][checklist] = {};
      if (!grouped[khuVuc][hangMuc][checklist][ca]) grouped[khuVuc][hangMuc][checklist][ca] = [];
      grouped[khuVuc][hangMuc][checklist][ca].push(item);
    });

    // 2. Chuẩn bị dữ liệu cho worksheet
    const wsData: any[] = [];
    wsData.push([
      '',
      `BÁO CÁO CHI TIẾT CHECKLIST BỂ BƠI DỰ ÁN: ${
        selectedProject?.Duan || ''
      } - Ngày: ${detailDate.format('DD/MM/YYYY')}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
    wsData.push([]); // dòng trống
    wsData.push([
      'STT',
      'Khu vực',
      'Hạng mục',
      'Checklist',
      'Ca',
      'Giá trị định danh',
      'Giá trị ghi nhận',
      'Giá trị so sánh',
      'Giờ HT',
      'Đánh giá',
    ]);

    // 3. Đổ dữ liệu, tính toán merge cell
    let stt = 1;
    let row = 3; // bắt đầu từ dòng 4 (0-based)
    const merges: XLSX.Range[] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 9 } }, // merge tiêu đề
    ];

    Object.entries(grouped).forEach(([khuVuc, hangMucs]) => {
      const khuVucStart = row;
      Object.entries(hangMucs).forEach(([hangMuc, checklists]) => {
        const hangMucStart = row;
        Object.entries(checklists).forEach(([checklist, cas]) => {
          const checklistStart = row;
          Object.entries(cas).forEach(([ca, items]) => {
            items.forEach((item: any) => {
              wsData.push([
                // eslint-disable-next-line no-plusplus
                stt++,
                khuVuc,
                hangMuc,
                checklist,
                ca,
                item.Giatridinhdanh,
                item.Giatrighinhan,
                item.Giatrisosanh,
                item.Gioht,
                item.Danhgia,
              ]);
              // eslint-disable-next-line no-plusplus
              row++;
            });
          });
          // Merge checklist nếu có nhiều dòng
          if (row - checklistStart > 1) {
            merges.push({ s: { r: checklistStart, c: 3 }, e: { r: row - 1, c: 3 } });
          }
        });
        // Merge hạng mục nếu có nhiều dòng
        if (row - hangMucStart > 1) {
          merges.push({ s: { r: hangMucStart, c: 2 }, e: { r: row - 1, c: 2 } });
        }
      });
      // Merge khu vực nếu có nhiều dòng
      if (row - khuVucStart > 1) {
        merges.push({ s: { r: khuVucStart, c: 1 }, e: { r: row - 1, c: 1 } });
      }
    });

    // 4. Tạo worksheet và merge cell
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!merges'] = merges;

    // 5. Tạo workbook và xuất file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết dự án');
    XLSX.writeFile(
      wb,
      `Chi_tiet_du_an_${selectedProject?.Duan}_${detailDate.format('YYYY-MM-DD')}.xlsx`
    );
  };

  const handleExportCompletedList = () => {
    if (!data1 || data1.length === 0) return;

    // Chuẩn bị dữ liệu cho worksheet
    const wsData: any[] = [];
    wsData.push([
      '',
      `DANH SÁCH DỰ ÁN ĐÃ NHẬP CHECKLIST BỂ BƠI NGÀY ${selectedDate.format('DD/MM/YYYY')}`,
      '',
      '',
    ]);
    wsData.push([]); // dòng trống
    wsData.push(['STT', 'ID Dự án', 'Chi nhánh', 'Tên dự án']);

    data1.forEach((item: any, index: number) => {
      wsData.push([index + 1, item.ID_Duan, item.Tenchinhanh, item.Duan]);
    });

    // Tạo worksheet và merge cell
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } }, // merge tiêu đề
    ];

    // Tạo workbook và xuất file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DS Đã nhập checklist');
    XLSX.writeFile(wb, `DS_Da_nhap_checklist_beboi_${selectedDate.format('YYYY-MM-DD')}.xlsx`);
  };

  const handleExportIncompleteList = () => {
    if (!data3 || data3.length === 0) return;

    // Chuẩn bị dữ liệu cho worksheet
    const wsData: any[] = [];
    wsData.push([
      '',
      `DANH SÁCH DỰ ÁN CHƯA NHẬP CHECKLIST BỂ BƠI NGÀY ${selectedDate2.format('DD/MM/YYYY')}`,
      '',
      '',
    ]);
    wsData.push([]); // dòng trống
    wsData.push(['STT', 'ID Dự án', 'Chi nhánh', 'Tên dự án']);

    data3.forEach((item: any, index: number) => {
      wsData.push([index + 1, item.ID_Duan, item.Tenchinhanh, item.Duan]);
    });

    // Tạo worksheet và merge cell
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } }, // merge tiêu đề
    ];

    // Tạo workbook và xuất file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DS Chưa nhập checklist');
    XLSX.writeFile(wb, `DS_Chua_nhap_checklist_beboi_${selectedDate2.format('YYYY-MM-DD')}.xlsx`);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 5,
          mt: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Hi, {user?.Hoten} {user?.ent_chucvu?.Chucvu ? `(${user?.ent_chucvu?.Chucvu})` : ''}{' '}
          {user?.ent_khoicv?.KhoiCV ? `- ${user?.ent_khoicv?.KhoiCV}` : ''}
          {user?.ent_chinhanh?.Tenchinhanh ? `- ${user?.ent_chinhanh?.Tenchinhanh}` : ''}
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="contained"
            color="success"
            onClick={() => router.back()}
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Báo cáo checklist
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {loadingData2 ? (
            <Card sx={{ p: 2, height: '100%', borderRadius: 2 }}>
              <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={100} />
            </Card>
          ) : (
            <EcommerceWidgetSummary
              key="0"
              title={`Tỉ lệ dự án up dữ liệu ngày ${data2?.yesterday?.Ngay_ghi_nhan || ''}`}
              total={`${data2?.yesterday?.Tyle}% (${data2?.yesterday?.SoDA}/${data2?.yesterday?.TongDA})`}
              percent={Number(data2?.yesterday?.Tyle) - Number(data2?.dayBeforeYesterday?.Tyle)}
              chart={{
                series: [
                  Number(data2?.dayBeforeYesterday?.Tyle) || 0,
                  Number(data2?.yesterday?.Tyle) || 0,
                ],
              }}
              compare={` so với ngày ${data2?.dayBeforeYesterday?.Ngay_ghi_nhan}`}
              sx={{
                height: '100%',
                '& .MuiCardContent-root': {
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                },
              }}
            />
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {loadingData2 ? (
            <Card sx={{ p: 2, height: '100%', borderRadius: 2 }}>
              <Skeleton variant="text" width="70%" height={30} sx={{ mb: 2 }} />
              <Box mt={2}>
                <Stack spacing={2.5}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="20%" height={30} />
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="20%" height={30} />
                  </Stack>
                </Stack>
              </Box>
            </Card>
          ) : (
            <Card
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  boxShadow: 4,
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => setOpenDialog(true)}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: 'primary.main', fontWeight: 'bold' }}
              >
                Số lượng dự án nhập checklist bể bơi
              </Typography>

              <Box mt={2}>
                <Stack spacing={2.5}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="span"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Ngày:{' '}
                      </Typography>
                    </Stack>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        value={selectedDate}
                        onChange={(newValue) => {
                          if (newValue) {
                            setSelectedDate(newValue);
                          }
                        }}
                        format="DD/MM/YYYY"
                        maxDate={moment()}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: {
                              width: '150px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                              },
                            },
                            onClick: (e: React.MouseEvent) => {
                              e.stopPropagation();
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="span"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Số lượng:{' '}
                      </Typography>
                    </Stack>
                    <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      {data1?.length || 0}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {loadingData3 ? (
            <Card sx={{ p: 2, height: '100%', borderRadius: 2 }}>
              <Skeleton variant="text" width="70%" height={30} sx={{ mb: 2 }} />
              <Box mt={2}>
                <Stack spacing={2.5}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="20%" height={30} />
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="20%" height={30} />
                  </Stack>
                </Stack>
              </Box>
            </Card>
          ) : (
            <Card
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  boxShadow: 4,
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => setOpenDialog3(true)}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: 'error.main', fontWeight: 'bold' }}
              >
                Số lượng dự án chưa nhập checklist bể bơi
              </Typography>

              <Box mt={2}>
                <Stack spacing={2.5}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="span"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'error.main',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Ngày:{' '}
                      </Typography>
                    </Stack>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        value={selectedDate2}
                        onChange={(newValue) => {
                          if (newValue) {
                            setSelectedDate2(newValue);
                          }
                        }}
                        format="DD/MM/YYYY"
                        maxDate={moment()}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: {
                              width: '150px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                              },
                            },
                            onClick: (e: React.MouseEvent) => {
                              e.stopPropagation();
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="span"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'error.main',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Số lượng:{' '}
                      </Typography>
                    </Stack>
                    <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                      {data3?.length || 0}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: 'success.main',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Danh sách dự án nhập checklist bể bơi ngày {selectedDate.format('DD/MM/YYYY')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID Dự án</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Chi nhánh</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tên dự án</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data1?.map((item: any) => (
                  <TableRow key={item.ID_Duan} hover>
                    <TableCell>{item.ID_Duan}</TableCell>
                    <TableCell>{item.Tenchinhanh}</TableCell>
                    <TableCell>{item.Duan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => handleExportCompletedList()}
            variant="contained"
            color="success"
            sx={{ borderRadius: 2 }}
          >
            Export Excel
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            color="success"
            sx={{ borderRadius: 2 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog3}
        onClose={() => setOpenDialog3(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {selectedDate2.format('DD/MM/YYYY')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID Dự án</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Chi nhánh</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tên dự án</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data3?.map((item: any) => (
                  <TableRow key={item.ID_Duan} hover>
                    <TableCell>{item.ID_Duan}</TableCell>
                    <TableCell>{item.Tenchinhanh}</TableCell>
                    <TableCell>{item.Duan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => handleExportIncompleteList()}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Export Excel
          </Button>
          <Button
            onClick={() => setOpenDialog3(false)}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
          Danh sách dự án
        </Typography>

        {/* Box chứa chú ý + DatePicker trên 1 dòng */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'orange', fontWeight: 'bold', mr: 2 }}>
            Chú ý: Dự án có checklist bể bơi bất thường màu vàng ngày
          </Typography>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              value={selectedDate3}
              onChange={(newValue) => {
                if (newValue) {
                  setSelectedDate3(newValue);
                }
              }}
              format="DD/MM/YYYY"
              maxDate={moment()}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    width: '150px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  },
                  onClick: (e: React.MouseEvent) => {
                    e.stopPropagation();
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 200 }}
              placeholder="Tìm theo tên, địa chỉ, nhóm..."
            />

            <TextField
              select
              label="Chi nhánh"
              variant="outlined"
              size="small"
              value={filterBranch}
              onChange={(e) => {
                setFilterBranch(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {uniqueBranches.map((branch: string) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID Dự án</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên dự án</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chi nhánh</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nhóm</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phân loại</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: any) => (
                  <TableRow
                    key={item.ID_Duan}
                    hover
                    sx={{ background: isWarningProject(item.ID_Duan) ? '#FFF3CD' : 'white' }}
                  >
                    <TableCell>{item.ID_Duan}</TableCell>
                    <TableCell>{item.Duan}</TableCell>
                    <TableCell>{item.ent_chinhanh?.Tenchinhanh}</TableCell>
                    <TableCell>{item.Diachi}</TableCell>
                    <TableCell>{item.ent_nhom?.Tennhom || '-'}</TableCell>
                    <TableCell>{item.ent_phanloaida?.Phanloai}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          onClick={() => handleViewDetail(item)}
                          size="small"
                          sx={{
                            color: 'primary.main',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              backgroundColor: 'primary.lighter',
                            },
                          }}
                        >
                          <Iconify icon="solar:eye-bold" width={20} height={20} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredData?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
          />
        </TableContainer>
      </Box>

      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 'bold',
            py: 2,
          }}
        >
          Chi tiết dự án {selectedProject?.Duan}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Box
            sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1">Chọn ngày:</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={detailDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDetailDate(newValue);
                    }
                  }}
                  format="DD/MM/YYYY"
                  maxDate={moment()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        width: '150px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="mdi:file-excel" />}
              onClick={handleExportDetail}
              sx={{ borderRadius: 2 }}
            >
              Xuất Excel
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, maxHeight: 'calc(90vh - 250px)' }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '5%' }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>
                    Khu vực
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>
                    Hạng mục
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '20%' }}>
                    Checklist
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>
                    Ca
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>
                    Giá trị định danh
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>
                    Giá trị ghi nhận
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>
                    Giá trị so sánh
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>
                    Giờ HT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>
                    Đánh giá
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data5?.map((item: any, index: number) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ width: '5%' }}>{index + 1}</TableCell>
                    <TableCell sx={{ width: '15%' }}>{item.Tenkhuvuc}</TableCell>
                    <TableCell sx={{ width: '15%' }}>{item.Hangmuc}</TableCell>
                    <TableCell sx={{ width: '20%' }}>{item.Checklist}</TableCell>
                    <TableCell sx={{ width: '10%' }}>{item.Tenca}</TableCell>
                    <TableCell sx={{ width: '10%' }}>{item.Giatridinhdanh}</TableCell>
                    <TableCell sx={{ width: '10%' }}>{item.Giatrighinhan}</TableCell>
                    <TableCell sx={{ width: '10%' }}>{item.Giatrisosanh}</TableCell>
                    <TableCell sx={{ width: '10%' }}>{item.Gioht}</TableCell>
                    <TableCell sx={{ width: '10%' }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            // eslint-disable-next-line no-nested-ternary
                            item.Danhgia === 'Bình thường'
                              ? 'success.lighter'
                              : item.Danhgia === 'Giảm >10%'
                              ? 'error.lighter'
                              : 'warning.lighter',

                          color:
                            // eslint-disable-next-line no-nested-ternary
                            item.Danhgia === 'Bình thường'
                              ? 'success.dark'
                              : item.Danhgia === 'Giảm >10%'
                              ? 'error.dark'
                              : 'warning.dark',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.Danhgia}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDetailDialog(false)}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
