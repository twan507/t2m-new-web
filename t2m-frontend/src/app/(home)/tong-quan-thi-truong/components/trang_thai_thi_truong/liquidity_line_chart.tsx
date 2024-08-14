import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const LiquidityLineChart = (props: any) => {

    const data_sets = props?.openState ? props?.data?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];

    const timeList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const utcHours = ('0' + date.getUTCHours())?.slice(-2); // Lấy giờ UTC và thêm số 0 nếu cần
        const utcMinutes = ('0' + date.getUTCMinutes())?.slice(-2); // Lấy phút UTC và thêm số 0 nếu cần
        return `${utcHours}:${utcMinutes}`;
    });

    const lines: any = {
        labels: timeList || [],
        datasets: [
            {
                label: 'Giá trị',
                data: data_sets?.map((item: any) => item.liquid_all_stock === null ? null : (item.liquid_all_stock * 100).toFixed(2)),
                fill: 'start',
                backgroundColor: 'rgba(2, 91, 196, 0.3)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#025bc4',
                pointRadius: 0, // Tắt các chấm màu xám ở các data label
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: '100',
                data: new Array(timeList.length).fill(100), // Tạo một mảng có độ dài bằng số lượng nhãn với giá trị 1
                borderWidth: 2,
                pointRadius: 0,
                hoverRadius: 0,
                fill: 'start',
                borderColor: 'rgba(555, 555, 555, 0.6)', // Màu của đường thẳng (tông màu xám)
                backgroundColor: 'rgba(555, 555, 555, 0.15)', // Thêm màu nền cho khu vực dưới đường biểu đồ (tông màu xám nhạt)
                borderDash: [5, 5], // Đường kẻ đứt đoạn
            }
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
                        const label = tooltipItem?.dataset?.label;
                        let value = tooltipItem?.raw;

                        // Bỏ qua việc hiển thị tooltip cho dataset có label là 'Mốc 1%'
                        if (label === '100') {
                            return null;
                        }

                        return ` ${label}: ${value}%`;
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
                min: props?.openState ? undefined : 0,
                max: props?.openState ? undefined : 100,
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
