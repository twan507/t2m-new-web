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

const MoneyFlowT5Chart = (props: any) => {

    let data_sets: any;
    if (props?.type === 'industry') {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.index - b.index);
    } else {
        data_sets = props?.data?.filter((item: any) => item.group === props?.group).sort((a: any, b: any) => a.index - b.index);
    }


    const industry_data_sets = props?.data?.filter((item: any) => ['A', 'B', 'C', 'D'].includes(item.group));
    const minIndustryScore = industry_data_sets.reduce((min: any, current: any) => current?.score < min ? current?.score : min, industry_data_sets?.[0]?.score);
    const maxIndustryScore = industry_data_sets.reduce((max: any, current: any) => current?.score > max ? current?.score : max, industry_data_sets?.[0]?.score);

    const data = {
        labels: data_sets?.map((item: any) => props?.ww > 768 ? (item.name + '        ') : item.name),
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
        layout: {
            padding: {
                right: props?.ww > 768 ? 40 : 0,
            }
        },
        plugins: {
            legend: {
                display: props?.ww > 768 ? true : false,
                position: 'top',
                labels: {
                    boxWidth: 20, // Width of the color box in legend
                    boxHeight: 8,
                    padding: 10, // Spacing between items in legend
                    pointStyle: 'circle', // Set point style to circle
                    usePointStyle: true, // Ensure use of pointStyle for symbol
                    font: {
                        size: parseInt(props?.fontSize) - 4, // Adjust font size of legend
                        family: 'Calibri', // Adjust font family of legend
                    },
                    color: '#dfdfdf' // Font color of legend
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        if (props?.ww > 768) {
                            return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(2)}`;
                        } else {
                            return `${tooltipItem?.raw?.toFixed(2)}`;
                        }
                    }
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                bodyFontSize: parseInt(props?.fontSize) - 4,
                bodyFontStyle: 'bold',
                boxWidth: 10,
            },
            title: {
                display: true,
                text: props?.ww > 768 ? 'Giá trị dòng tiền' : 'Dòng tiền',
                padding: {
                    bottom: props?.ww > 768 ? 0 : 15
                },
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
        scales: {
            x: {
                stacked: true,
                min: props?.type === 'industry' ? minIndustryScore : null,
                max: props?.type === 'industry' ? maxIndustryScore : null,
                grid: {
                    display: true,
                    color: '#dfdfdf',
                    drawTicks: false,
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 2 : 0; // Draw grid line only at value 0
                    },
                },
                ticks: {
                    display: true,
                    color: '#dfdfdf'
                },
            },
            y: {
                stacked: true,
                position: 'left',
                grid: {
                    display: false,
                },
                ticks: {
                    display: props?.ww > 400 ? true : false,
                    color: '#dfdfdf',
                    font: {
                        size: parseInt(props?.fontSize) - 7
                    }
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
                <div style={{ height: props?.height, width: '100%' }}>
                    <Bar data={data} options={options} />
                </div>
            </>
        )
    }
};

export default MoneyFlowT5Chart;
