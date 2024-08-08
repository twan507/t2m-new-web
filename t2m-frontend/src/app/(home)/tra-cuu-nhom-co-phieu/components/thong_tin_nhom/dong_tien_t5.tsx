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
    ChartDataLabels // Register the datalabels plugin
);

const name_dict: any = {
    'hs': 'nhóm hiệu suất',
    'cap': 'nhóm vốn hoá',
    'A': 'ngành hiệu suất A',
    'B': 'ngành hiệu suất B',
    'C': 'ngành hiệu suất C',
    'D': 'ngành hiệu suất D',
}

const GroupMoneyFlowT5Chart = (props: any) => {

    const data_sets = props?.data

    const data = {
        labels: data_sets?.map((item: any) => item.name),
        datasets: [
            {
                label: 'T-0',
                data: data_sets?.map((item: any) => item['T-0']),
                backgroundColor: '#C031C7',
                maxBarThickness: 22
            },
            {
                label: 'T-1',
                data: data_sets?.map((item: any) => item['T-1']),
                backgroundColor: '#24B75E',
                maxBarThickness: 22
            },
            {
                label: 'T-2',
                data: data_sets?.map((item: any) => item['T-2']),
                backgroundColor: '#025bc4',
                maxBarThickness: 22
            },
            {
                label: 'T-3',
                data: data_sets?.map((item: any) => item['T-3']),
                backgroundColor: '#D0be0f',
                maxBarThickness: 22
            },
            {
                label: 'T-4',
                data: data_sets?.map((item: any) => item['T-4']),
                backgroundColor: '#e14040',
                maxBarThickness: 22
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                // display: props?.ww > 767 ? true : false,
                display: true,
                position: 'top',
                labels: {
                    boxWidth: props.ww > 767 ? 6 : 4, // Width of the color box in legend
                    boxHeight: props.ww > 767 ? 8 : 5,
                    padding: props.ww > 767 ? 8 : 5, // Spacing between items in legend
                    pointStyle: 'circle', // Set point style to circle
                    usePointStyle: true, // Ensure use of pointStyle for symbol
                    font: {
                        size: parseInt(props?.fontSize), // Adjust font size of legend
                        family: 'Calibri', // Adjust font family of legend
                    },
                    color: '#dfdfdf' // Font color of legend
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        if (props?.ww > 767) {
                            return `Phiên ${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(2)}`;
                        } else {
                            return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(2)}`;
                        }
                    },
                    title: function (tooltipItems: any) {
                        return `Dòng tiền trong ngày`;
                    },
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                boxWidth: 10,
            },
            title: {
                display: false,
                text: `Dòng tiền ${name_dict[props?.group]}`,
                padding: {
                    bottom: 0, // Giảm khoảng cách phía dưới tiêu đề
                },
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize),
                    weight: 'bold',
                },
                color: '#dfdfdf'
            },
            datalabels: {
                display: false,
            },
        },
        scales: {
            x: {
                display: true,
                stacked: true,
                grid: {
                    display: true,
                    color: '#dfdfdf',
                    drawTicks: false,
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 3 : 0;
                    },
                },
                ticks: {
                    stepSize: 1,
                    display: true,
                    color: '#dfdfdf',
                    font: {
                        size: parseInt(props?.fontSize) - 1
                    },
                    callback: function (value: any) {
                        if (value === 0) {
                            return value;
                        }
                        return null;
                    }
                }
            },
            y: {
                stacked: true,
                position: 'left',
                grid: {
                    display: false,
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
                <div style={{ height: props?.height, width: '100%', marginTop: props.ww > 767 ? '10px' : '5px' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default GroupMoneyFlowT5Chart;
