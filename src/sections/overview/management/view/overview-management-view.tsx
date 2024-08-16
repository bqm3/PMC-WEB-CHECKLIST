import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
  _ecommerceSalesOverview,
  _appInstalled
} from 'src/_mock';

// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
// api
import axios from 'axios';
import { useGetKhoiCV } from 'src/api/khuvuc';
//
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AppCurrentDownload from '../app-current-download';
import ChecklistsYear from '../checklist-yearly';
import EcommerceSalesOverview from '../checklist-percent-overview'
import AnaLyticsDuan from '../analytics-areas';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
type widgetData = {
  percent: number;
  chart: number[] | any;
  chart_month: string[];
  total_orders_this_week: number | any;
  total_users: number | any;
  total_orders_status_4: number | any;
  total_orders: number | any;
  series: any | number;
  result: any | number;
};

const STORAGE_KEY = 'accessToken';

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

export default function OverviewAnalyticsView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user, logout } = useAuthContext();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [dataDuan, setDataDuan] = useState<any>([])

  const [dataTotalKhoiCV, setDataTotalKhoiCV] = useState<SeriesData[]>([]);
  const [dataTotalKhuvuc, setDataTotalKhuvuc] = useState<SeriesData[]>([]);
  const [dataTotalHangmuc, setDataTotalHangmuc] = useState<SeriesData[]>([]);
  const [dataPercent, setDataPercent] = useState<any>([]);
  const [totalKhoiCV, setTotalKhoiCV] = useState(0);
  const [dataTotalYear, setDataTotalYear] = useState<ChartData>({ categories: [], series: [] });
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedKhoiCV, setSelectedKhoiCV] = useState('all');

  const { khoiCV } = useGetKhoiCV();
  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([{ value: 'all', label: 'Tất cả' }]);

  useEffect(() => {
    // Assuming khoiCV is set elsewhere in your component
    khoiCV.forEach((khoi) => {
      set_STATUS_OPTIONS((prevOptions) => [
        ...prevOptions,
        { value: khoi.ID_Khoi.toString(), label: khoi.KhoiCV },
      ]);
    });
  }, [khoiCV]);

  useEffect(() => {
    const handleDataDuan = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be//api/ent_duan/thong-tin-du-an', {
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


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, {user?.UserName === 'PSH' ? 'Phòng Số Hóa' : user?.UserName}
      </Typography>
      <Grid container spacing={3}>
      <Grid xs={12} md={12} lg={12}>
          <AnaLyticsDuan title="Thông tin các dự án" list={dataDuan} />
        </Grid>

        {dataTotalKhuvuc && (
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Khai báo khu vực"
              chart={{
                series: dataTotalKhuvuc,
                colors: [
                  'rgb(0, 167, 111)',
                  'rgb(255, 171, 0)',
                  'rgb(255, 86, 48)',
                  'rgb(0, 184, 217)',
                ],
              }}
            />
          </Grid>
        )}
        {dataTotalHangmuc && (
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Khai báo hạng mục"
              chart={{
                series: dataTotalHangmuc,
                colors: [
                  'rgb(0, 167, 111)',
                  'rgb(255, 171, 0)',
                  'rgb(255, 86, 48)',
                  'rgb(0, 184, 217)',
                ],
              }}
            />
          </Grid>
        )}
        <Grid xs={12} md={6} lg={4}>
          {dataTotalKhoiCV && (
            <AnalyticsCurrentVisits
              title={`Khai báo Checklists: ${totalKhoiCV}`}
              chart={{
                series: dataTotalKhoiCV,
                colors: [
                  'rgb(0, 167, 111)',
                  'rgb(255, 171, 0)',
                  'rgb(255, 86, 48)',
                  'rgb(0, 184, 217)',
                ],
              }}
            />
          )}
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <ChecklistsYear
            title="Số lượng checklist"
            subheader="Hoàn thành checklist theo ca"
            chart={{
              categories: dataTotalYear.categories,
              series: dataTotalYear.series,
            }}
            selectedYear={selectedYear} // Pass selected year as prop
            onYearChange={setSelectedYear}
            selectedKhoiCV={selectedKhoiCV}
            onKhoiChange={setSelectedKhoiCV}
            STATUS_OPTIONS={STATUS_OPTIONS}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <EcommerceSalesOverview title="Tỉ lệ checklist" data={dataPercent} />
        </Grid>
        
      
      </Grid>
    </Container>
  );
}
