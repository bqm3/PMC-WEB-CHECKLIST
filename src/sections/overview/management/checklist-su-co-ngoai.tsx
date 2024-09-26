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
    series:any;
    options?: ApexOptions;
  };
  selectedYear: string;
  selectedKhoiCV: string;
  selectedTangGiam: string;
  onYearChange: (year: string) => void;
  onKhoiChange: (khoi: string) => void;
  onTangGiamChange: (tg: string) => void;
  STATUS_OPTIONS: any;
  tangGiam: any,
  handleOpenModal: (name: string,key: string ) => void;
  handleCloseModal: () => void;
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
  handleOpenModal,
  handleCloseModal,
  ...other
}: Props) {
  const { categories, colors, series, options } = chart;

  const yearPopover = usePopover();
  const khoiPopover = usePopover();
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
      formatter: (val: any) => val.toFixed(0),
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
                  icon={yearPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
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
        {series.map((item: any) => (
          <MenuItem key={item.name} selected={selectedYear === item.name} onClick={() => handleChangeSeries(item.name)}>
            {item.name}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}



