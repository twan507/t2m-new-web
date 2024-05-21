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

    // const sampleData = [
    //     { name: 'Hiệu suất A', score: 0.8 },
    //     { name: 'Hiệu suất B', score: 10.6 },
    //     { name: 'Hiệu suất C', score: -0.6 },
    //     { name: 'Hiệu suất D', score: 5.9 },
    // ];
    // const data_sets = sampleData

    const data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.order - b.order)

    const data = {
        labels: data_sets?.map((item: any) => props?.ww > 768 ? (item.name + '     ') : item.name),
        datasets: [
            {
                label: 'Giá trị',
                data: data_sets.map((item: any) => item.score), // Sử dụng nn_value từ sample data
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
        layout: {
            padding: {
                right: props?.ww > 768 ? 40 : 0
            }
        },
        plugins: {
            legend: {
                display: props?.ww > 768 ? true : false,
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
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        if (props?.ww > 768) {
                            return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(2)}`;
                        } else {
                            return `${tooltipItem?.raw?.toFixed(2)}`;
                        }
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
                text: props?.ww > 768 ? 'Giá trị dòng tiền' : 'Dòng tiền',
                padding: {
                    bottom: props?.ww > 768 ? 0 : 15
                },
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize) - 2, // Chỉnh sửa cỡ chữ
                    weight: 'bold', // Chỉnh sửa kiểu chữ
                },
                color: '#dfdfdf' // Chỉnh sửa màu chữ
            },
            datalabels: {
                display: props?.ww > 768 ? true : false,
                anchor: (context: any) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? 'end' : 'start';
                },
                align: (context: any) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? 'end' : 'start';
                },
                formatter: (value: any) => value?.toFixed(2), // Định dạng giá trị hiển thị
                font: {
                    family: 'Helvetica, sans-serif',
                    size: parseInt(props?.fontSize) - 7, // Chỉnh sửa cỡ chữ
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
                    display: props?.ww > 400 ? true : false,
                    color: '#dfdfdf', // Màu của các nhãn trên trục X
                    font: {
                        size: parseInt(props?.fontSize) - 7
                    }
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
                <div style={{ height: props?.ww > 768 ? '200px' : '150px', width: '100%' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default MoneyFlowValueChart;
