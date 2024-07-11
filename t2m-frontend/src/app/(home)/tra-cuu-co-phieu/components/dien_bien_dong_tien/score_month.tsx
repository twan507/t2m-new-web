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

const StockMonthScoreChart = (props: any) => {


    const data_sets = props?.data?.filter((item: any) => item.stock === props?.select_stock)
        .sort((a: any, b: any) => a.day_num - b.day_num)

    const lines: any = {
        labels: data_sets?.map((item: any) => item.day_num) || [],
        datasets: [
            {
                label: 'Tháng này',
                data: data_sets?.map((item: any) => item.m1),
                fill: 'origin',
                backgroundColor: 'rgba(192, 49, 199, 0.2)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#C031C7',
                pointRadius: 0, // Tắt các chấm màu xám ở các data label
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Tháng trước',
                data: data_sets?.map((item: any) => item.m2),
                fill: 'origin',
                backgroundColor: 'rgba(2, 91, 196, 0.2)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#025bc4',
                pointRadius: 0, // Tắt các chấm màu xám ở các data label
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false, // Đảm bảo biểu đồ sẽ điều chỉnh kích thước theo container
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
                        return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(2)}`;
                    }
                },
                displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
                usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
                bodyFontColor: '#dfdfdf', // Màu chữ của tooltip
                bodyFont: {
                    size: parseInt(props?.fontSize) - 7,
                },
                titleFont: {
                    size: parseInt(props?.fontSize) - 7,
                }, // Cỡ chữ trong tooltip
                // Kiểu chữ trong tooltip
                boxWidth: 10, // Kích thước của ô màu
                caretPadding: 20
            },
            title: {
                display: true,
                text: 'Dòng tiền trong tháng',
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
                display: false, // Tắt các số tại các data label
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                ticks: {
                    color: '#dfdfdf', // Màu của các nhãn trên trục X
                    callback: function (value: any, index: any, values: any) {
                        // Bỏ qua tick đầu tiên
                        if (index === 0) return '';
                        if (index < 10) return `0${value}`
                        return value;
                    }
                },
            },
            y: {
                position: 'right',
                ticks: {
                    color: '#dfdfdf', // Màu của các nhãn trên trục Y
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
    };
}

export default StockMonthScoreChart;
