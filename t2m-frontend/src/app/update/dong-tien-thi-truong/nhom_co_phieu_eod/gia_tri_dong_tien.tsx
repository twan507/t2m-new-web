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

const MoneyFlowValueChart = (props: any) => {
    // Sample dataset
    const sampleData = [
        { id: 1, date: 'Hiệu suất A', nn_value: 500, td_value: -200 },
        { id: 1, date: 'Hiệu suất B', nn_value: 300, td_value: 100 },
        { id: 1, date: 'Hiệu suất C', nn_value: -150, td_value: 250 },
        { id: 1, date: 'Hiệu suất D', nn_value: 100, td_value: -300 },
    ];
    
    const data_sets = sampleData.filter(item => item.id === 1);
        
    const data = {
        labels: data_sets.map(item => item.date + '     '),
        datasets: [
            {
                label: 'Giá trị',
                data: data_sets.map(item => item.nn_value), // Sử dụng nn_value từ sample data
                backgroundColor: function (context: any) {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? '#24B75E' : '#e14040';
                },
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Chuyển đổi biểu đồ cột thành biểu đồ cột ngang
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 0, // Độ rộng của hộp màu trong legend
                    boxHeight: 0,
                    padding: 10, // Khoảng cách giữa các mục trong legend
                    pointStyle: 'circle', // Đặt kiểu điểm thành hình tròn
                    usePointStyle: true, // Bảo đảm sử dụng pointStyle cho biểu tượng
                    font: {
                        size: parseInt(props?.fontSize) - 4, // Điều chỉnh cỡ chữ của legend
                        family: 'Calibri', // Điều chỉnh font chữ của legend
                    },
                    color: 'transparent', // Màu chữ của legend đã được chỉnh thành trong suốt
                    borderColor: 'transparent', // Màu viền của hộp đã được chỉnh thành trong suốt
                    backgroundColor: 'transparent' // Màu nền của hộp đã được chỉnh thành trong suốt
                }
            },
            title: {
                display: true,
                text: 'Giá trị dòng tiền',
                padding: {},
                font: {
                    family: 'Calibri, sans-serif',
                    size: 18, // Chỉnh sửa cỡ chữ
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
                    return value > 0 ? 'end' : 'start';
                },
                formatter: (value: any) => Math.round(value).toLocaleString(), // Định dạng giá trị hiển thị
                font: {
                    family: 'Helvetica, sans-serif',
                    size: 11, // Chỉnh sửa cỡ chữ
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
                    display: false,
                },
            },
            y: {
                position: 'left',
                grid: {
                    display: false, // Loại bỏ grid ngang
                },
                ticks: {
                    color: '#dfdfdf', // Màu của các nhãn trên trục X
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

export default MoneyFlowValueChart;
