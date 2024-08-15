'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const NganhHsBLiquidItd = (props: any) => {

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
                label: 'Công nghiệp',
                data: data_sets?.map((item: any) => item.liquid_cong_nghiep === null ? null : item.liquid_cong_nghiep * 100),
                borderColor: '#C031C7',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Dầu khí',
                data: data_sets?.map((item: any) => item.liquid_dau_khi === null ? null : item.liquid_dau_khi * 100),
                fill: 'origin',
                borderColor: '#24B75E',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#24B75E',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Dệt may',
                data: data_sets?.map((item: any) => item.liquid_det_may === null ? null : item.liquid_det_may * 100),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Hoá chất',
                data: data_sets?.map((item: any) => item.liquid_hoa_chat === null ? null : item.liquid_hoa_chat * 100),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#D0be0f',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Khoáng sản',
                data: data_sets?.map((item: any) => item.liquid_khoang_san === null ? null : item.liquid_khoang_san * 100),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#e14040',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Thuỷ sản',
                data: data_sets?.map((item: any) => item.liquid_thuy_san === null ? null : item.liquid_thuy_san * 100),
                fill: 'origin',
                borderColor: '#00cccc',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#00cccc',
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
                text: props?.ww > 767 ? 'Diễn biến thanh khoản nhóm ngành B' : 'Diễn biến thanh khoản nhóm ngành B',
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

export default NganhHsBLiquidItd;
