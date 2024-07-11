'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

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


const ScorePriceCorrelationChart = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.stock === props?.select_stock)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        return `${day}-${month}`;
    });

    const lines = {
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
            },
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
                    boxWidth: 20, // Độ rộng của hộp màu trong legend
                    boxHeight: 6,
                    padding: 10, // Khoảng cách giữa các mục trong legend
                    pointStyle: 'circle', // Đặt kiểu điểm thành hình tròn
                    usePointStyle: true, // Bảo đảm sử dụng pointStyle cho biểu tượng
                    font: {
                        size: parseInt(props?.fontSize) - 4, // Điều chỉnh cỡ chữ của legend
                        family: 'Calibri', // Điều chỉnh font chữ của legend
                    },
                    color: '#dfdfdf' // Màu chữ của legend
                }
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        return `${tooltipItem?.dataset?.label}: ${tooltipItem?.raw?.toFixed(2)}%`;
                    }
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
                    callback: function (value: number) {
                        return `${value}%`; // Hiển thị dạng phần trăm
                    }
                },
                grid: {
                    display: true,
                    color: '#dfdfdf',
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 1 : 0; // Draw grid line only at value 0
                    },
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
            <div style={{ width: '100%', height: '300px' }}>
                <Line data={lines} options={options} plugins={[customLegendMargin, customTitleMargin]} />
            </div>
        );
    }

    return null;
}

export default ScorePriceCorrelationChart;
