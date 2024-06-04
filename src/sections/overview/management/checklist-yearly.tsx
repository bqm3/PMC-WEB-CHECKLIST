import { ApexOptions } from 'apexcharts';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      type: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
  selectedYear: string;
  selectedKhoiCV: string;
  onYearChange: (year: string) => void;
  onKhoiChange: (khoi: string) => void;
  STATUS_OPTIONS: any;
}

export default function ChecklistYearStatistics({
  title,
  subheader,
  chart,
  selectedYear,
  selectedKhoiCV,
  onYearChange,
  onKhoiChange,
  STATUS_OPTIONS,
  ...other
}: Props) {
  const { categories, colors, series, options } = chart;

  // Manage state for the year popover
  const yearPopover = usePopover();

  // Manage state for the KhoiCV popover
  const khoiPopover = usePopover();

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}`,
      },
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      yearPopover.onClose(); // Close the year popover
      onYearChange(newValue);
    },
    [onYearChange, yearPopover]
  );

  const handleChangeKhoi = useCallback(
    (newValue: string) => {
      khoiPopover.onClose(); // Close the KhoiCV popover
      onKhoiChange(newValue);
    },
    [khoiPopover, onKhoiChange]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <Box sx={{ gap: 2, display: 'flex' }}>
              <ButtonBase
                onClick={yearPopover.onOpen} // Open the year popover
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {selectedYear}
                <Iconify
                  width={16}
                  icon={yearPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
              <ButtonBase
                onClick={khoiPopover.onOpen} // Open the KhoiCV popover
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {STATUS_OPTIONS.find((option: any) => option.value === selectedKhoiCV)?.label}
                <Iconify
                  width={16}
                  icon={khoiPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
            </Box>
          }
        />

        {series.map((item) => (
          <Box key={item.type} sx={{ mt: 3, mx: 3 }}>
            {item.type === selectedYear && (
              <Chart dir="ltr" type="bar" series={item.data} options={chartOptions} height={364} />
            )}
          </Box>
        ))}
      </Card>

      <CustomPopover open={yearPopover.open} onClose={yearPopover.onClose} sx={{ width: 140 }}>
        <MenuItem selected={selectedYear === '2024'} onClick={() => handleChangeSeries('2024')}>
          2024
        </MenuItem>
        <MenuItem selected={selectedYear === '2025'} onClick={() => handleChangeSeries('2025')}>
          2025
        </MenuItem>
      </CustomPopover>

      <CustomPopover open={khoiPopover.open} onClose={khoiPopover.onClose} sx={{ width: 140 }}>
        {STATUS_OPTIONS?.map((item: any) => (
          <MenuItem selected={item.value === selectedKhoiCV}  onClick={() => handleChangeKhoi(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}


