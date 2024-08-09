import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData } from 'lightweight-charts';

const AreaChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: '#000000' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: {
          color: '#404040',
        },
        horzLines: {
          color: '#404040',
        },
      },
      crosshair: {
        mode: 0,
      },
      localization: {
        locale: 'vi-VN',
      },
      timeScale: {
        rightOffset: 2, // Tăng giá trị này để tạo khoảng cách với trục y
        barSpacing: 20,  // Tăng khoảng cách giữa các bar để phóng to
      },
    });

    areaSeriesRef.current = chartRef.current.addAreaSeries({
      topColor: 'rgba(2, 91, 196, 0.5)',
      bottomColor: 'rgba(2, 91, 196, 0)',
      lineColor: '#025bc4',
      lineWidth: 2,
    });

    const data: LineData[] = [
      { time: '2024-08-01', value: 70 },
      { time: '2024-08-02', value: 75 },
      { time: '2024-08-03', value: 40 },
      { time: '2024-08-04', value: 90 },
      { time: '2024-08-05', value: 95 },
      { time: '2024-08-06', value: 85 },
      { time: '2024-08-07', value: 88 },
      { time: '2024-08-08', value: 92 },
      { time: '2024-08-09', value: 89 },
      { time: '2024-08-10', value: 75 },
      { time: '2024-08-11', value: 80 },
      { time: '2024-08-12', value: 82 },
      { time: '2024-08-13', value: 86 },
      { time: '2024-08-14', value: 83 },
      { time: '2024-08-15', value: 79 },
      { time: '2024-08-16', value: 77 },
      { time: '2024-08-17', value: 85 },
      { time: '2024-08-18', value: 87 },
      { time: '2024-08-19', value: 93 },
      { time: '2024-08-20', value: 90 },
    ];

    areaSeriesRef.current.setData(data);

    const resizeObserver = new ResizeObserver(entries => {
      if (chartRef.current) {
        const { width, height } = entries[0].contentRect;
        chartRef.current.resize(width, height);
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />;
};

export default AreaChart;
