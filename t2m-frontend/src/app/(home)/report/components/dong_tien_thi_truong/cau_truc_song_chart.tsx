import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const MarketStructureChart = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.name === 'Thị trường')
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        return `${day}-${month}`;
    });

    const slice = props?.ww > 767 ? -60 : (props?.ww > 500 ? -40 : -20);

    const lines: any = {
        labels: dateList?.slice(slice) || [],
        datasets: [
            {
                label: 'Tuần',
                data: data_sets?.map((item: any) => item.trend_5p * 100).slice(slice),
                borderColor: '#C031C7',
                pointRadius: 1.4,
                hoverRadius: 5, // Tăng kích thước khi di chuột tới
                pointBackgroundColor: '#C031C7', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Tháng',
                data: data_sets?.map((item: any) => item.trend_20p * 100).slice(slice),
                fill: 'origin',
                borderColor: '#24B75E',
                pointRadius: 1.4,
                hoverRadius: 5, // Tăng kích thước khi di chuột tới
                pointBackgroundColor: '#24B75E', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Quý',
                data: data_sets?.map((item: any) => item.trend_60p * 100).slice(slice),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 1.4,
                hoverRadius: 5, // Tăng kích thước khi di chuột tới
                pointBackgroundColor: '#025bc4', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Bán niên',
                data: data_sets?.map((item: any) => item.trend_120p * 100).slice(slice),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 1.4,
                hoverRadius: 5, // Tăng kích thước khi di chuột tới
                pointBackgroundColor: '#D0be0f', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: '1 Năm',
                data: data_sets?.map((item: any) => item.trend_240p * 100).slice(slice),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 1.4,
                hoverRadius: 5, // Tăng kích thước khi di chuột tới
                pointBackgroundColor: '#e14040', // Màu nền cho các điểm
                cubicInterpolationMode: 'monotone', // Đường cong mượt
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: '2 Năm',
                data: data_sets?.map((item: any) => item.trend_480p * 100).slice(slice),
                fill: 'origin',
                borderColor: '#b3b3b3',
                pointRadius: 1.4,
                hoverRadius: 5, // Tăng kích thước khi di chuột tới
                pointBackgroundColor: '#b3b3b3', // Màu nền cho các điểm
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
                        return `${tooltipItem?.dataset?.label}: ${tooltipItem?.raw?.toFixed(2)}%`;
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
                boxHeight: 8, // Kích thước của ô màu
                caretPadding: 20
            },
            title: {
                display: true,
                text: '',
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
                },
            },
            y: {
                position: 'right',
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: '#dfdfdf', // Màu của các nhãn trên trục Y
                    callback: function (value: number) {
                        return `${value}%`; // Hiển thị dạng phần trăm
                    }
                },
                grid: {
                    display: true,
                    color: '#dfdfdf', // Màu của grid line
                    lineWidth: 0.5, // Độ dày của grid line
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
            <div style={{ width: '100%', height: '390px', marginTop: '-20px' }}>
                <Line data={lines} options={options} />
            </div>
        );
    }
}

export default MarketStructureChart;
