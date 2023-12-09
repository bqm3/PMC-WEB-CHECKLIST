import { useEffect, useState } from 'react';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// api
import axios from 'axios';
//
import AnalyticsNews from '../analytics-news';
import AnalyticsTasks from '../analytics-tasks';
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';

import EcommerceYearlySales from '../../e-commerce/ecommerce-yearly-sales';

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

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();

  const [dataTotalUser, setDataTotalUser] = useState<widgetData>();
  const [dataTotalHeader, setDataTotalHeader] = useState<widgetData>();
  const [dataTotalYear, setDataTotalYear] = useState<widgetData>();
  const [dataTotalService, setDataTotalService] = useState<widgetData>();
  const [dataTotalReview, setDataTotalReview] = useState<widgetData>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const resTotal = async () => {
      try {
        const res = await axios.post(
          'https://be-nodejs-project.vercel.app/api/orders/widget-order'
        );
        if (res.status === 200) {
          setDataTotalUser(res.data);
        }
      } catch (err) {
        console.log('error', err);
      }
    };
    resTotal();
  }, []);

  useEffect(() => {
    const resTotal = async () => {
      try {
        const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-header');
        if (res.status === 200) {
          setDataTotalHeader(res.data[0].order_stats);
        }
      } catch (err) {
        console.log('error', err);
      }
    };
    resTotal();
  }, []);

  useEffect(() => {
    const resTotal = async () => {
      try {
        const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-service');
        if (res.status === 200) {
          setDataTotalService(res.data);
        }
      } catch (err) {
        console.log('error', err);
      }
    };
    resTotal();
  }, []);

  useEffect(() => {
    const resTotal = async () => {
      try {
        const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-review');
        if (res.status === 200) {
          setDataTotalReview(res.data);
        }
      } catch (err) {
        console.log('error', err);
      }
    };
    resTotal();
  }, []);

  useEffect(() => {
    const resTotal = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-year');
        if (res.status === 200) {
          setDataTotalYear(res.data[0]);
          setIsLoading(false);
        }
      } catch (err) {
        console.log('error', err);
        setIsLoading(false);
      }
    };
    resTotal();
  }, []);

  console.log('dataTotalUser', dataTotalReview?.result[0]?.value);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Rooms"
            total={dataTotalHeader?.total_orders_this_week}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Users"
            total={dataTotalHeader?.total_users}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Item Orders"
            total={dataTotalHeader?.total_orders}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Draf Orders"
            total={dataTotalHeader?.total_orders_status_4}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          {dataTotalYear && isLoading === false && (
            <EcommerceYearlySales
              title="Yearly"
              subheader=""
              chart={{
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
                    year: '2022',
                    data: [
                      {
                        name: 'Total Orders',
                        data: dataTotalYear?.chart?.series[0]?.data ? dataTotalYear?.chart?.series[0]?.data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      },

                    ],
                  },
                  {
                    year: '2023',
                    data: [
                      {
                        name: 'Total Orders',
                        data: dataTotalYear?.chart?.series[1]?.data ? dataTotalYear?.chart?.series[1]?.data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      },

                    ],
                  },
                ],
              }}
            />
          )}
        </Grid>


        <Grid xs={12} md={6} lg={4}>
          {dataTotalService && (
            <AnalyticsCurrentVisits
              title="Current Services"
              chart={{
                series: [
                  { label: 'Double Bed', value: Number(dataTotalService?.series['Double Bed']) },
                  { label: 'Single Bed', value: Number(dataTotalService?.series['Single Bed']) },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion Rates"
            subheader=""
            chart={{
              series: [
                { label: '1 to 2', value: dataTotalReview?.result[0]?.value ? dataTotalReview?.result[0]?.value : 0 },
                { label: '2 to 3', value: dataTotalReview?.result[1]?.value ? dataTotalReview?.result[1]?.value : 0 },
                { label: '3 to 4', value: dataTotalReview?.result[2]?.value ? dataTotalReview?.result[2]?.value : 0 },
                { label: '4 to 5', value: dataTotalReview?.result[3]?.value ? dataTotalReview?.result[3]?.value : 0 },
                // { label: 'China', value: 448 },
                // { label: 'Canada', value: 470 },
                // { label: 'France', value: 540 },
                // { label: 'Germany', value: 580 },
                // { label: 'South Korea', value: 690 },
                // { label: 'Netherlands', value: 1100 },
                // { label: 'United States', value: 1200 },
                // { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}


      </Grid>
    </Container>
  );
}
