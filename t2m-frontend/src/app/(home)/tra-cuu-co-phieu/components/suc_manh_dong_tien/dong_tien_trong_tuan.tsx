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

const StockWeekScore = (props: any) => {
    const data_sets = props?.data?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
                label: 'Dòng tiền trong tuần',
                data: data_sets?.map((item: any) => item.t5_score),
                fill: 'origin',
                backgroundColor: 'rgba(2, 91, 196, 0.2)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#025bc4',
                pointBackgroundColor: '#025bc4', // Màu nền cho các điểm
                pointRadius: 1.4,
                hoverRadius: 5,
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Dòng tiền trong phiên',
                data: data_sets?.map((item: any) => item.t0_score / 5),
                backgroundColor: data_sets?.map((item: any) => item.t0_score >= 0 ? 'rgba(36, 183, 94, 0.5)' : 'rgba(225, 64, 64, 0.5)'), // Dynamic color based on value
                type: 'bar',
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
                },
                generateLabels: (chart: any) => {
                    // Access the datasets and determine colors
                    return chart.data.datasets.map((dataset: any, index: number) => {
                        // Determine the color based on the last data point
                        const lastDataPointColor = Array.isArray(dataset.backgroundColor)
                            ? dataset.backgroundColor[dataset.data.length - 1]
                            : dataset.backgroundColor;
                        return {
                            text: dataset.label,
                            fillStyle: index === 1 ? lastDataPointColor : dataset.borderColor,
                            strokeStyle: index === 1 ? lastDataPointColor : dataset.borderColor,
                            hidden: !chart.isDatasetVisible(index),
                            index: index,
                        };
                    });
                }
            },
            tooltip: {
                enabled: props.ww > 767 ? true : false,
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        const label = tooltipItem?.dataset?.label;
                        let value = tooltipItem?.raw;

                        // Multiply value by 5 if it is for 'Dòng tiền trong phiên' bar
                        if (tooltipItem.dataset.label === 'Dòng tiền trong phiên') {
                            value *= 5;
                        }

                        return `${label}: ${value.toFixed(2)}`;
                    }
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                boxHeight: 8,
                caretPadding: 20
            },
            title: {
                display: true,
                text: 'Diễn biến sức mạnh dòng tiền',
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
                    callback: function (value: number) {
                        return `${value.toFixed(1)}`;
                    }
                },
                grid: {
                    display: true,
                    color: '#555555',
                    lineWidth: 0.5,
                },
            },
        },
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false);
    }, []);

    if (!checkAuth) {
        return (
            <div style={{ width: '100%', height: props.ww > 767 ? '350px' : '250px' }}>
                <Line data={lines} options={options} plugins={[customLegendMargin, customTitleMargin]} />
            </div>
        );
    }

    return null;
}

export default StockWeekScore;
