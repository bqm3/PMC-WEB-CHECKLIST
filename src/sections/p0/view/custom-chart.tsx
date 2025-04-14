import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chart, { useChart } from 'src/components/chart';
import { useResponsive } from 'src/hooks/use-responsive';
import { ApexOptions } from 'apexcharts';

// ----------------------------------------------------------------------

interface ProjectDataItem {
  label: string;
  value: string;
  completed?: number;
  total?: number;
  percentage?: number;
}

interface ChartConfig {
  colors?: string[];
  series: ProjectDataItem[];
  options?: ApexOptions;
}

interface CustomProjectChartProps extends CardProps {
  title?: string;
  isLoading?: boolean;
  subheader?: string;
  chart: ChartConfig;
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
      percentage: total > 0 ? (completed / total) * 100 : 0
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
    colors: chart.colors,
    labels: chartLabels,
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
      y: {
        formatter: (value: number, { seriesIndex }: { seriesIndex: number }) => {
          const item = parsedData[seriesIndex];
          return `${item.completed}/${value} (${item.percentage?.toFixed(1)}%)`;
        }
      }
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
            height: { sm: 160 },
            flexWrap: { sm: 'wrap' },
            width: { xs: 240, sm: '50%' },
          },
          '& .apexcharts-datalabels-group': {
            display: 'none',
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
            type="polarArea"
            series={chartSeries}
            options={chartOptions}
            height={smUp ? 360 : 500}
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

        {/* <Grid item xs={6}>
          <Stack sx={{ py: 2, borderRight: `dashed 1px ${theme.palette.divider}`, borderTop: `dashed 1px ${theme.palette.divider}` }}>
            <Box component="span" sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>
              Số lượng dự án nhập 
            </Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              completedProjects
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack sx={{ py: 2, borderTop: `dashed 1px ${theme.palette.divider}` }}>
            <Box component="span" sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>
              Tỷ lệ
            </Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              `${completionRate.toFixed(1)}%`
            )}
          </Stack>
        </Grid> */}
      </Grid>
    </Card>
  );
}