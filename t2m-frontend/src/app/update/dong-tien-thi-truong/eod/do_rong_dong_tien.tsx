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

const MoneyFlowBreathChart = (props: any): any => {

    // const data_sets = [
    //     { name: '2023-05-01', in_flow: 768, out_flow: 200 },
    //     { name: '2023-05-02', in_flow: 300, out_flow: 100 },
    //     { name: '2023-05-03', in_flow: 150, out_flow: 250 },
    //     { name: '2023-05-04', in_flow: 300, out_flow: 69 },
    // ];

    const data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.order - b.order)


    // Chuẩn hóa dữ liệu thành phần trăm
    const normalizedData = data_sets.map((item: any) => {
        const total = parseInt(item.in_flow) + parseInt(item.out_flow);
        return {
            name: item.name,
            in_flow: (item.in_flow / total) * 100,
            out_flow: (item.out_flow / total) * 100,
        };
    });

    const data = {
        labels: normalizedData.map((item: any) => item.name),
        datasets: [
            {
                label: 'Tiền vào',
                data: normalizedData.map((item: any) => item.in_flow), // Sử dụng in_flow từ sample data
                backgroundColor: '#24B75E',
            },
            {
                label: 'Tiền ra',
                data: normalizedData.map((item: any) => item.out_flow), // Sử dụng out_flow từ sample data
                backgroundColor: '#e14040',
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Chuyển đổi biểu đồ cột thành biểu đồ cột ngang
        plugins: {
            legend: {
                display: props?.ww > 768 ? true : false,
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
                text: props?.ww > 768 ? 'Độ rộng dòng tiền' : 'Độ rộng',
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
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        if (props?.ww > 768) {
                            return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(1)}%`;
                        } else {
                            return `${tooltipItem?.raw?.toFixed(1)}%`;
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
            datalabels: {
                display: props?.ww > 768 ? true : false,
                anchor: 'center',
                align: 'center',
                formatter: (value: any) => value > 20 ? (value.toFixed(1) + '%') : '', // Định dạng giá trị hiển thị
                font: {
                    family: 'Helvetica, sans-serif',
                    size: parseInt(props?.fontSize) - 7, // Chỉnh sửa cỡ chữ
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
                <div style={{ height: props?.ww > 768 ? '200px' : '150px', width: '100%', marginLeft: props?.ww > 768 ? '-20px' : '-10px' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default MoneyFlowBreathChart;
