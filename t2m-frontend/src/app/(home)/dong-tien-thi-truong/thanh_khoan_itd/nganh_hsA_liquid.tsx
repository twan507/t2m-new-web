'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const NganhHsALiquidItd = (props: any) => {

    const data_sets = props?.data?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const timeList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const utcHours = ('0' + date.getUTCHours()).slice(-2);
        const utcMinutes = ('0' + date.getUTCMinutes()).slice(-2);
        return `${utcHours}:${utcMinutes}`;
    });

    const lines = {
        labels: timeList || [],
        datasets: [
            {
                label: 'Bán lẻ',
                data: data_sets?.map((item: any) => item.liquid_ban_le === null ? null : item.liquid_ban_le * 100),
                borderColor: '#C031C7',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Bất động sản',
                data: data_sets?.map((item: any) => item.liquid_bds === null ? null : item.liquid_bds * 100),
                fill: 'origin',
                borderColor: '#24B75E',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#24B75E',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Chứng khoán',
                data: data_sets?.map((item: any) => item.liquid_chung_khoan === null ? null : item.liquid_chung_khoan * 100),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Tài chính',
                data: data_sets?.map((item: any) => item.liquid_tai_chinh === null ? null : item.liquid_tai_chinh * 100),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#D0be0f',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Thép',
                data: data_sets?.map((item: any) => item.liquid_thep === null ? null : item.liquid_thep * 100),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#e14040',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'VLXD',
                data: data_sets?.map((item: any) => item.liquid_vlxd === null ? null : item.liquid_vlxd * 100),
                fill: 'origin',
                borderColor: '#00cccc',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#00cccc',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Xây dựng',
                data: data_sets?.map((item: any) => item.liquid_xd === null ? null : item.liquid_xd * 100),
                fill: 'origin',
                borderColor: '#999999',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#999999',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: props?.ww > 767 ? true : false,
                position: 'top',
                labels: {
                    boxWidth: 20,
                    boxHeight: 6,
                    // padding: 10,
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
                        return `${tooltipItem?.dataset?.label}: ${tooltipItem?.raw?.toFixed(2)}%`;
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
            title: {
                display: true,
                text: props?.ww > 767 ? 'Diễn biến thanh khoản nhóm ngành A' : 'TK nhóm ngành A',
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
                    display: false,
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
            <div style={{ width: '100%', height: props?.height }}>
                <Line data={lines} options={options} />
            </div>
        );
    }

    return null;
}

export default NganhHsALiquidItd;
