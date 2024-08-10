import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, HistogramData } from 'lightweight-charts';

const AreaChart: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create the chart
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
                rightOffset: 2,
                barSpacing: 20,
            },
        });

        // Add area series with default scale
        areaSeriesRef.current = chartRef.current.addAreaSeries({
            topColor: 'rgba(192, 49, 199, 0.5)',
            bottomColor: 'rgba(192, 49, 199, 0)',
            lineColor: '#C031C7',
            lineWidth: 2,
            priceScaleId: 'right', // Default right scale for the area series
        });

        // Add histogram series with a separate scale
        volumeSeriesRef.current = chartRef.current.addHistogramSeries({
            color: 'rgba(192, 49, 199, 0.4)',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume', // Separate price scale for the volume histogram
            lastValueVisible: true, // Hide the last value label for the histogram
            priceLineVisible: false,
        });

        // Apply options to configure the price scales
        chartRef.current.priceScale('right').applyOptions({
            scaleMargins: {
                top: 0.2, // 80% of the chart height for the area series
                bottom: 0.25, // Aligns the histogram to the bottom of the chart
            },
        });

        chartRef.current.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.75, // Allocate the bottom 25% of the chart for the histogram
                bottom: 0,
            },
            visible: true, // Make the volume scale visible
        });

        // Hide the horizontal grid lines for the volume price scale
        chartRef.current.applyOptions({
            grid: {
                vertLines: {
                    color: '#404040',
                    visible: true,
                },
                horzLines: {
                    color: '#404040',
                    visible: true,
                },
            },
        });

        const combinedData: any = [
            { time: '2024-08-01', value: 70, volume: 200 },
            { time: '2024-08-02', value: 75, volume: 240 },
            { time: '2024-08-03', value: 40, volume: 220 },
            { time: '2024-08-04', value: 90, volume: 260 },
            { time: '2024-08-05', value: 95, volume: 300 },
            { time: '2024-08-06', value: 85, volume: 280 },
            { time: '2024-08-07', value: 88, volume: 320 },
            { time: '2024-08-08', value: 92, volume: 350 },
            { time: '2024-08-09', value: 89, volume: 330 },
            { time: '2024-08-10', value: 75, volume: 310 },
            { time: '2024-08-11', value: 80, volume: 360 },
            { time: '2024-08-12', value: 82, volume: 390 },
            { time: '2024-08-13', value: 86, volume: 410 },
            { time: '2024-08-14', value: 83, volume: 430 },
            { time: '2024-08-15', value: 79, volume: 400 },
            { time: '2024-08-16', value: 77, volume: 420 },
            { time: '2024-08-17', value: 85, volume: 440 },
            { time: '2024-08-18', value: 87, volume: 460 },
            { time: '2024-08-19', value: 93, volume: 480 },
            { time: '2024-08-20', value: 90, volume: 500 },
        ];

        // Separate the data for area and volume
        const areaData = combinedData.map(({ time, value }: any) => ({ time: time, value: value }));
        const volumeData = combinedData.map(({ time, volume }: any) => ({ time: time, value: volume }));

        // Set the data
        areaSeriesRef.current.setData(areaData);
        volumeSeriesRef.current.setData(volumeData);

        // Resize observer for responsive design
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
