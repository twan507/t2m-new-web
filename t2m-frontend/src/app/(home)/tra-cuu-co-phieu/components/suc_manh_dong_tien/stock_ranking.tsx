'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const customLegendMargin: Plugin = {
    id: 'customLegendMargin',
    beforeInit(chart: any) {
        // Add padding to the top of the chart to create space for the legend
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
            // Adjust title padding to bring it closer to the chart
            const originalDraw = chart.title.draw;
            chart.title.draw = function draw() {
                originalDraw.bind(chart.title)();
                chart.chartArea.top -= 30; // Adjust this value as needed
            };
        }
    },
};

const StockRankingChart = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.stock === props?.select_stock)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        return `${day}-${month}`;
    });

    const lines: any = {
        labels: dateList || [],
        datasets: [
            {
                label: props?.select_stock,
                data: data_sets?.map((item: any) => item.rank),
                borderColor: '#C031C7',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
                yAxisID: 'y',
            },
            {
                label: 'Top 10% tiền vào',
                type: 'bar',
                data: data_sets?.map((item: any) => item.top_rank_check),
                backgroundColor: hexToRgba('#24B75E', 0.5),
                barPercentage: props?.ww > 767 ? 0.4 : 0.8,
                yAxisID: 'y1',
            },
            {
                label: 'Top 10% tiền ra',
                type: 'bar',
                data: data_sets?.map((item: any) => item.bot_rank_check),
                backgroundColor: hexToRgba('#e14040', 0.5),
                barPercentage: props?.ww > 767 ? 0.4 : 0.8,
                yAxisID: 'y2',
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    boxWidth: 20, // Độ rộng của hộp màu trong legend
                    boxHeight: 8,
                    padding: 10, // Khoảng cách giữa các mục trong legend
                    pointStyle: 'circle', // Đặt kiểu điểm thành hình tròn
                    usePointStyle: true, // Bảo đảm sử dụng pointStyle cho biểu tượng
                    font: {
                        size: parseInt(props?.fontSize) - 4, // Điều chỉnh cỡ chữ của legend
                        family: 'Calibri', // Điều chỉnh font chữ của legend
                    },
                    color: '#dfdfdf', // Màu chữ của legend
                    filter: (legendItem: any, chartData: any) => {
                        // Only show legend items for y1 and y2
                        return legendItem.datasetIndex === 1 || legendItem.datasetIndex === 2;
                    }
                }
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        // Only show tooltip for y axis
                        if (tooltipItem.datasetIndex === 0) {
                            return `${props?.select_stock}: ${tooltipItem.raw}`;
                        }
                        return null;
                    }
                },
                filter: function (tooltipItem: any) {
                    // Only show tooltip items for y axis
                    return tooltipItem.datasetIndex === 0;
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                bodyFont: {
                    size: parseInt(props?.fontSize) - 7,
                },
                titleFont: {
                    size: parseInt(props?.fontSize) - 7,
                },

                boxHeight: 8,
                caretPadding: 20
            },
            title: {
                display: true,
                padding: {},
                text: props?.ww > 767 ? 'Diễn biến sức mạnh dòng tiền' : 'Diễn biến SMDT',
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
                stacked: true,
                ticks: {
                    color: '#dfdfdf',
                },
            },
            y: {
                type: 'linear',
                min: 1,
                max: props?.stock_count,
                position: 'right',
                reverse: true,
                ticks: {
                    stepSize: 5,
                    color: '#dfdfdf',
                    callback: function (value: any) {
                        if (value >= 1) {
                            return value;
                        }
                        return '';
                    }
                },
                grid: {
                    display: false,
                    color: '#dfdfdf',
                    lineWidth: 0.5,
                }
            },
            y1: {
                type: 'linear',
                stacked: true,
                position: 'left',
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                }
            },
            y2: {
                type: 'linear',
                stacked: true,
                position: 'left',
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                }
            },
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

export default StockRankingChart;
