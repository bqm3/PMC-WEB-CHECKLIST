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

import BankingBalanceStatistics from '../../banking/banking-balance-statistics';

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
  const theme = useTheme();
  const settings = useSettingsContext();

  const [dataTotalUser, setDataTotalUser] = useState<widgetData>();
  const [dataTotalHeader, setDataTotalHeader] = useState<widgetData>();
  const [dataTotalYear, setDataTotalYear] = useState<widgetData>();
  const [dataTotalService, setDataTotalService] = useState<widgetData>();
  const [dataTotalReview, setDataTotalReview] = useState<widgetData>();
  const [dataTotal, setDataTotal] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const resTotal = async () => {
      try {
        const res = await axios.post(
          'https://be-nodejs-project.vercel.app/api/orders/widget-order-total'
        );
        if (res.status === 200) {
          const yearData: { [key: number]: Array<{ total: number; service_charge: number }> } = {};

          // Loop through rawData and populate yearData
          res.data.forEach((item: any) => {
            const { year, month, total, service_charge } = item;
            if (!yearData[year]) {
              yearData[year] = Array(12).fill({ total: 0, service_charge: 0 });
            }

            const index = month - 1; // Month index starts from 0

            if (yearData[year][index]) {
              yearData[year][index] = {
                total: yearData[year][index].total + total,
                service_charge: yearData[year][index].service_charge + service_charge,
              };
            }
          });

          // Convert yearData to the desired format
          const serieswd = Object.entries(yearData).map(([year, data]) => ({
            type: `${year}`,
            data: [
              {
                name: 'Total Booking',
                data: data.map((monthData) => monthData.total),
              },
              {
                name: 'Total Service',
                data: data.map((monthData) => monthData.service_charge),
              },
            ],
          }));
          setDataTotal(serieswd);
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
          console.log('success', res.data);
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

  // const rawData = [
  //   { year: 2022, month: 1, total: 100, service_charge: 20 },
  //   { year: 2022, month: 2, total: 150, service_charge: 30 },
  //   // ...
  //   { year: 2023, month: 1, total: 120, service_charge: 25 },
  //   { year: 2023, month: 2, total: 180, service_charge: 35 },
  //   // ...
  // ];

  // const serieswd: any = [];

  // // const uniqueYears = [...new Set(rawData.map((item) => item.year))];
  // const uniqueYears = Array.from(new Set(rawData.map((item) => item.year)));


  // uniqueYears.forEach((year) => {
  //   const yearData = rawData.filter((item) => item.year === year);

  //   const totalBookingData = Array.from({ length: 12 }, () => 0);
  //   const totalServiceData = Array.from({ length: 12 }, () => 0);

  //   yearData.forEach((item) => {
  //     const index = item.month - 1;
  //     totalBookingData[index] = item.total;
  //     totalServiceData[index] = item.service_charge;
  //   });

  //   serieswd.push({
  //     type: `${year}`,
  //     data: [
  //       {
  //         name: 'Total Booking',
  //         data: totalBookingData,
  //       },
  //       {
  //         name: 'Total Service',
  //         data: totalServiceData,
  //       },
  //     ],
  //   });
  // });



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
            total={dataTotalHeader?.total_orders_this_week ? dataTotalHeader?.total_orders_this_week : 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Users"
            total={dataTotalHeader?.total_users ? dataTotalHeader?.total_users : 0}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Item Orders"
            total={dataTotalHeader?.total_orders ? dataTotalHeader?.total_orders : 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Draf Orders"
            total={dataTotalHeader?.total_orders_status_4 ? dataTotalHeader?.total_orders_status_4 : 0}
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
                  { label: 'Double Bed', value: Number(dataTotalService?.series['Double Bed'] ? dataTotalService?.series['Double Bed'] : 0) },
                  { label: 'Single Bed', value: Number(dataTotalService?.series['Single Bed'] ? dataTotalService?.series['Single Bed'] : 0) },
                  { label: "Children's Beds", value: Number(dataTotalService?.series["Children's Beds"] ? dataTotalService?.series["Children's Beds"] : 0) },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <AnalyticsConversionRates
            title="Conversion Rates"
            subheader=""
            chart={{
              series: [
                { label: '1 to 2', value: dataTotalReview?.result[0]?.value ? dataTotalReview?.result[0]?.value : 0 },
                { label: '2 to 3', value: dataTotalReview?.result[1]?.value ? dataTotalReview?.result[1]?.value : 0 },
                { label: '3 to 4', value: dataTotalReview?.result[2]?.value ? dataTotalReview?.result[2]?.value : 0 },
                { label: '4 to 5', value: dataTotalReview?.result[3]?.value ? dataTotalReview?.result[3]?.value : 0 },

              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={12}>
          <Stack spacing={3}>
            <BankingBalanceStatistics
              title="Total Payment Booking"
              chart={{
                categories:
                  ['Jan',
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
                    'Dec',],
                series: dataTotal || [],
              }}
            />


          </Stack>
        </Grid>


      </Grid>
    </Container>
  );
}
