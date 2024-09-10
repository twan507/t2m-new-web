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

function replaceOpenValue(array: any) {
    return array.map((item: any) => {
        const newItem: any = { name: item.name };
        Object.keys(item).forEach((key: any) => {
            if (key !== 'name') {
                newItem[key] = 0;
            }
        });
        return newItem;
    });
}

const MoneyFlowBreathChart = (props: any): any => {

    let data_sets: any
    if (props?.type === 'industry') {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.industry_rank - b.industry_rank)
    } else {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.order - b.order)
    }

    if (props.openState === false) {
        if (props?.group === 'cap') {
            data_sets = replaceOpenValue(data_sets)
        } else {
            data_sets = replaceOpenValue(data_sets).sort((a: any, b: any) => a.name.localeCompare(b.name))
        }
    }

    // Chuẩn hóa dữ liệu thành phần trăm
    const normalizedData = data_sets?.map((item: any) => {
        const total = parseInt(item.in_flow) + parseInt(item.out_flow);
        return {
            name: item.name,
            in_flow: (item.in_flow / total) * 100,
            out_flow: (item.out_flow / total) * 100,
        };
    });

    const data = {
        labels: normalizedData?.map((item: any) => item.name),
        datasets: [
            {
                label: 'Tiền vào',
                data: normalizedData?.map((item: any) => item.in_flow), // Sử dụng in_flow từ sample data
                backgroundColor: '#24B75E',
            },
            {
                label: 'Tiền ra',
                data: normalizedData?.map((item: any) => item.out_flow), // Sử dụng out_flow từ sample data
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
                display: props?.ww > 576 ? true : false,
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
                text: props?.ww > 1100 ? 'Độ rộng dòng tiền' : 'Độ rộng DT',
                padding: {
                    bottom: props?.ww > 576 ? 0 : 15
                },
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize) - 2, // Chỉnh sửa cỡ chữ
                    weight: 'bold', // Chỉnh sửa kiểu chữ
                },
                color: '#dfdfdf' // Chỉnh sửa màu chữ
            },
            tooltip: {
                enabled: props.ww > 767 ? true : false,
                callbacks: {
                    label: function (tooltipItem: any) {
                        if (props?.ww > 991) {
                            return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(1)}%`;
                        } else {
                            return `${tooltipItem?.raw?.toFixed(1)}%`;
                        }
                    }
                },
                displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
                usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
                bodyFontColor: '#dfdfdf', // Màu chữ của tooltip
                boxWidth: 10, // Kích thước của ô màu
            },
            datalabels: {
                display: true,
                anchor: 'center',
                align: 'center',
                formatter: (value: any) => value > (props?.ww > 991 ? 20 : 35) ? (value.toFixed(1) + '%') : '', // Định dạng giá trị hiển thị
                font: {
                    family: 'Helvetica, sans-serif',
                    size: props?.ww > 991 ? parseInt(props?.fontSize) - 7 : parseInt(props?.fontSize) - 6, // Chỉnh sửa cỡ chữ
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
                <div style={{ height: props?.height, width: '100%', marginLeft: props?.ww > 991 ? '-20px' : '-10px' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default MoneyFlowBreathChart;
