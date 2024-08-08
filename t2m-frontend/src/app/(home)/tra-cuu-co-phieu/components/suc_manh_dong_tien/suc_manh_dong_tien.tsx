'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const customLegendMargin: Plugin = {
    id: 'customLegendMargin',
    beforeInit(chart: any) {
        const originalFit = chart.legend.fit;
        chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)();
            this.height += 30; // Adjust this value as needed
        };
    },
};

const customTitleMargin: Plugin = {
    id: 'customTitleMargin',
    beforeInit(chart: any) {
        if (chart.title && chart.title.draw) {
            const originalDraw = chart.title.draw;
            chart.title.draw = function draw() {
                originalDraw.bind(chart.title)();
                chart.chartArea.top -= 30; // Adjust this value as needed
            };
        }
    },
};


const StockScorePriceCorrelationChart = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.stock === props?.select_stock)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1))?.slice(-2);
        const day = ('0' + date.getDate())?.slice(-2);
        return `${day}-${month}`;
    });

    const lines: any = {
        labels: dateList || [],
        datasets: [
            {
                label: '% biến động dòng tiền',
                data: data_sets?.map((item: any) => item.score_change * 100),
                borderColor: '#C031C7',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
                yAxisID: 'y', // Sử dụng trục y đầu tiên
            },
            {
                label: '% biến động giá',
                data: data_sets?.map((item: any) => item.price_change * 100),
                borderColor: '#025bc4',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
                yAxisID: 'y', // Sử dụng trục y đầu tiên
            },
            {
                label: props.ww > 767 ? 'Khối lượng giao dịch' : 'Khối lượng',
                data: data_sets?.map((item: any) => item.volume),
                backgroundColor: 'rgba(211, 211, 211, 0.2)', // Màu sắc cho cột
                type: 'bar', // Đặt kiểu dữ liệu là biểu đồ cột
                yAxisID: 'y2', // Sử dụng trục y thứ hai
                maxBarThickness: 30,
            }
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 20,
                    boxHeight: 6,
                    padding: 10,
                    pointStyle: 'circle',
                    usePointStyle: true,
                    font: {
                        size: parseInt(props?.fontSize) - 4,
                        family: 'Calibri',
                    },
                    color: '#dfdfdf'
                }
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        const label = tooltipItem?.dataset?.label;
                        const value = tooltipItem?.raw;

                        // Kiểm tra trục y của dataset để tùy chỉnh tooltip
                        if (tooltipItem.dataset.yAxisID === 'y2') {
                            // Định dạng số volume với dấu phẩy phân cách
                            return `${label}: ${value.toLocaleString()}`;
                        }

                        return `${label}: ${value.toFixed(2)}%`; // Thêm ký hiệu '%' cho các dataset trên trục y
                    }
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                boxHeight: 8,
                caretPadding: 20
            },
            title: {
                display: false,
                text: props?.ww > 767 ? 'Tương quan biến động giá và dòng tiền' : 'Tương quan giá và dòng tiền',
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize) - 2,
                    weight: 'bold',
                },
                color: '#dfdfdf'
            },
            datalabels: {
                display: false,
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                ticks: {
                    color: '#dfdfdf',
                },
            },
            y: {
                position: 'right',
                ticks: {
                    color: '#dfdfdf',
                    stepSize: 5,
                    callback: function (value: number) {
                        return `${value}%`;
                    }
                },
                grid: {
                    display: true,
                    color: '#dfdfdf',
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 1 : 0;
                    },
                },
            },
            y2: {
                position: 'left', // Đặt trục y thứ hai ở phía bên trái
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            }
        },
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false);
    }, []);

    if (!checkAuth) {
        return (
            <div style={{ width: '100%', height: '300px' }}>
                <Line data={lines} options={options} plugins={[customLegendMargin, customTitleMargin]} />
            </div>
        );
    }

    return null;
}

export default StockScorePriceCorrelationChart;
