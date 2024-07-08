'use client'
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels // Đăng ký plugin datalabels
);

const StockWeekScoreChart = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.stock === props?.select_stock)
        .sort((a: any, b: any) => a.day_index - b.day_index)


    const data = {
        labels: data_sets?.map((item: any) => item.week_day) || [],
        datasets: [
            {
                label: 'Tuần này',
                data: data_sets?.map((item: any) => item.w1),
                backgroundColor: '#C031C7',
                barPercentage: 0.8, // Điều chỉnh độ rộng của bar
                categoryPercentage: 0.7, // Điều chỉnh khoảng cách giữa các bar
            },
            {
                label: 'Tuần trước',
                data: data_sets?.map((item: any) => item.w2),
                backgroundColor: '#025bc4',
                barPercentage: 0.8, // Điều chỉnh độ rộng của bar
                categoryPercentage: 0.7, // Điều chỉnh khoảng cách giữa các bar
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
                    boxHeight: 8,
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
                    label: function (tooltipItem: any) {
                        return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(2)}`;
                    }
                },
                displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
                usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
                bodyFontColor: '#dfdfdf', // Màu chữ của tooltip
                bodyFontSize: parseInt(props?.fontSize) - 4, // Cỡ chữ trong tooltip
                bodyFontStyle: 'bold', // Kiểu chữ trong tooltip
                boxWidth: 10, // Kích thước của ô màu
            },
            title: {
                display: true,
                text: 'Dòng tiền trong tuần',
                padding: {
                    bottom: 0, // Giảm khoảng cách phía dưới tiêu đề
                },
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize) - 2, // Chỉnh sửa cỡ chữ
                    weight: 'bold', // Chỉnh sửa kiểu chữ
                },
                color: '#dfdfdf' // Chỉnh sửa màu chữ
            },
            datalabels: {
                display: true,
                anchor: (context: any) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? 'end' : 'start';
                },
                align: (context: any) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? 'top' : 'bottom';
                },
                formatter: (value: any) => value?.toFixed(2), // Định dạng giá trị hiển thị
                font: {
                    family: 'Helvetica, sans-serif',
                    size: props.ww > 576 ? parseInt(props?.fontSize) - 7 : parseInt(props?.fontSize) - 5, // Chỉnh sửa cỡ chữ
                },
                color: '#dfdfdf',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Loại bỏ grid dọc
                },
                ticks: {
                    color: '#dfdfdf', // Màu của các nhãn trên trục X
                    padding: 20, // Khoảng cách giữa các nhãn và trục x
                },
            },
            y: {
                position: 'right',
                grid: {
                    display: false, // Loại bỏ grid ngang
                },
                ticks: {
                    color: '#dfdfdf', // Màu của các nhãn trên trục X
                },
            },
        },
    };

    const customLegendMargin: Plugin = {
        id: 'customLegendMargin',
        beforeInit(chart: any) {
            // Add padding to the top of the chart to create space for the legend
            const originalFit = chart.legend.fit;
            chart.legend.fit = function fit() {
                originalFit.bind(chart.legend)();
                return (this.height += 30);
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

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false);
    }, []);

    if (!checkAuth) {
        return (
            <>
                <div style={{ height: '317px', width: '100%' }}>
                    <Bar data={data} options={options} plugins={[customLegendMargin, customTitleMargin]} />
                </div>
            </>
        );
    }
};

export default StockWeekScoreChart;
