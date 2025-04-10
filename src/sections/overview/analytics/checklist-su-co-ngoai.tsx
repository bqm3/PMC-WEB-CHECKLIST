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
  selectedTangGiam: string;
  onYearChange: (year: string) => void;
  onKhoiChange: (khoi: string) => void;
  onTangGiamChange: (tg: string) => void;
  STATUS_OPTIONS: any;
  tangGiam: any;
}

export default function ChecklistYearStatistics({
  title,
  subheader,
  chart,
  selectedYear,
  selectedKhoiCV,
  selectedTangGiam,
  onYearChange,
  onKhoiChange,
  onTangGiamChange,
  STATUS_OPTIONS,
  tangGiam,
  ...other
}: Props) {
  const { categories, series, options, } = chart;

  const yearPopover = usePopover();
  const khoiPopover = usePopover();
  const tangGiamPopover = usePopover();

  // Map lại đúng thứ tự: Đã xử lý (xanh), Đang xử lý (vàng), Chưa xử lý (đỏ)
  const orderedSeries = [
    series[0]?.data.find((s) => s.name === 'Đã xử lý'),
    series[0]?.data.find((s) => s.name === 'Đang xử lý'),
    series[0]?.data.find((s) => s.name === 'Chưa xử lý'),
  ].filter(Boolean) as ApexAxisChartSeries; // ép kiểu chắc chắn


  const chartOptions = useChart({
    colors: ['#00a76f', '#f1c232', '#FF0000'], // Green, Yellow, Red
    stroke: {
      show: true,
      width: 0,
      colors: ['#00a76f', '#f1c232', '#FF0000'],
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
      formatter: (val: any) => `${val?.toFixed(0)}`,
    },
    yaxis: {
      title: {
        text: 'Số lượng sự cố',
      },
      labels: {
        formatter: (val) => `${Math.round(val)}`,
      },
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4,
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

  const handleChangeTangGiam = useCallback(
    (newValue: string) => {
      tangGiamPopover.onClose(); // Close the KhoiCV popover
      onTangGiamChange(newValue);
    },
    [tangGiamPopover, onTangGiamChange]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <Box sx={{ gap: 1, display: 'flex' }}>
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
                  icon={
                    yearPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
            </Box>
          }
        />

        {series.map((item) => (
          <Box key={item.type} sx={{ mt: 3, mx: 3 }}>
            {item.type === selectedYear && (
              <Chart dir="ltr" type="bar" series={orderedSeries} options={chartOptions} height={364} />
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
    </>
  );
}
