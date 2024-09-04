import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

const GroupPriceChart = (props: any) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

    const ww = props?.ww;

    // useEffect để tạo biểu đồ chỉ chạy một lần khi component mount
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Tạo biểu đồ
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
                rightOffset: 1,
                barSpacing: ww > 767 ? 12 : (ww > 576 ? 6 : 3),
            },
            // handleScroll: {
            //     mouseWheel: false, // Disable zoom on mouse wheel
            // },
            // handleScale: {
            //     mouseWheel: false, // Disable zoom on mouse wheel
            // },
        });

        // Thêm area series
        areaSeriesRef.current = chartRef.current.addAreaSeries({
            topColor: 'rgba(192, 49, 199, 0.5)',
            bottomColor: 'rgba(192, 49, 199, 0)',
            lineColor: '#C031C7',
            lineWidth: 2,
            priceScaleId: 'right',
        });

        // Thêm histogram series
        volumeSeriesRef.current = chartRef.current.addHistogramSeries({
            color: 'rgba(192, 49, 199, 0.4)',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume',
            lastValueVisible: true,
            priceLineVisible: false,
        });

        // Cấu hình scale
        chartRef.current.priceScale('right').applyOptions({
            scaleMargins: {
                top: 0.2,
                bottom: 0.25,
            },
        });

        chartRef.current.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.75,
                bottom: 0,
            },
            visible: true,
        });

        // Ẩn đường lưới ngang cho volume price scale
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

        // Quan sát thay đổi kích thước để thiết kế đáp ứng
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
            areaSeriesRef.current = null;
            volumeSeriesRef.current = null;
        };
    }, [props.select_group]); // Chỉ chạy một lần khi component mount

    // useEffect để cập nhật dữ liệu khi props.data thay đổi
    useEffect(() => {
        if (!areaSeriesRef.current || !volumeSeriesRef.current) return;

        const chartData = props?.data?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const areaData = chartData?.map(({ date, value }: any) => ({
            time: Date.parse(date) / 1000, // Chuyển đổi sang giây
            value: value,
        }));

        const volumeData = chartData?.map(({ date, volume }: any) => ({
            time: Date.parse(date) / 1000, // Chuyển đổi sang giây
            value: volume,
        }));

        // Cập nhật dữ liệu
        areaSeriesRef.current.setData(areaData);
        volumeSeriesRef.current.setData(volumeData);
    }, [props.data]); // Chỉ chạy khi props.data thay đổi

    return (
        <div
            ref={chartContainerRef}
            style={{ width: '100%', height: props.ww > 767 ? '300px' : '256px', marginTop: '10px' }}
        />
    );
};

export default GroupPriceChart;
