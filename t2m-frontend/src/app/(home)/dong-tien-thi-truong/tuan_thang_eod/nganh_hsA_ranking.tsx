'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const NganhHsARanking = (props: any) => {

    const data_sets = props?.data?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        return `${day}-${month}`;
    });

    const slice = props?.ww > 767 ? -20 : (props?.ww > 500 ? -13 : -7);

    const lines = {
        labels: dateList?.slice(slice) || [],
        datasets: [
            {
                label: 'Bán lẻ',
                data: data_sets?.map((item: any) => item.ban_le).slice(slice),
                borderColor: '#C031C7',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Bất động sản',
                data: data_sets?.map((item: any) => item.bds).slice(slice),
                fill: 'origin',
                borderColor: '#24B75E',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#24B75E',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Chứng khoán',
                data: data_sets?.map((item: any) => item.chung_khoan).slice(slice),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Tài chính',
                data: data_sets?.map((item: any) => item.tai_chinh).slice(slice),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#D0be0f',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Thép',
                data: data_sets?.map((item: any) => item.thep).slice(slice),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#e14040',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'VLXD',
                data: data_sets?.map((item: any) => item.vlxd).slice(slice),
                fill: 'origin',
                borderColor: '#00cccc',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#00cccc',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Xây dựng',
                data: data_sets?.map((item: any) => item.xd).slice(slice),
                fill: 'origin',
                borderColor: '#999999',
                pointRadius: 1.4,
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
                        size: parseInt(props?.fontSize) - 4,
                        family: 'Calibri',
                    },
                    color: '#dfdfdf'
                }
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
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
                text: props?.ww > 767 ? 'Sức mạnh dòng tiền ngành hiệu suất A' : 'Sức mạnh ngành hiệu suất A',
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
                    display: true,
                    color: '#dfdfdf',
                    font: {
                        size: parseInt(props?.fontSize) - 7
                    },
                },
            },
            y: {
                position: 'right',
                reverse: true,
                min: 0,
                max: 24,
                ticks: {
                    stepSize: 1,
                    color: '#dfdfdf',
                    font: {
                        size: parseInt(props?.fontSize) - 7
                    },
                    callback: function (value: any) {
                        if (value >= 1 && value <= 23) {
                            return value;
                        }
                        return '';
                    }
                },
                grid: {
                    display: false,
                    color: '#dfdfdf',
                    lineWidth: 0.5,
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

export default NganhHsARanking;
