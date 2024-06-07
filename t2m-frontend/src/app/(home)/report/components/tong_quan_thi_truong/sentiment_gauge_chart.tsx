'use client'
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import './gauge.css';

Chart.register(ArcElement, Tooltip, Legend);

const getColor = (value: number) => {
  if (value < 20) return '#00cccc'; // Đỏ
  if (value < 40) return '#e14040'; // Cam
  if (value < 60) return '#D0be0f'; // Vàng
  if (value < 80) return '#24B75E'; // Xanh lá cây
  return '#C031C7'; // Xanh đậm
};

const drawCenterText = {
  id: 'drawCenterText',
  beforeDraw: (chart: any) => {
    const { width, height, ctx } = chart;
    const text = chart.config.options?.plugins?.center?.text;
    const color = chart.config.options?.plugins?.center?.color;
    const ww = chart.config.options?.plugins?.center?.ww;
    const fontStyle = 'Calibri';
    ctx.save();
    ctx.font = `bold ${Math.round(Math.sqrt((width as number) * 3))}px ${fontStyle}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const centerX = width / 1.95;
    const centerY = 92 - 10000 / ww;
    ctx.fillStyle = color;
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  },
};

Chart.register(drawCenterText);

const SentimentGaugeChart = (props: any) => {

  const value: any = (props?.data?.[0]?.last_ratio?.toFixed(2));

  const data: any = {
    datasets: [
      {
        data: [value, 100 - value], // Tỷ lệ phần trăm của gauge
        backgroundColor: [getColor(value), '#dfdfdf'], // Màu sắc của gauge
        borderWidth: 0,
        cutout: '75%',
        rotation: 270,
        circumference: 180,
        weight: 1,
      },
    ],
  };

  const options: any = {
    rotation: -90,
    circumference: 180,
    cutout: '75%',
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false, // Vô hiệu hóa datalabels
      },
      center: {
        text: `${value}`,
        color: getColor(value),
        ww: props?.ww
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="ta-gauge-chart-container" style={{ height: props?.height, width: props?.width, marginTop: '5px' }}>
      {props?.openState && (
        <Doughnut data={data} options={options} />
      )}
    </div>
  );
};

export default SentimentGaugeChart;
