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

  const [dataTotalHeader, setDataTotalHeader] = useState<widgetData>();
  const [dataTotalYear, setDataTotalYear] = useState<any>();
  const [dataTotalService, setDataTotalService] = useState<widgetData>();
  const [dataTotalReview, setDataTotalReview] = useState<widgetData>();
  const [dataTotal, setDataTotal] = useState<any>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [isLoading4, setIsLoading4] = useState(false);
  const [isLoading5, setIsLoading5] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading1(true);
      setIsLoading2(true);
      setIsLoading3(true);
      setIsLoading4(true);
      // setIsLoading5(true);

      try {
        const [totalRes, headerRes, serviceRes, reviewRes] = await Promise.all([
          axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-total'),
          axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-header'),
          axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-service'),
          axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-review'),
          // axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-year'),
        ]);

        if (totalRes.status === 200) {
          const yearData: { [key: number]: Array<{ total: number; service_charge: number }> } = {};

          // Loop through rawData and populate yearData
          totalRes.data.forEach((item: any) => {
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
          setIsLoading1(false);
        }

        if (headerRes.status === 200) {
          setDataTotalHeader(headerRes.data[0].order_stats);
          setIsLoading2(false);
        }

        if (serviceRes.status === 200) {
          setDataTotalService(serviceRes.data);
          setIsLoading3(false);
        }

        if (reviewRes.status === 200) {
          setDataTotalReview(reviewRes.data);
          setIsLoading4(false);
        }

        // console.log('yearRes', yearRes.status, yearRes.data);

        // if (yearRes.status === 200) {
        //   setDataTotalYear(yearRes.data[0]);
        //   setIsLoading5(false);
        // }
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading1(false);
        setIsLoading2(false);
        setIsLoading3(false);
        setIsLoading4(false);
        // setIsLoading5(false);
      }
    };

    fetchData();
  }, []);


  // useEffect(() => {
  //   setIsLoading1(true)
  //   const resTotal = async () => {
  //     try {
  //       const res = await axios.post(
  //         'https://be-nodejs-project.vercel.app/api/orders/widget-order-total'
  //       );
  //       if (res.status === 200) {
  //         const yearData: { [key: number]: Array<{ total: number; service_charge: number }> } = {};

  //         // Loop through rawData and populate yearData
  //         res.data.forEach((item: any) => {
  //           const { year, month, total, service_charge } = item;
  //           if (!yearData[year]) {
  //             yearData[year] = Array(12).fill({ total: 0, service_charge: 0 });
  //           }

  //           const index = month - 1; // Month index starts from 0

  //           if (yearData[year][index]) {
  //             yearData[year][index] = {
  //               total: yearData[year][index].total + total,
  //               service_charge: yearData[year][index].service_charge + service_charge,
  //             };
  //           }
  //         });

  //         // Convert yearData to the desired format
  //         const serieswd = Object.entries(yearData).map(([year, data]) => ({
  //           type: `${year}`,
  //           data: [
  //             {
  //               name: 'Total Booking',
  //               data: data.map((monthData) => monthData.total),
  //             },
  //             {
  //               name: 'Total Service',
  //               data: data.map((monthData) => monthData.service_charge),
  //             },
  //           ],
  //         }));
  //         setDataTotal(serieswd);
  //         setIsLoading1(false)
  //       }
  //     } catch (err) {
  //       console.log('error', err);
  //       setIsLoading1(false)
  //     }
  //   };
  //   resTotal();
  // }, []);

  // useEffect(() => {
  //   setIsLoading2(true)
  //   const resTotal = async () => {
  //     try {
  //       const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-header');
  //       if (res.status === 200) {
  //         console.log('success', res.data);
  //         setDataTotalHeader(res.data[0].order_stats);
  //         setIsLoading2(false)
  //       }
  //     } catch (err) {
  //       console.log('error', err);
  //       setIsLoading2(false)
  //     }
  //   };
  //   resTotal();
  // }, []);

  // useEffect(() => {
  //   setIsLoading3(true)
  //   const resTotal = async () => {
  //     try {
  //       const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-service');
  //       if (res.status === 200) {
  //         setDataTotalService(res.data);
  //         setIsLoading3(false)
  //       }
  //     } catch (err) {
  //       console.log('error', err);
  //       setIsLoading3(false)
  //     }
  //   };
  //   resTotal();
  // }, []);

  // useEffect(() => {
  //   setIsLoading4(true);
  //   const resTotal = async () => {
  //     try {
  //       const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-review');
  //       if (res.status === 200) {
  //         setDataTotalReview(res.data);
  //         setIsLoading4(false);
  //       }
  //     } catch (err) {
  //       console.log('error', err);
  //       setIsLoading4(false);
  //     }
  //   };
  //   resTotal();
  // }, []);

  useEffect(() => {
    const resTotal = async () => {
      setIsLoading5(true);
      try {
        const res = await axios.post('https://be-nodejs-project.vercel.app/api/orders/widget-order-year');
        console.log('res', res)
        if (res.status === 200) {
          setDataTotalYear(res.data[0]);
          setIsLoading5(false);
        }
      } catch (err) {
        console.log('error', err);
        setIsLoading5(false);
      }
    };
    resTotal();
  }, []);

  console.log('data', dataTotalYear)

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
        {isLoading2 === false && dataTotalHeader && (
          <>
            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="Rooms"
                total={
                  dataTotalHeader?.total_orders_this_week
                    ? dataTotalHeader?.total_orders_this_week
                    : 0
                }
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
                total={
                  dataTotalHeader?.total_orders_status_4
                    ? dataTotalHeader?.total_orders_status_4
                    : 0
                }
                color="error"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
              />
            </Grid>
          </>
        )}

        <Grid xs={12} md={6} lg={8}>
          {dataTotalYear && isLoading5 === false && (
            <EcommerceYearlySales
              title="Yearly"
              subheader="Number of booking invoices"
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
                        data: dataTotalYear
                          ? dataTotalYear?.chart['2022']
                          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      },
                    ],
                  },
                  {
                    year: '2023',
                    data: [
                      {
                        name: 'Total Orders',
                        data: dataTotalYear
                          ? dataTotalYear?.chart['2023']
                          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      },
                    ],
                  },
                  {
                    year: '2024',
                    data: [
                      {
                        name: 'Total Orders',
                        data: dataTotalYear
                          ? dataTotalYear.chart['2024']
                          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      },
                    ],
                  },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          {dataTotalService && isLoading3 === false && (
            <AnalyticsCurrentVisits
              title="Current Services"
              chart={{
                series: [
                  {
                    label: 'Double Bed',
                    value: Number(
                      dataTotalService?.series && dataTotalService.series['Double Bed']
                        ? dataTotalService.series['Double Bed']
                        : 0
                    ),
                  },
                  {
                    label: 'Single Bed',
                    value: Number(
                      dataTotalService?.series && dataTotalService.series['Single Bed']
                        ? dataTotalService.series['Single Bed']
                        : 0
                    ),
                  },
                  {
                    label: "Children's Beds",
                    value: Number(
                      dataTotalService?.series && dataTotalService.series["Children's Beds"]
                        ? dataTotalService.series["Children's Beds"]
                        : 0
                    ),
                  },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          {dataTotalReview && isLoading4 === false && (
            <AnalyticsConversionRates
              title="Conversion Rates"
              subheader=""
              chart={{
                series: [
                  { label: '1 to 2', value: dataTotalReview?.result[0]?.value || 0.1 },
                  { label: '2 to 3', value: dataTotalReview?.result[1]?.value || 0.1 },
                  { label: '3 to 4', value: dataTotalReview?.result[2]?.value || 0.1 },
                  { label: '4 to 5', value: dataTotalReview?.result[3]?.value || 0.1 },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={12}>
          {isLoading1 === false && dataTotal && (
            <Stack spacing={3}>
              <BankingBalanceStatistics
                title="Total Payment Booking"
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
                  series: dataTotal || [],
                }}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
