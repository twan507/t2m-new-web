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

const PerformChart = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.time_span === props.time_span)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        const year = date.getFullYear(); // Lấy năm
        return `${day}-${month}-${year}`; // Trả về định dạng ngày-tháng-năm
    });

    const lines: any = {
        labels: dateList || [],
        datasets: [
            {
                label: 'VNINDEX',
                data: data_sets?.map((item: any) => item.vnindex_perform),
                fill: 'origin',
                backgroundColor: 'rgba(2, 91, 196, 0.1)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#025bc4',
                pointRadius: 0, // Tắt các chấm màu xám ở các data label
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Hệ thống T2M',
                data: data_sets?.map((item: any) => item.invest_perform),
                fill: 'origin',
                backgroundColor: 'rgba(192, 49, 199, 0.1)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#C031C7',
                pointRadius: 0, // Tắt các chấm màu xám ở các data label
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone',
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
                enabled: props.ww > 767 ? true : false,
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        return `${tooltipItem?.dataset.label}: ${(tooltipItem?.raw * 100).toFixed(2)}%`;
                    }
                },
                displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
                usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
                bodyFontColor: '#dfdfdf', // Màu chữ của tooltip
                bodyFontSize: parseInt(props?.fontSize) - 4, // Cỡ chữ trong tooltip
                bodyFontStyle: 'bold', // Kiểu chữ trong tooltip
                boxWidth: 10, // Kích thước của ô màu
                caretPadding: 20
            },
            title: {
                display: false,
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
                    font: {
                        size: 10, // Kích thước font chữ cho các nhãn trên trục X
                    },
                },
            },
            y: {
                position: 'right',
                ticks: {
                    color: '#dfdfdf', // Màu của các nhãn trên trục Y
                    callback: function (value: any) {
                        return value * 100 + '%'; // Thêm ký hiệu % vào giá trị hiển thị
                    }
                },
                grid: {
                    display: true,
                    color: '#dfdfdf',
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 0.5 : 0; // Chỉ vẽ đường lưới tại giá trị 0
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
            <div style={{ width: '100%', height: '320px' }}>
                <Line data={lines} options={options} plugins={[customLegendMargin, customTitleMargin]} />
            </div>
        );
    };
}

export default PerformChart;