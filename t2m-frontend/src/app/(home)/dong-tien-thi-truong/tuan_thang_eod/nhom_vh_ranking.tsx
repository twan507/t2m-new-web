'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const NhomVhRanking = (props: any) => {

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
                label: 'LARGECAP',
                data: data_sets?.map((item: any) => item.large).slice(slice),
                borderColor: '#24B75E',
                pointRadius: 2,
                hoverRadius: 7,
                pointBackgroundColor: '#24B75E',
                tension: 0,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'MIDCAP',
                data: data_sets?.map((item: any) => item.mid).slice(slice),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 2,
                hoverRadius: 7,
                pointBackgroundColor: '#025bc4',
                tension: 0,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'SMALLCAP',
                data: data_sets?.map((item: any) => item.small).slice(slice),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 2,
                hoverRadius: 7,
                pointBackgroundColor: '#D0be0f',
                tension: 0,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'PENNY',
                data: data_sets?.map((item: any) => item.penny).slice(slice),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 2,
                hoverRadius: 7,
                pointBackgroundColor: '#e14040',
                tension: 0,
                borderWidth: props?.ww > 767 ? 3 : 2,
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
                bodyFontSize: parseInt(props?.fontSize) - 4,
                bodyFontStyle: 'bold',
                boxHeight: 8,
                caretPadding: 20
            },
            title: {
                display: true,
                text: props?.ww > 767 ? 'Sức mạnh dòng tiền nhóm vốn hoá' : 'Sức mạnh nhóm vốn hoá',
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
                reverse: true,
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1,
                    color: '#dfdfdf',
                    callback: function (value: any) {
                        if (value >= 1 && value <= 4) {
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

export default NhomVhRanking;
