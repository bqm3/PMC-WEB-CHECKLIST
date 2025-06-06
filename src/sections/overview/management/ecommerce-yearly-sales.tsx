import { ApexOptions } from 'apexcharts';
import { useState, useCallback } from 'react';
// @mui
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart:
    | {
        categories?: string[];
        colors?: string[];
        series: {
          year: string;
          data: {
            name: string;
            data: number[];
          }[];
        }[];
        options?: ApexOptions;
      }
    | any;
}

export default function EcommerceYearlySales({ title, subheader, chart, ...other }: Props) {
  const { colors, categories, series, options } = chart;
  const { user } = useAuthContext();
  const popover = usePopover();

  const [seriesData, setSeriesData] = useState('Tất cả');

  const filteredSeries = series?.map((item: any) => ({
    ...item,
    data: item.data.filter((dataItem: any) =>
      user?.ID_Chucvu === 11 ? dataItem.name === user?.ent_khoicv?.KhoiCV : true
    ),
  }));

  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories,
    },
    yaxis: {
      min: 0,
      max: 100,
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          // action={
          //   <ButtonBase
          //     onClick={popover.onOpen}
          //     sx={{
          //       pl: 1,
          //       py: 0.5,
          //       pr: 0.5,
          //       borderRadius: 1,
          //       typography: 'subtitle2',
          //       bgcolor: 'background.neutral',
          //     }}
          //   >
          //     {seriesData}

          //     <Iconify
          //       width={16}
          //       icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          //       sx={{ ml: 0.5 }}
          //     />
          //   </ButtonBase>
          // }
        />
        {/* {series?.map((item: any) => (
          <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
            {item.year === seriesData && (
              <Chart dir="ltr" type="area" series={item.data} options={chartOptions} height={364} />
            )}
          </Box>
        ))} */}

        {filteredSeries?.map((item: any) => (
          <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
            {item.year === seriesData && (
              <Chart dir="ltr" type="area" series={item.data} options={chartOptions} height={364} />
            )}
          </Box>
        ))}
      </Card>

      {/* <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series?.map((option: any) => (
          <MenuItem
            key={option.year}
            selected={option.year === seriesData}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover> */}
    </>
  );
}
