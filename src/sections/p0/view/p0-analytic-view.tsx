import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
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
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import EcommerceYearlySales from './ecommerce';
import EcommerceWidgetSummary from '../../overview/management/ecommerce-widget-summary';
import CustomProjectChart from './custom-chart';

// ----------------------------------------------------------------------

interface AnomalyItem {
  Nhom: string;
  ID_Chinhanh: number;
  Tenchinhanh: string;
  ID_Duan: number;
  Duan: string;
  NgayBC: string;
  Sotheotodk: number;
  Sltheoto: number;
  Sltheotophanmem: number;
  Sothexemaydk: number;
  Slthexemay: number;
  Slthexemayphanmem: number;
}

interface Analytics2Data {
  thieuThe: AnomalyItem[];
  thuaThe: AnomalyItem[];
}

interface ProjectNotSent {
  NgayBC: string;
  TenDuAn: string;
}

interface SevenDayData {
  date: string;
  data: {
    NgayBc: string;
    SoDA: number;
    TongDA: number;
    Tyle: string;
  };
}

export default function P0_AnalyticsView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const router = useRouter();

  const [data1, setData1] = useState<any>();
  const [data2, setData2] = useState<Analytics2Data | null>(null);
  const [data3_1, setData3_1] = useState<any>();
  const [data3_2, setData3_2] = useState<ProjectNotSent[]>([]);
  const [data4, setData4] = useState<any>();
  const [data7Days, setData7Days] = useState<SevenDayData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectsNotSentDialogOpen, setProjectsNotSentDialogOpen] = useState(false);

  const getAnalytics1 = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/p0/analytics/1`);
      setData1(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu analytics 1:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAnalytics2 = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/p0/analytics/2`);
      setData2(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu analytics 2:', error.message);
    }
  }, []);

  const getAnalytics3_1 = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/p0/analytics/3`);
      setData3_1(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu analytics 3:', error.message);
    }
  }, []);

  const getAnalytics3_2 = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/p0/analytics/4`);
      setData3_2(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu analytics 3:', error.message);
    }
  }, []);

  const getAnalytics4 = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/p0/analytics/5`);
      setData4(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu analytics 3:', error.message);
    }
  }, []);

  const getAnalytics7Days = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(`https://checklist.pmcweb.vn/be/api/v2/p0/analytics/6`);
      setData7Days(response.data || []);
    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu 7 ngày:', error.message);
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getAnalytics1(),
        getAnalytics2(),
        getAnalytics3_1(),
        getAnalytics3_2(),
        getAnalytics4(),
        getAnalytics7Days(),
      ]);
    };
    fetchData();
  }, [getAnalytics1, getAnalytics2, getAnalytics3_1, getAnalytics3_2, getAnalytics4, getAnalytics7Days]);

  const handleOpenDialog = useCallback(() => {
    if (!data2) return;
    setDialogOpen(true);
  }, [data2]);

  const handleOpenProjectsNotSentDialog = useCallback(() => {
    setProjectsNotSentDialogOpen(true);
  }, []);

  const hasAnomalyData = (data2?.thieuThe?.length || 0) > 0 || (data2?.thuaThe?.length || 0) > 0;
  const thieuTheCount = data2?.thieuThe?.length || 0;
  const thuaTheCount = data2?.thuaThe?.length || 0;

  const thieuTheColor = thieuTheCount === 0 ? 'success.main' : 'error.main';
  const thuaTheColor = thuaTheCount === 0 ? 'success.main' : 'warning.main';

  const renderAnomalyTable = (data: AnomalyItem[], type: 'thieu' | 'thua') => (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Chi nhánh</TableCell>
            <TableCell>Dự án</TableCell>
            <TableCell>Ngày báo cáo</TableCell>
            <TableCell align="right">Thẻ ô tô đăng ký</TableCell>
            <TableCell align="right">Thẻ ô tô</TableCell>
            <TableCell align="right">Thẻ ô tô PM</TableCell>
            <TableCell align="right">Thẻ xe máy đăng ký</TableCell>
            <TableCell align="right">Thẻ xe máy</TableCell>
            <TableCell align="right">Thẻ xe máy PM</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={`${type}-${index}`}>
              <TableCell>{item.Tenchinhanh}</TableCell>
              <TableCell>{item.Duan}</TableCell>
              <TableCell>{new Date(item.NgayBC).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell align="right">{item.Sotheotodk}</TableCell>
              <TableCell align="right">{item.Sltheoto}</TableCell>
              <TableCell align="right">{item.Sltheotophanmem}</TableCell>
              <TableCell align="right">{item.Sothexemaydk}</TableCell>
              <TableCell align="right">{item.Slthexemay}</TableCell>
              <TableCell align="right">{item.Slthexemayphanmem}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 5,
        }}
      >
        <Typography variant="h4">
          Hi, {user?.Hoten} {user?.ent_chucvu?.Chucvu ? `(${user?.ent_chucvu?.Chucvu})` : ''}{' '}
          {user?.ent_khoicv?.KhoiCV ? `- ${user?.ent_khoicv?.KhoiCV}` : ''}
          {user?.ent_chinhanh?.Tenchinhanh ? `- ${user?.ent_chinhanh?.Tenchinhanh}` : ''}
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button variant="contained" color="success" onClick={() => router.back()}>
            Báo cáo checklist
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <EcommerceWidgetSummary
            key="0"
            title={`Tỉ lệ dự án up dữ liệu ngày ${data1?.yesterday?.NgayBc || ''}`}
            total={`${data1?.yesterday?.Tyle}% (${data1?.yesterday?.SoDA}/${data1?.yesterday?.TongDA})`}
            percent={Number(data1?.yesterday?.Tyle) - Number(data1?.dayBeforeYesterday?.Tyle)}
            chart={{
              series: [
                Number(data1?.dayBeforeYesterday?.Tyle) || 0,
                Number(data1?.yesterday?.Tyle) || 0,
              ],
            }}
            compare={` so với ngày ${data1?.dayBeforeYesterday?.NgayBc}`}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: hasAnomalyData ? 'pointer' : 'default',
              '&:hover': {
                backgroundColor: hasAnomalyData ? 'action.hover' : 'transparent',
              },
            }}
            onClick={hasAnomalyData ? handleOpenDialog : undefined}
          >
            <Typography variant="subtitle1" gutterBottom>
              Chỉ số bất thường
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
                        bgcolor: thieuTheColor,
                      }}
                    />
                    <Typography variant="body2">Thiếu thẻ</Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ color: thieuTheColor }}>
                    {thieuTheCount}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="span"
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: thuaTheColor,
                      }}
                    />
                    <Typography variant="body2">Thừa thẻ</Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ color: thuaTheColor }}>
                    {thuaTheCount}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={handleOpenProjectsNotSentDialog}
          >
            <Typography variant="subtitle1" gutterBottom>
              Thông tin xe
            </Typography>

            <Box mt={2}>
              <Stack spacing={2}>
                {/* Dòng ngày báo cáo */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: 'red',
                    }}
                  />
                  <Typography variant="body2">Ngày:</Typography>
                  <Typography variant="h6" color="error.main">
                    {data3_1?.NgayBC || '-'}
                  </Typography>
                </Stack>

                {/* Dòng thống kê dự án */}
                <Stack
                  direction="row"
                  spacing={4}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Chưa gửi */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="span"
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Các dự án chưa gửi:
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {data3_1?.SoDuAnKhongNhapXe || 0}
                    </Typography>
                  </Stack>

                  {/* Đã gửi */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Đã gửi:
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {(data3_1?.TongSoDuAn || 0) - (data3_1?.SoDuAnKhongNhapXe || 0)} /{' '}
                      {data3_1?.TongSoDuAn || 0}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={5}>
          <CustomProjectChart
            title="Số lượng dự án"
            isLoading={isLoading}
            chart={{
              series: data4, // Your API data with "label" and "value" in format "0/18"
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

        <Grid item xs={12} md={7} lg={7}>
          <EcommerceYearlySales
            title="Tỉ lệ nhập"
            subheader="7 ngày trước"
            chart={{
              data: data7Days
            }}
          />
        </Grid>
      </Grid>

      {/* Dialog for anomaly data */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết chỉ số bất thường</DialogTitle>
        <DialogContent dividers>
          {thieuTheCount > 0 && (
            <>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: 'error.main', display: 'flex', alignItems: 'center' }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    mr: 1,
                  }}
                />
                Thiếu thẻ ({thieuTheCount})
              </Typography>
              {renderAnomalyTable(data2?.thieuThe || [], 'thieu')}
            </>
          )}

          {thuaTheCount > 0 && (
            <>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: 'warning.main', display: 'flex', alignItems: 'center' }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    mr: 1,
                  }}
                />
                Thừa thẻ ({thuaTheCount})
              </Typography>
              {renderAnomalyTable(data2?.thuaThe || [], 'thua')}
            </>
          )}

          {!hasAnomalyData && (
            <Typography variant="body1" align="center" py={3}>
              Không có dữ liệu bất thường
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for projects not sent */}
      <Dialog
        open={projectsNotSentDialogOpen}
        onClose={() => setProjectsNotSentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'error.main',
                mr: 1,
              }}
            />
            Danh sách dự án chưa gửi thông tin xe
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {data3_2 && data3_2.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="10%">STT</TableCell>
                    <TableCell>Tên dự án</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data3_2.map((project, index) => (
                    <TableRow key={`project-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{project.TenDuAn}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center" py={3}>
              Không có dự án nào chưa gửi dữ liệu
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectsNotSentDialogOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
