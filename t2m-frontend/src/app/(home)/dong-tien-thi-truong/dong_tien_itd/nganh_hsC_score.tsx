'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const NganhHsCScoreItd = (props: any) => {

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
                label: 'BĐS KCN',
                data: data_sets?.map((item: any) => item.score_bds_kcn),
                borderColor: '#C031C7',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'Công nghệ',
                data: data_sets?.map((item: any) => item.score_cong_nghe),
                fill: 'origin',
                borderColor: '#24B75E',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#24B75E',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'Hàng tiêu dùng',
                data: data_sets?.map((item: any) => item.score_htd),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'Ngân hàng',
                data: data_sets?.map((item: any) => item.score_ngan_hang),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#D0be0f',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'Thực phẩm',
                data: data_sets?.map((item: any) => item.score_thuc_pham),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#e14040',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 3 : 2,
            },
            {
                label: 'Vận tải',
                data: data_sets?.map((item: any) => item.score_van_tai),
                fill: 'origin',
                borderColor: '#00cccc',
                pointRadius: 0,
                hoverRadius: 5,
                pointBackgroundColor: '#00cccc',
                tension: 0.4,
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
                        size: parseInt(props?.fontSize) - 6,
                        family: 'Calibri',
                    },
                    color: '#dfdfdf'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem?.dataset?.label}: ${tooltipItem?.raw?.toFixed(2)}`;
                    }
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                bodyFontSize: parseInt(props?.fontSize) - 6,
                bodyFontStyle: 'bold',
                boxHeight: 8,
                caretPadding: 20
            },
            title: {
                display: true,
                text: props?.ww > 767 ? 'Diễn biến dòng tiền nhóm ngành C' : 'DT nhóm ngành C',
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
                },
                grid: {
                    display: true,
                    color: '#dfdfdf',
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 1 : 0; // Draw grid line only at value 0
                    },
                },
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

export default NganhHsCScoreItd;