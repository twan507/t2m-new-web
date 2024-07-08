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

const MoneyFlowValueChart = (props: any) => {

    let data_sets: any
    if (props?.type === 'industry') {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.index - b.index)
    } else {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.order - b.order)
    }

    const industry_data_sets = props?.data?.filter((item: any) => ['A', 'B', 'C', 'D'].includes(item.group))
    const minIndustryScore = industry_data_sets?.reduce((min: any, current: any) => current?.score < min ? current?.score : min, industry_data_sets?.[0]?.score);
    const maxIndustryScore = industry_data_sets?.reduce((max: any, current: any) => current?.score > max ? current?.score : max, industry_data_sets?.[0]?.score);

    const data = {
        labels: data_sets?.map((item: any) => props?.ww > 767 ? (item.name + '        ') : item.name),
        datasets: [
            {
                label: 'Giá trị',
                data: data_sets?.map((item: any) => item.score), // Sử dụng nn_value từ sample data
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
                right: props?.ww > 767 ? 50 : 30,
            }
        },
        plugins: {
            legend: {
                display: props?.ww > 767 ? true : false,
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
                        if (props?.ww > 767) {
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
                text: props?.ww > 767 ? `Dòng tiền ${name_dict[props?.group]}` : `Dòng tiền ${name_dict[props?.group]}`,
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
                formatter: (value: any) => ((value > 0.01) || (value < -0.01)) ? value?.toFixed(2) : '', // Định dạng giá trị hiển thị
                font: {
                    family: 'Helvetica, sans-serif',
                    size: props?.ww > 767 ? parseInt(props?.fontSize) - 7 : parseInt(props?.fontSize) - 6, // Chỉnh sửa cỡ chữ
                },
                color: '#dfdfdf',
            },
        },
        scales: {
            x: {
                min: props?.type === 'industry' ? (props.ww > 767 ? minIndustryScore : minIndustryScore - 3) : null,
                max: props?.type === 'industry' ? (props.ww > 767 ? maxIndustryScore : maxIndustryScore) : null,
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
                    display: true,
                    color: '#dfdfdf',
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
                <div style={{ height: props?.height, width: '100%' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default MoneyFlowValueChart;
