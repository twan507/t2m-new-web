// components/CandleChart.tsx
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, CrosshairMode } from 'lightweight-charts';

const CandleChart: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

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
                mode: 0, // Đặt chế độ crosshair ghim vào giá gần nhất
            },
            localization: {
                locale: 'vi-VN',
            },
            timeScale: {
                rightOffset: 2, // Tăng giá trị này để tạo khoảng cách với trục y
                barSpacing: 20,  // Tăng khoảng cách giữa các bar để phóng to
            },
        });

        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
            upColor: '#24B75E',
            downColor: '#e14040',
            borderDownColor: '#e14040',
            borderUpColor: '#24B75E',
            wickDownColor: '#e14040',
            wickUpColor: '#24B75E',
        });

        const data: CandlestickData[] = [
            { time: '2024-08-01', open: 50, high: 75, low: 35, close: 70 },
            { time: '2024-08-02', open: 70, high: 80, low: 65, close: 75 },
            { time: '2024-08-03', open: 75, high: 90, low: 70, close: 40 },
            { time: '2024-08-04', open: 85, high: 95, low: 80, close: 90 },
            { time: '2024-08-05', open: 90, high: 100, low: 85, close: 85 },
        ];

        candlestickSeriesRef.current.setData(data);

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

export default CandleChart;
