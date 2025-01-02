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
    categories: string[];
    colors?: string[];
    series: any;
    options?: ApexOptions;
  };
  selectedYear: string;
  selectedKhoiCV: string;
  selectedTangGiam: string;
  onYearChange: (year: string) => void;
  onKhoiChange: (khoi: string) => void;
  onTangGiamChange: (tg: string) => void;
  onChinhanhChange: (cn: string) => void;
  STATUS_OPTIONS: any;
  tangGiam: any,
  handleOpenModal: (name: string, key: string) => void;
  handleCloseModal: () => void;
  chiNhanhs: any;
  years: any;
  selectedChiNhanh: string;
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
  onChinhanhChange,
  STATUS_OPTIONS,
  tangGiam,
  handleOpenModal,
  handleCloseModal,
  selectedChiNhanh,
  chiNhanhs,
  years,
  ...other
}: Props) {
  const { categories, colors, series, options } = chart;

  const yearPopover = usePopover();
  const chinhanhPopover = usePopover();
  const tangGiamPopover = usePopover();

  const handleChartClick = (
    event: any,
    chartContext: any,
    { seriesIndex, dataPointIndex, w }: any
  ) => {
    if (dataPointIndex !== -1 && categories.length > 0) {
      const projectName = categories[dataPointIndex];
      handleOpenModal(projectName, "su-co-ngoai");
    }

  };

  const chartOptions = useChart({
    chart: {
      type: 'bar',
      stacked: false,
      height: 350,
      toolbar: {
        show: false,
      },
      events: {
        click: handleChartClick, // Attach the click event handler here at the root 'chart' level
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '30%',  // Adjust height of bars for better visibility
      },
    },
    colors: ['#026e4e', '#e0e7ea'], // Darker for primary, lighter for comparison
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
      formatter: (val: any) => `${val?.toFixed(0)}`,
    },
    xaxis: {
      categories, // Use categories for X-axis
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: any) => `${val}`,
      },
    },

  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      yearPopover.onClose(); // Close the year popover
      onYearChange(newValue);
    },
    [onYearChange, yearPopover]
  );

  const handleChangeChinhanh = useCallback(
    (newValue: string) => {
      chinhanhPopover.onClose(); // Close the KhoiCV popover
      onChinhanhChange(newValue);
    },
    [chinhanhPopover, onChinhanhChange]
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
                  icon={yearPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
              <ButtonBase
                onClick={chinhanhPopover.onOpen} // Open the KhoiCV popover
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {chiNhanhs.find((option: any) => option.value === selectedChiNhanh)?.label}
                <Iconify
                  width={16}
                  icon={
                    chinhanhPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
            </Box>
          }
        />

        {/* Display chart for selected year */}
        {series.map((item: any) => (
          <Box key={item.name} sx={{ mt: 3, mx: 3 }}>
            {item.name === selectedYear && (
              <Chart dir="ltr" type="bar" series={[{ name: item.name, data: item.data }]} options={chartOptions} height={364} />
            )}
          </Box>
        ))}
      </Card>

      {/* Popover for selecting year */}
      <CustomPopover open={yearPopover.open} onClose={yearPopover.onClose} sx={{ width: 140 }}>
        {years.map((item: any) => (
          <MenuItem key={item.value} selected={selectedYear === item.value} onClick={() => handleChangeSeries(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>

      <CustomPopover open={chinhanhPopover.open} onClose={chinhanhPopover.onClose}>
        {chiNhanhs?.map((item: any) => (
          <MenuItem
            selected={item.value === selectedChiNhanh}
            onClick={() => handleChangeChinhanh(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}



