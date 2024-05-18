import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const LiquidityLineChart = (props: any) => {

    const data_sets = props?.data?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const timeList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const utcHours = ('0' + date.getUTCHours()).slice(-2); // Lấy giờ UTC và thêm số 0 nếu cần
        const utcMinutes = ('0' + date.getUTCMinutes()).slice(-2); // Lấy phút UTC và thêm số 0 nếu cần
        return `${utcHours}:${utcMinutes}`;
    });

    const lines = {
        labels: timeList || [],
        datasets: [
            {
                label: 'Giá trị',
                data: data_sets?.map((item: any) => item.liquid_all_stock === null ? null : (item.liquid_all_stock * 100).toFixed(2)),
                fill: 'start',
                backgroundColor: 'rgba(2, 91, 196, 0.2)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#025bc4',
                pointRadius: 0, // Tắt các chấm màu xám ở các data label
                hoverRadius: 4, // Tăng kích thước khi di chuột tới
                pointBackgroundColor: '#025bc4', // Màu nền cho các điểm
                tension: 0.4, // Đường cong mượt
                borderWidth: 3, // Độ rộng của đường
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false, // Đảm bảo biểu đồ sẽ điều chỉnh kích thước theo container
        plugins: {
            legend: {
                display: false,
                pointStyle: 'circle', // Đặt kiểu điểm thành hình tròn
                usePointStyle: true, // Bảo đảm sử dụng pointStyle cho biểu tượng
            },
            title: {
                display: true,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
                usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
                caretPadding: 20, // Kéo ô tooltip ra xa khỏi điểm dữ liệu một chút
                callbacks: {
                    label: function (tooltipItem: any) {
                        return ` ${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
                    }
                }
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
                },
            },
            y: {
                position: 'right',
                ticks: {
                    stepSize: 20,
                    color: '#dfdfdf', // Màu của các nhãn trên trục Y
                    callback: function (value: number) {
                        return `${value}%`; // Hiển thị dạng phần trăm
                    }
                },
            },
        },
    };

    return (
        <div style={{ width: props?.width, height: props?.height, marginTop: '-15px' }}>
            <Line data={lines} options={options} />
        </div>
    );
};

export default LiquidityLineChart;
