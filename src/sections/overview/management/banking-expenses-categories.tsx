import { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  isLoading?: boolean;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ApexOptions;
  };
}

export default function BankingExpensesCategories({ title, isLoading, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors,
    labels: series.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    fill: {
      opacity: 0.8,
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
    ...options,
  });
  // Tính tổng số địa điểm
  const totalCategories = series.length;

  // Tính tổng số dự án
  const totalProjects = series.reduce((sum, current) => sum + current.value, 0);
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          my: 5,
          '& .apexcharts-legend': {
            m: 'auto',
            height: { sm: 160 },
            flexWrap: { sm: 'wrap' },
            width: { xs: 240, sm: '50%' },
          },
          '& .apexcharts-datalabels-group': {
            display: 'none',
          },
        }}
      >
        {/* Show loading spinner if data is still loading */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Chart
            dir="ltr"
            type="polarArea"
            series={chartSeries}
            options={chartOptions}
            height={smUp ? 360 : 500}
          />
        )}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        sx={{ textAlign: 'center', typography: 'h4' }}
      >
        <Stack sx={{ py: 2, borderRight: `dashed 1px ${theme.palette.divider}` }}>
          <Box component="span" sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>
            Chi nhánh
          </Box>
          {/* Show loading spinner for totalCategories */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            totalCategories
          )}
        </Stack>

        <Stack sx={{ py: 2 }}>
          <Box component="span" sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>
            Dự án
          </Box>
          {/* Show loading spinner for totalProjects */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            totalProjects
          )}
        </Stack>
      </Box>
    </Card>
  );
}
