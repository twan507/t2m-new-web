'use client'
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
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

const MoneyFlowBreathChart = (props: any) => {
    const sampleData = [
        { date: '2023-05-01', nn_value: 500, td_value: 200 },
        { date: '2023-05-02', nn_value: 300, td_value: 100 },
        { date: '2023-05-03', nn_value: 150, td_value: 250 },
        { date: '2023-05-04', nn_value: 100, td_value: 300 },
    ];

    // Chuẩn hóa dữ liệu thành phần trăm
    const normalizedData = sampleData.map(item => {
        const total = item.nn_value + item.td_value;
        return {
            date: item.date,
            nn_value: (item.nn_value / total) * 100,
            td_value: (item.td_value / total) * 100,
        };
    });

    const dateList = normalizedData.map(item => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        return `${day}-${month}`;
    });

    const data = {
        labels: dateList,
        datasets: [
            {
                label: 'Tiền vào',
                data: normalizedData.map(item => item.nn_value), // Sử dụng nn_value từ sample data
                backgroundColor: '#24B75E',
            },
            {
                label: 'Tiền ra',
                data: normalizedData.map(item => item.td_value), // Sử dụng td_value từ sample data
                backgroundColor: '#e14040',
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Chuyển đổi biểu đồ cột thành biểu đồ cột ngang
        layout: {
            margin: {
                top: -5,
            }
        },
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
            title: {
                display: true,
                text: 'Độ rộng dòng tiền',
                padding: {},
                font: {
                    family: 'Calibri, sans-serif',
                    size: 18, // Chỉnh sửa cỡ chữ
                    weight: 'bold', // Chỉnh sửa kiểu chữ
                },
                color: '#dfdfdf' // Chỉnh sửa màu chữ
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem?.raw?.toFixed(2)}%`;
                    }
                },
                displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
                usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
                bodyFontColor: '#dfdfdf', // Màu chữ của tooltip
                bodyFontSize: parseInt(props?.fontSize) - 4, // Cỡ chữ trong tooltip
                bodyFontStyle: 'bold', // Kiểu chữ trong tooltip
                boxWidth: 10, // Kích thước của ô màu
            },
            datalabels: {
                display: true,
                anchor: 'center',
                align: 'center',
                formatter: (value: any) => value.toFixed(2) + '%', // Định dạng giá trị hiển thị
                font: {
                    family: 'Helvetica, sans-serif',
                    size: 11, // Chỉnh sửa cỡ chữ
                },
                color: '#ffffff',
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false, // Loại bỏ grid dọc
                },
                ticks: {
                    display: false,
                },
            },
            y: {
                stacked: true,
                grid: {
                    display: false, // Loại bỏ grid ngang
                },
                ticks: {
                    display: false,
                },
            },
        },
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <>
                <div style={{ height: '200px', width: '100%' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default MoneyFlowBreathChart;
