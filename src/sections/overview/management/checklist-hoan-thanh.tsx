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
  selectedMonth: string;
  selectedNhom: string;
  selectedTangGiam: string;
  selectedTop: string;
  onYearChange: (year: string) => void;
  onKhoiChange: (khoi: string) => void;
  onMonthChange: (month: string) => void;
  onNhomChange: (nhom: string) => void;
  onTangGiamChange: (tanggiam: string) => void;
  onTopChange: (top: string) => void;
  STATUS_OPTIONS: any;
  months: any;
  nhoms: any;
  tangGiam: any;
  top: any;
  setShowMax: any;
  showMax: any;
}

const SHOWS = [
  { value: '6', label: '50%' },
  { value: '12', label: '100%' },
];

export default function ChecklistsHoanThanh({
  title,
  subheader,
  chart,
  selectedYear,
  selectedKhoiCV,
  selectedMonth,
  onYearChange,
  onKhoiChange,
  onMonthChange,
  onTangGiamChange,
  STATUS_OPTIONS,
  months,
  nhoms,
  selectedNhom,
  onNhomChange,
  tangGiam,
  selectedTangGiam,
  top,
  selectedTop,
  onTopChange,
  setShowMax,
  showMax,
  ...other
}: Props) {
  const { categories, colors, series, options } = chart;

  // Manage state for the year popover
  const yearPopover = usePopover();
  const khoiPopover = usePopover();
  const monthPopover = usePopover();
  const nhomPopover = usePopover();
  const tangGiamPopover = usePopover();
  const topPopover = usePopover();
  const showPopover = usePopover();

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    yaxis: {
      max: 100, // Thiết lập giới hạn tối đa cho trục y là 100
      title: {
        text: 'Tỉ lệ hoàn thành (%)',
      },
      labels: {
        formatter: (val) => `${Math.round(val)}%`,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
        fontSize: '12',
      },
      formatter: (val: any) => `${val?.toFixed(0)}`,
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: 0,
              to: 50,
              color: '#e69138',
            },
          ],
        },
        columnWidth: '20%', // Adjust this value to increase/decrease spacing
        borderRadius: 4, // Optional: make bars rounded,
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

  const handleChangeMonth = useCallback(
    (newValue: string) => {
      monthPopover.onClose(); // Close the KhoiCV popover
      onMonthChange(newValue);
    },
    [monthPopover, onMonthChange]
  );

  const handleChangeNhom = useCallback(
    (newValue: string) => {
      nhomPopover.onClose(); // Close the KhoiCV popover
      onNhomChange(newValue);
    },
    [nhomPopover, onNhomChange]
  );

  const handleChangeTangGiam = useCallback(
    (newValue: string) => {
      tangGiamPopover.onClose(); // Close the KhoiCV popover
      onTangGiamChange(newValue);
    },
    [tangGiamPopover, onTangGiamChange]
  );

  const handleChangeTop = useCallback(
    (newValue: string) => {
      topPopover.onClose(); // Close the KhoiCV popover
      onTopChange(newValue);
    },
    [topPopover, onTopChange]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <Box sx={{ gap: 1, display: 'flex', flexGrow: 1, flexWrap: 'wrap' }}>
              <ButtonBase
                onClick={topPopover.onOpen} // Open the KhoiCV popover
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {top.find((option: any) => option.value === selectedTop)?.label}
                <Iconify
                  width={16}
                  icon={
                    topPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
              <ButtonBase
                onClick={nhomPopover.onOpen} // Open the KhoiCV popover
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {nhoms.find((option: any) => option.value === selectedNhom)?.label}
                <Iconify
                  width={16}
                  icon={
                    nhomPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
              <ButtonBase
                onClick={tangGiamPopover.onOpen} // Open the KhoiCV popover
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {tangGiam.find((option: any) => option.value === selectedTangGiam)?.label}
                <Iconify
                  width={16}
                  icon={
                    tangGiamPopover.open
                      ? 'eva:arrow-ios-upward-fill'
                      : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
              {/* <ButtonBase
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

              <ButtonBase
                onClick={monthPopover.onOpen} // Open the KhoiCV popover
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {months.find((option: any) => option.value === selectedMonth)?.label}
                <Iconify
                  width={16}
                  icon={
                    monthPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase> */}

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
                  icon={
                    khoiPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
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
              <Chart dir="ltr" type="bar" series={item.data} options={chartOptions} height={364} />
            )}
          </Box>
        ))}
      </Card>
      <CustomPopover open={topPopover.open} onClose={topPopover.onClose}>
        {top?.map((item: any) => (
          <MenuItem
            selected={item.value === selectedTop}
            onClick={() => handleChangeTop(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>
      <CustomPopover open={nhomPopover.open} onClose={nhomPopover.onClose}>
        {nhoms?.map((item: any) => (
          <MenuItem
            selected={item.value === selectedNhom}
            onClick={() => handleChangeNhom(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>
      <CustomPopover open={tangGiamPopover.open} onClose={tangGiamPopover.onClose}>
        {tangGiam?.map((item: any) => (
          <MenuItem
            selected={item.value === tangGiamPopover}
            onClick={() => handleChangeTangGiam(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>
      <CustomPopover open={yearPopover.open} onClose={yearPopover.onClose}>
        <MenuItem selected={selectedYear === '2024'} onClick={() => handleChangeSeries('2024')}>
          2024
        </MenuItem>
        <MenuItem selected={selectedYear === '2025'} onClick={() => handleChangeSeries('2025')}>
          2025
        </MenuItem>
      </CustomPopover>

      <CustomPopover open={monthPopover.open} onClose={monthPopover.onClose}>
        {months?.map((item: any) => (
          <MenuItem
            selected={item.value === selectedMonth}
            onClick={() => handleChangeMonth(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>

      <CustomPopover open={khoiPopover.open} onClose={khoiPopover.onClose}>
        {STATUS_OPTIONS?.map((item: any) => (
          <MenuItem
            selected={item.value === selectedKhoiCV}
            onClick={() => handleChangeKhoi(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
