import { useCallback, useEffect, useState } from 'react';
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
  _appInstalled,
} from 'src/_mock';

// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
// api
import axios from 'axios';
import { useGetKhoiCV } from 'src/api/khuvuc';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';
//
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AppCurrentDownload from '../app-current-download';
import ChecklistsYear from '../checklist-yearly';
import EcommerceSalesOverview from '../checklist-percent-overview';
import AnaLyticsDuan from '../analytics-areas';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import BookingStatistics from '../booking-statistics';
import BankingRecentTransitions from '../banking-recent-transitions';
import AnalyticsWidgetSummary from '../analytics-widget-summary';


// ----------------------------------------------------------------------

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

  const [dataDuan, setDataDuan] = useState<any>([]);

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedKhoiCV, setSelectedKhoiCV] = useState('all');

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [detailPercent, setDetaiPercent] = useState([]);

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
        .get('https://checklist.pmcweb.vn/be/api/ent_duan/thong-tin-du-an', {
          headers: {
            'Content-Type': 'application/json',
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
    const handleDataDuan = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/tb_checklistc/detail-percent', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setDetaiPercent(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataDuan();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(`https://checklist.pmcweb.vn/be/api/tb_checklistc/year-all`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setData1(res.data.data1);
          setData2(res.data.data2);
          setData3(res.data.data3);
          setData4(res.data.data4);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken, selectedYear, selectedKhoiCV]);
  const colorMap : any = {
    'Khối kỹ thuật': 'warning',
    'Khối bảo vệ': 'error',
    'Khối làm sạch': 'success',
    'Khối dịch vụ': 'primary',
  };

  const iconMap : any = {
    'Khối kỹ thuật': 'eva:options-2-fill',
    'Khối bảo vệ': 'eva:shield-fill',
    'Khối làm sạch': 'eva:trash-2-fill',
    'Khối dịch vụ': 'eva:people-fill',
  };

  const handleLinkHSSE = useCallback(()=> {
    const url = "https://pmcwebvn.sharepoint.com/sites/PMCteam/SitePages/B%C3%A1o-c%C3%A1o-HSSE.aspx?csf=1&web=1&share=EUBekLeeP6hLszUcIm2kXQEBm6ZHozG95Gn14yIxExnPFw&e=HsaK0H";
    window.open(url, '_blank');
  },[])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
       <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Typography variant="h4">Hi, {user?.ent_duan?.Duan}</Typography>
        <LoadingButton
          variant="contained"
          startIcon={<Iconify icon="eva:link-2-fill" />}
          onClick={handleLinkHSSE}
        >
          Báo cáo HSSE
        </LoadingButton>
      </Grid>
      <Grid container spacing={3}>
        <Grid
          sx={{
            flexDirection: 'row',
            width: '100%',
            gap: 2, // Khoảng cách giữa các phần tử (tuỳ chọn)
            marginLeft: 0,
          }}
          spacing={3}
          container
        >
          {detailPercent.map((item: any, index) => (
            <AnalyticsWidgetSummary
              key={index}
              title={item.label}
              total={item.value} // Cập nhật tổng số tiền
              icon={<Iconify icon={iconMap[item.label]} style={{ height: 60, width: 60}} />}
              color={colorMap[item.label] || 'primary'} // Lấy màu sắc từ colorMap
              // Thay đổi màu sắc tùy theo chỉ số
              sx={{ flexGrow: 1, flexBasis: 0 }}
            />
          ))}
        </Grid>

        {/* <Grid
          sx={{
            flexDirection: 'row',
            width: '100%',
            gap: 2, // Khoảng cách giữa các phần tử (tuỳ chọn)
            marginLeft: 0,
          }}
          spacing={3}
          container
        >
          <AnalyticsWidgetSummary
            title="Khối làm sạch"
            total={20}
            icon
            color='success'
            sx={{ flexGrow: 1, flexBasis: 0 }}
          />
          <AnalyticsWidgetSummary
            title="Khối kỹ thuật"
            total={20}
            icon
            color='warning'
            sx={{ flexGrow: 1, flexBasis: 0 }}
          />
          <AnalyticsWidgetSummary
            title="Khối bảo vệ"
            total={20}
            icon
             color='error'
            sx={{ flexGrow: 1, flexBasis: 0 }}
          />
          <AnalyticsWidgetSummary
            title="Khối dịch vụ"
            total={20}
            icon
            sx={{ flexGrow: 1, flexBasis: 0 }}
          />
        </Grid> */}
        <Grid lg={12}>
          <BookingStatistics
            title="Tỉ lệ checklist các khối"
            subheader="Hoàn thành checklist theo ca"
            chart={{
              colors: [
                'rgb(0, 167, 111)',
                'rgb(255, 171, 0)',
                'rgb(255, 86, 48)',
                'rgb(0, 184, 217)',
              ],
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  // type: 'Week',
                  data: [
                    {
                      name: 'Khối làm sạch',
                      data: data1,
                    },
                    {
                      name: 'Khối kỹ thuật',
                      data: data2,
                    },
                    {
                      name: 'Khối bảo vệ',
                      data: data3,
                    },
                    {
                      name: 'Khối dịch vụ',
                      data: data4,
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <AnaLyticsDuan title="Thông tin các dự án" list={dataDuan} />
        </Grid>
        {/* {dataTotalKhuvuc && (
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
        </Grid> */}
      </Grid>
    </Container>
  );
}
