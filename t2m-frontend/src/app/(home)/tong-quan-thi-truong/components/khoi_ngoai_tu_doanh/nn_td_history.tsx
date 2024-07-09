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

const NnTdHispory = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.id === props?.id)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        return `${day}-${month}`;
    });

    const slice = props?.ww > 767 ? -20 : (props?.ww > 576 ? -10 : (props?.ww > 400 ? -6 : -4));

    const data = {
        labels: dateList.slice(slice) || [],
        datasets: [
            {
                label: 'Giá trị',
                data: props?.switch_kntd === 'NN' ? data_sets?.map((item: any) => item.nn_value).slice(slice) : data_sets?.map((item: any) => item.td_value).slice(slice),
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
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: props.ww > 767 ? 'Lịch sử mua/bán ròng' : 'Lịch sử mua/bán ròng',
                padding: {
                    bottom: 20, // Tăng khoảng cách phía dưới tiêu đề
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
                        return `${tooltipItem?.dataset?.label}: ${Math.round(tooltipItem?.raw)} Tỷ`;
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
                display: true,
                anchor: (context: any) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? 'end' : 'start';
                },
                align: (context: any) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? 'top' : 'bottom';
                },
                formatter: (value: any) => Math.round(value).toLocaleString(), // Định dạng giá trị hiển thị
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
                    color: '#dfdfdf', // Màu của các nhãn trên trục X
                    padding: 15, // Khoảng cách giữa các nhãn và trục x
                    font: {
                        family: 'Helvetica, sans-serif',
                        size: parseInt(props?.fontSize) - 7, // Chỉnh sửa cỡ chữ
                    },
                },
            },
            y: {
                position: 'right',
                grid: {
                    display: false, // Loại bỏ grid ngang
                },
                ticks: {
                    color: '#dfdfdf', // Màu của các nhãn trên trục X
                    font: {
                        family: 'Helvetica, sans-serif',
                        size: parseInt(props?.fontSize) - 7, // Chỉnh sửa cỡ chữ
                    },
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
                    <Bar data={data} options={options} />;
                </div>
            </>
        )
    }
};

export default NnTdHispory;