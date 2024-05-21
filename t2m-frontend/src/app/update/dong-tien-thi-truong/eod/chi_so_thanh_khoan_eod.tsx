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

const MoneyFlowLiquidityChart = (props: any) => {

    // const sampleData = [
    //     { name: 'Hiệu suất A', liquidity: 0.8 },
    //     { name: 'Hiệu suất B', liquidity: 1.6 },
    //     { name: 'Hiệu suất C', liquidity: 0.6 },
    //     { name: 'Hiệu suất D', liquidity: 0.9 },
    // ];
    // const data_sets = sampleData
    const data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.order - b.order)

    const data = {
        labels: data_sets?.map((item: any) => item.name),
        datasets: [
            {
                label: 'Giá trị',
                data: data_sets?.map((item: any) => item.liquidity), // Sử dụng nn_value từ sample data
                backgroundColor: function (context: any) {
                    const value = context.dataset.data[context.dataIndex] * 100;
                    if (value < 60) return '#00cccc';
                    if (value < 90) return '#e14040';
                    if (value < 120) return '#D0be0f';
                    if (value < 150) return '#24B75E';
                    return '#C031C7';
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
                right: props?.ww > 768 ? 50 : 0
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
                            return `${tooltipItem?.dataset.label}: ${(tooltipItem?.raw * 100)?.toFixed(1)}%`;
                        } else {
                            return `${(tooltipItem?.raw * 100)?.toFixed(1)}%`;
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
                text: props?.ww > 768 ? 'Chỉ số thanh khoản' : 'Thanh khoản',
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
                formatter: (value: any) => `${(value * 100)?.toFixed(1)}%`, // Định dạng giá trị hiển thị
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
                <div style={{ height: props?.ww > 768 ? '200px' : '150px', width: '100%' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default MoneyFlowLiquidityChart;
