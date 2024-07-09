import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const StockLiquidityLineChart20p = (props: any) => {

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
                label: 'Giá trị',
                data: data_sets?.map((item: any) => item.liquid_ratio === null ? null : (item.liquid_ratio * 100).toFixed(2)),
                fill: 'start',
                backgroundColor: 'rgba(2, 91, 196, 0.2)', // Thêm màu nền cho khu vực dưới đường biểu đồ
                borderColor: '#025bc4',
                pointRadius: 1.4, // Tắt các chấm màu xám ở các data label
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4', // Màu nền cho các điểm
                tension: 0.4, // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
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
                text: 'Diễn biến chỉ số thanh khoản',
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize) - 2,
                    weight: 'bold',
                },
                color: '#dfdfdf'
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        return ` ${tooltipItem?.dataset.label}: ${tooltipItem?.raw}%`;
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
                min: 0,
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
        <div style={{ width: '100%', height: '250px' }}>
            <Line data={lines} options={options} />
        </div>
    );
};

export default StockLiquidityLineChart20p;
