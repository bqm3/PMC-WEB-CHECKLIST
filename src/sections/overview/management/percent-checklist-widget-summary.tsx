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
}

export default function EcommerceWidgetSummary({
  title,
  total,

  sx,
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2.5, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>

        {`${total}` === `` ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h3" gutterBottom>
              {total}%
            </Typography>
          </>
        )}
      </Box>
    </Card>
  );
}
