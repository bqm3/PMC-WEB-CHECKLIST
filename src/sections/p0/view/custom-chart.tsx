import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';
import Chart, { useChart } from 'src/components/chart';

interface CustomProjectChartProps {
  title: string;
  isLoading?: boolean;
  subheader?: string;
  chart: {
    series: { label: string; value: string }[];
    colors?: string[];
    options?: any;
  };
  [key: string]: any;
}

export default function CustomProjectChart({
  title,
  isLoading = false,
  subheader,
  chart,
  ...other
}: CustomProjectChartProps) {
  const theme = useTheme();
  const smUp = useResponsive('up', 'sm');

  // Parse the data and extract values
  const parsedData = chart.series.map(item => {
    const [completed, total] = item.value.split('/').map(Number);
    return {
      ...item,
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  });

  // Calculate statistics
  const totalLocations = parsedData.length;
  const totalProjects = parsedData.reduce((sum, item) => sum + (item.total || 0), 0);
  const completedProjects = parsedData.reduce((sum, item) => sum + (item.completed || 0), 0);
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

  // Prepare chart data
  const chartSeries = parsedData.map(item => item.total || 0);
  const chartLabels = parsedData.map(item => item.label);

  const chartOptions = useChart({
    chart: {
      type: 'pie',
    },
    labels: chartLabels,
    colors: chart.colors,
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      position: 'right',
      itemMargin: {
        horizontal: 2,
        vertical: 1,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: number, { seriesIndex }: { seriesIndex: number }) => {
          const item = parsedData[seriesIndex];
          return `${item.completed}/${value} (${item.percentage?.toFixed(1)}%)`;
        },
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          legend: {
            position: 'bottom',
            horizontalAlign: 'left',
          },
        },
      },
    ],
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          my: 5,
          '& .apexcharts-legend': {
            m: 'auto',
            flexWrap: { sm: 'wrap' },
            width: { xs: 240, sm: '50%' },
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Chart
            dir="ltr"
            type="pie"
            series={chartSeries}
            options={chartOptions}
            height={smUp ? 380 : 540}
          />
        )}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Grid container sx={{ textAlign: 'center', typography: 'h4' }}>
        <Grid item xs={6}>
          <Stack sx={{ py: 2, borderRight: `dashed 1px ${theme.palette.divider}` }}>
            <Box component="span" sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>
              Chi nhánh
            </Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              totalLocations
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack sx={{ py: 2 }}>
            <Box component="span" sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>
              Dự án
            </Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              totalProjects
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
