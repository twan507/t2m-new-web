'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const GroupRankingChart = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.group_name === props?.select_group)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        return `${day}-${month}`;
    });

    const lines = {
        labels: dateList || [],
        datasets: [
            {
                label: props?.select_group,
                data: data_sets?.map((item: any) => item.rank),
                borderColor: '#C031C7',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                cubicInterpolationMode: 'monotone',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
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
                text: props?.ww > 767 ? `Sức mạnh dòng tiền nhóm ${props?.select_group}` : `Nhóm ${props?.select_group}`,
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
                max: props?.switch_group_industry === 'group' ? 5 : 24,
                ticks: {
                    stepSize: 1,
                    color: '#dfdfdf',
                    callback: function (value: any) {
                        const maxValue = props?.switch_group_industry === 'group' ? 4 : 23;
                        if (value >= 1 && value <= maxValue) {
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
            <div style={{ width: '100%', height: '250px' }}>
                <Line data={lines} options={options} />
            </div>
        );
    }

    return null;
}

export default GroupRankingChart;
