import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface EcommerceYearlySalesProps {
  title: string;
  subheader?: string;
  chart: {
    data?: any[];
  };
  [key: string]: any;
}

export default function EcommerceYearlySales({
  title,
  subheader,
  chart,
  ...other
}: EcommerceYearlySalesProps) {
  // Process the 7-day data to prepare it for the chart
  const processedData = React.useMemo(() => {
    if (!chart.data || !Array.isArray(chart.data) || chart.data.length === 0) {
      return {
        categories: [],
        series: [
          { name: 'Tỉ lệ hoàn thành (%)', type: 'area', data: [] },
          { name: 'Số dự án hoàn thành', type: 'column', data: [] }
        ]
      };
    }

    // Sort data by date (oldest to newest)
    const sortedData = [...chart.data].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const categories = sortedData.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const percentageData = sortedData.map(item => parseFloat(item.data.Tyle));
    const projectCountData = sortedData.map(item => item.data.SoDA);

    return {
      categories,
      series: [
        { name: 'Tỉ lệ hoàn thành (%)', type: 'area', data: percentageData },
        { name: 'Số dự án nhập', type: 'column', data: projectCountData }
      ]
    };
  }, [chart.data]);

  const chartOptions = useChart({
    xaxis: {
      categories: processedData.categories,
    },
    tooltip: {
      y: {
        formatter: (value: number, { seriesIndex }: any) => {
          if (seriesIndex === 0) return `${value}%`;
          return `${value} dự án`;
        },
      },
      shared: true,
    },
    // Show the percentage labels on the area series
    dataLabels: {
      enabled: true,
      formatter(val: number, opt: any) {
        // Only show labels for the area series (percentage)
        if (opt.seriesIndex === 0) {
          return `${val}%`;
        }
        return '';
      },
      offsetY: -5,
      style: {
        fontSize: '11px',
      },
    },
    // Enable dual Y-axis for different scales
    yaxis: [
      {
        title: {
          text: 'Tỉ lệ (%)',
        },
        decimalsInFloat: 2,
        min: 0,
        max: Math.max(...(processedData.series[0]?.data || [0])) * 1.2, // Add 20% padding to max value
      },
      {
        opposite: true,
        title: {
          text: 'Số dự án',
        },
        min: 0,
        max: Math.ceil(Math.max(...(processedData.series[1]?.data || [0])) * 1.2), // Làm tròn max lên
        tickAmount: 6, // Tùy chọn: số hàng trên trục (bạn có thể điều chỉnh 5–10)
        labels: {
          formatter: (val: number) => Math.round(val).toString()
        }
      }

    ],
    stroke: {
      curve: 'smooth',
      width: [3, 2],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    colors: ['#2065D1', '#22C55E'],
    fill: {
      type: ['gradient', 'solid'],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          type="line"
          series={processedData.series}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}