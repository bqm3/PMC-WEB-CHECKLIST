import { ApexOptions } from 'apexcharts';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// utils
import { fNumber, fPercent } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import { CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: string;
  key: string;
  percent: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
  compare: string;
}

export default function EcommerceWidgetSummary({
  title,
  percent,
  total,
  key,
  chart,
  sx,
  compare,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors: [colors[1]],
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0] },
          { offset: 100, color: colors[1] },
        ],
      },
    },
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: {
        show: false,
      },
    },
    ...options,
  });

  const renderTrending = (
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Iconify
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: percent < 0 ? 'error.main' : 'success.main',
          bgcolor: alpha(percent < 0 ? theme.palette.error.main : theme.palette.success.main, 0.16),
        }}
      />

      <Typography variant="subtitle2" component="div" noWrap>
        {fPercent(percent)}
        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {/* {' so với tuần trước'} */}
          {compare}
        </Box>
      </Typography>
    </Stack>
  );

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {`${percent}` === `NaN` || `${total}` === `undefined%` || `${total}` === `undefined` || `${total}` === `null` || `${total}` === `` ? (
          <CircularProgress />
        ) : (
          <>
            {' '}
            <Typography variant="h4" gutterBottom>
              {' '}
              {total}{' '}
            </Typography>{' '}
            {renderTrending}{' '}
          </>
        )}
      </Box>

      <Chart
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        width={80}
        height={50}
      />
    </Card>
  );
}
