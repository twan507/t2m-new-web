'use client'
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './gauge.css';

Chart.register(ArcElement, Tooltip, Legend);

const getColor = (value: number) => {
  if (value < 50) return '#00cccc'; // Đỏ
  if (value < 80) return '#e14040'; // Cam
  if (value < 120) return '#D0be0f'; // Vàng
  if (value < 150) return '#24B75E'; // Xanh lá cây
  return '#C031C7'; // Xanh đậm
};

const LiquidityGaugeChart = (props: any) => {
  const value: any = (props?.data?.filter((item: any) => item.name === 'Thị trường')[0]?.liquidity * 100)?.toFixed(2);

  const data: any = {
    datasets: [
      {
        data: [value, Math.max(150 - value, 0)], // Tỷ lệ phần trăm của gauge
        backgroundColor: [getColor(value), '#dfdfdf'], // Màu sắc của gauge
        borderWidth: 0,
        cutout: '75%',
        rotation: 270,
        circumference: 180,
        weight: 1,
      },
    ],
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
      const centerY = 120 - 10000 / ww;
      ctx.fillStyle = color;
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    },
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
        text: `${value}%`,
        color: getColor(value),
        ww: props?.ww,
      },
      drawCenterText, // Register the plugin locally
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="ta-gauge-chart-container" style={{ height: props?.height, width: props?.width }}>
      {props?.openState && (
        <Doughnut data={data} options={options} plugins={[drawCenterText]} />
      )}
    </div>
  );
};

export default LiquidityGaugeChart;
