import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
// api
import axios from 'axios';
import { useGetKhoiCV } from 'src/api/khuvuc';
import AnalyticsCurrentVisits from '../analytics-current-visits';

import AppCurrentDownload from '../app-current-download';
import BankingRecentTransitions from '../banking-recent-transitions';
import ChecklistRecentTransitions from '../checklist-recent-transitions';

import ChecklistsYear from '../checklist-yearly';
import EcommerceSalesOverview from '../checklist-percent-overview';


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

  const [dataTotalKhoiCV, setDataTotalKhoiCV] = useState<SeriesData[]>([]);
  const [dataTotalKhuvuc, setDataTotalKhuvuc] = useState<SeriesData[]>([]);
  const [dataTotalHangmuc, setDataTotalHangmuc] = useState<SeriesData[]>([]);
  const [dataTotalErrorWeek, setDataTotalErrorWeek] = useState<any>([]);
  const [dataChecklistsError, setDataChecklistsError] = useState<any>([]);
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
    const handleTotalKhoiCV = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/ent_checklist/total', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalKhoiCV(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/ent_khuvuc/total', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalKhuvuc(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/tb_checklistc/list-checklist-error-project', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalErrorWeek(res.data.data[0].errorDetails);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/tb_checklistc/list-checklist', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataChecklistsError(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalHangmuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/ent_hangmuc/total', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalHangmuc(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalHangmuc();
  }, [accessToken]);

  useEffect(() => {
    const handlePercent = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/tb_checklistc/percent', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataPercent(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handlePercent();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/be/api/tb_checklistc/year?year=${selectedYear}&khoi=${selectedKhoiCV}`,
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
  }, [accessToken, selectedYear, selectedKhoiCV]);

  useEffect(() => {
    const totalValue = dataTotalKhoiCV.reduce(
      (accumulator, currentObject) => accumulator + currentObject.value,
      0
    );
    setTotalKhoiCV(totalValue);
  }, [dataTotalKhoiCV]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, {user?.ent_duan?.Duan}
      </Typography>
      <Grid container spacing={3}>

      <Grid xs={12} md={12} lg={12}>
        { dataTotalErrorWeek && 
          <BankingRecentTransitions
          title="Sự cố ngày hôm trước"
          tableData={dataTotalErrorWeek}
          tableLabels={[
            { id: 'checklistName', label: 'Tên checklist' },
            { id: 'Ngay', label: 'Ngày' },
            { id: 'calv', label: 'Ca làm việc' },
            { id: 'note', label: 'Ghi chú' },
            { id: 'Giamsat', label: 'Giám sát' },
            { id: 'image', label: 'Ảnh' },
            { id: '' },
          ]}
        />
        }
        </Grid>

        <Grid xs={12} md={12} lg={12}>
        { dataTotalErrorWeek && 
          <ChecklistRecentTransitions
          title="Các checklist lỗi"
          tableData={dataChecklistsError}
          tableLabels={[
            { id: 'checklistName', label: 'Tên checklist' },
            { label: 'Giá trị định danh', id: 'Giatridinhdanh' },
            { label: 'Giá trị nhận', id: 'Giatrinhan' },
            { label: 'Tầng', id: 'Tentang' },
            { label: 'Số thứ tự', id: 'Sothutu' },
            { label: 'Mã số', id: 'Maso' },
            { label: 'Hạng mục', id: 'Hangmuc' },
          ]}
        />
        }
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

        <Grid xs={12} md={8} lg={8}>
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

        <Grid xs={12} md={4} lg={4}>
          <EcommerceSalesOverview title="Tỉ lệ checklist" data={dataPercent} />
        </Grid>

        {/* <Grid xs={12} md={6} lg={6}>
          <EcommerceSalesOverview title="Hạng mục lỗi" data={_ecommerceSalesOverview} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
