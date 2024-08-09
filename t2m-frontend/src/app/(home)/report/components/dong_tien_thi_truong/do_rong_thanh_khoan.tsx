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

const name_dict: any = {
    'hs': 'nhóm hiệu suất',
    'cap': 'nhóm vốn hoá',
    'A': 'ngành hiệu suất A',
    'B': 'ngành hiệu suất B',
    'C': 'ngành hiệu suất C',
    'D': 'ngành hiệu suất D',
}

const LiquidityBreathChart = (props: any): any => {

    let data_sets: any
    if (props?.type === 'industry') {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.industry_rank - b.industry_rank)
    } else {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.order - b.order)
    }

    // Chuẩn hóa dữ liệu thành phần trăm
    const normalizedData = data_sets?.map((item: any) => {
        const total_flow = parseInt(item.in_flow) + parseInt(item.out_flow);
        const total_liquid = parseInt(item.liquid_up) + parseInt(item.liquid_down);
        return {
            name: item.name,
            in_flow: (item.in_flow / total_flow) * 100,
            out_flow: (item.out_flow / total_flow) * 100,
            liquid_up: (item.liquid_up / total_liquid) * 100,
            liquid_down: (item.liquid_down / total_liquid) * 100,
        };
    });

    const data = {
        labels: normalizedData?.map((item: any) => item.name),
        datasets: [
            {
                label: 'Cao',
                data: normalizedData?.map((item: any) => item.liquid_up), // Sử dụng in_flow từ sample data
                backgroundColor: '#24B75E',
            },
            {
                label: 'Thấp',
                data: normalizedData?.map((item: any) => item.liquid_down), // Sử dụng out_flow từ sample data
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
                display: false,
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
                text: `Độ rộng dòng tiền`,
                padding: {
                    bottom: props?.ww > 767 ? 0 : 15
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
                        if (props?.ww > 767) {
                            return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(1)}%`;
                        } else {
                            return `${tooltipItem?.raw?.toFixed(1)}%`;
                        }
                    }
                },
                displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
                usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
                bodyFontColor: '#dfdfdf', // Màu chữ của tooltip

                // Kiểu chữ trong tooltip
                boxWidth: 10, // Kích thước của ô màu
            },
            datalabels: {
                display: props?.ww > 767 ? true : false,
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
                min: 0,
                max: 100,
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
                <div style={{ height: props?.height, width: '100%', marginLeft: props?.ww > 767 ? '-20px' : '-10px' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default LiquidityBreathChart;
