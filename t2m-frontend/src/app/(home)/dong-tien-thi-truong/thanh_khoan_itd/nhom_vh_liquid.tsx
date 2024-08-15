'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const NhomVhLiquidItd = (props: any) => {

    const data_sets = props?.data?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const timeList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const utcHours = ('0' + date.getUTCHours())?.slice(-2);
        const utcMinutes = ('0' + date.getUTCMinutes())?.slice(-2);
        return `${utcHours}:${utcMinutes}`;
    });

    const lines: any = {
        labels: timeList || [],
        datasets: [
            {
                label: 'LARGECAP',
                data: data_sets?.map((item: any) => item.liquid_large === null ? null : item.liquid_large * 100),
                borderColor: '#24B75E',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#24B75E',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'MIDCAP',
                data: data_sets?.map((item: any) => item.liquid_mid === null ? null : item.liquid_mid * 100),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'SMALLCAP',
                data: data_sets?.map((item: any) => item.liquid_small === null ? null : item.liquid_small * 100),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#D0be0f',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'PENNY',
                data: data_sets?.map((item: any) => item.liquid_penny === null ? null : item.liquid_penny * 100),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#e14040',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: '100',
                data: new Array(timeList?.length).fill(100), // Tạo một mảng có độ dài bằng số lượng nhãn với giá trị 1
                borderWidth: 2,
                pointRadius: 0,
                hoverRadius: 0,
                fill: 'start',
                borderColor: 'rgba(555, 555, 555, 0.6)', // Màu của đường thẳng (tông màu xám)
                backgroundColor: 'rgba(555, 555, 555, 0.15)', // Thêm màu nền cho khu vực dưới đường biểu đồ (tông màu xám nhạt)
                borderDash: [5, 5], // Đường kẻ đứt đoạn
            }
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    filter: function (item: any, chart: any) {
                        // Bỏ qua các mục có label là '100'
                        return item.text !== '100';
                    },
                    boxWidth: 20,
                    boxHeight: 6,
                    pointStyle: 'circle',
                    usePointStyle: true,
                    font: {
                        size: parseInt(props?.fontSize) - 6,
                        family: 'Calibri',
                    },
                    color: '#dfdfdf'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        const label = tooltipItem?.dataset?.label;
                        let value = tooltipItem?.raw;

                        // Bỏ qua việc hiển thị tooltip cho dataset có label là 'Mốc 1%'
                        if (label === '100') {
                            return null;
                        }

                        return ` ${label}: ${value.toFixed(2)}%`;
                    }
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',

                boxHeight: 8,
                caretPadding: 20
            },
            title: {
                display: true,
                text: props?.ww > 767 ? 'Diễn biến thanh khoản nhóm vốn hoá' : 'Diễn biến thanh khoản nhóm vốn hoá',
                padding: {},
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize) - 2,
                    weight: 'bold',
                },
                color: '#dfdfdf'
            },
            datalabels: {
                display: false,
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                ticks: {
                    color: '#dfdfdf',
                },
            },
            y: {
                position: 'right',
                ticks: {
                    color: '#dfdfdf',
                    callback: function (value: any) {
                        return `${value}%`;
                    }
                },
                grid: {
                    display: true,
                    color: '#333333',
                    lineWidth: 1
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
            <div style={{ width: '100%', height: props.ww > 470 ? props?.height : `calc(${props?.height} + 50px)` }}>
                <Line data={lines} options={options} />
            </div>
        );
    }

    return null;
}

export default NhomVhLiquidItd;
