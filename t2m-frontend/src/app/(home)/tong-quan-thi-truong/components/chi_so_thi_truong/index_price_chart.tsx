import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, HistogramData } from 'lightweight-charts';

// Mở rộng CandlestickData để bao gồm volume
interface CombinedCandlestickData extends CandlestickData {
    volume: number;
}

const IndexPriceChart = (props: any) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
    const ww = props?.ww

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
                rightOffset: 2,
                barSpacing:  ww > 767 ? 15 : (ww > 576 ? 10 : 5),
            },
            // handleScroll: {
            //     mouseWheel: false, // Disable zoom on mouse wheel
            // },
            // handleScale: {
            //     mouseWheel: false, // Disable zoom on mouse wheel
            // },
        });

        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
            upColor: '#24B75E',
            downColor: '#e14040',
            borderDownColor: '#e14040',
            borderUpColor: '#24B75E',
            wickDownColor: '#e14040',
            wickUpColor: '#24B75E',
        });

        // Thêm series histogram với scale riêng biệt
        volumeSeriesRef.current = chartRef.current.addHistogramSeries({
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume', // Scale riêng biệt cho histogram volume
            lastValueVisible: true, // Ẩn nhãn giá trị cuối cùng cho histogram
            priceLineVisible: false,
        });

        // Áp dụng tùy chọn để cấu hình scales giá
        chartRef.current.priceScale('right').applyOptions({
            scaleMargins: {
                top: 0.2, // 80% chiều cao biểu đồ cho area series
                bottom: 0.25, // Canh chỉnh histogram xuống đáy biểu đồ
            },
        });

        chartRef.current.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.75, // Dành 25% dưới cùng của biểu đồ cho histogram
                bottom: 0,
            },
            visible: true, // Hiển thị scale volume
        });

        // Ẩn các đường lưới ngang cho scale giá volume
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


        const chartData: any = props?.data?.filter((item: any) => item.index === props?.index_name)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        candlestickSeriesRef.current.setData(
            chartData.map((data: any) => ({
                // time: data.time,
                time: Date.parse(data.date) / 1000, // Chuyển đổi sang giây
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.close,
            }))
        );

        volumeSeriesRef.current.setData(
            chartData.map((data: any) => ({
                time: Date.parse(data.date) / 1000, // Chuyển đổi sang giây
                // time: data.time,
                value: data.volume,
                color: data.close > data.open ? 'rgba(36, 183, 94, 0.4)' : 'rgba(225, 64, 64, 0.4)', // Màu sắc dựa trên candlestick
            }))
        );

        const resizeObserver = new ResizeObserver((entries) => {
            if (chartRef.current) {
                const { width, height } = entries[0].contentRect;
                chartRef.current.resize(width, height);
            }
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            if (chartRef.current) {
                chartRef.current.remove(); // Xóa biểu đồ
                chartRef.current = null;
            }

            resizeObserver.disconnect(); // Ngừng quan sát thay đổi kích thước

            // Xóa các tham chiếu tới series để đảm bảo giải phóng bộ nhớ
            candlestickSeriesRef.current = null;
            volumeSeriesRef.current = null;
        };
    }, []);

    return <div ref={chartContainerRef} style={{ width: '100%', height: props.ww > 767 ? '290px' : '235px' }} />;
};

export default IndexPriceChart;
