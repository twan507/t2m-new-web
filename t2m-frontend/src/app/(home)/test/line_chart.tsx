import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    Plugin,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
);

const customLegendMargin: Plugin = {
    id: 'customLegendMargin',
    beforeInit(chart: any) {
        const originalFit = chart.legend.fit;
        chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)();
            this.height += 30; // Adjust this value as needed
        };
    },
};

const customTitleMargin: Plugin = {
    id: 'customTitleMargin',
    beforeInit(chart: any) {
        if (chart.title && chart.title.draw) {
            const originalDraw = chart.title.draw;
            chart.title.draw = function draw() {
                originalDraw.bind(chart.title)();
                chart.chartArea.top -= 30; // Adjust this value as needed
            };
        }
    },
};

const MarketMonthScoreChart = () => {
    // Example data
    const exampleData = [
        { day_num: 1, m1: 20, m2: 15 },
        { day_num: 2, m1: 30, m2: 25 },
        { day_num: 3, m1: -25, m2: 20 },
        { day_num: 4, m1: 35, m2: -30 },
        { day_num: 5, m1: -40, m2: 35 },
        { day_num: 6, m1: 30, m2: -25 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
        { day_num: 7, m1: 50, m2: 40 },
    ];

    const data: any = {
        labels: exampleData.map((item) => item.day_num),
        datasets: [
            {
                label: 'Tháng này',
                data: exampleData.map((item) => item.m1),
                backgroundColor: 'rgba(2, 91, 196, 0.5)',
                pointBackgroundColor: '#025bc4',
                borderColor: '#025bc4',
                pointRadius: 0, 
                hoverRadius: 4, 
                borderWidth: 3, 
                cubicInterpolationMode: 'monotone',
                yAxisID: 'y1',
            },
            {
                label: 'Biểu đồ cột',
                type: 'bar' as const,
                data: exampleData.map((item) => item.m2), backgroundColor: exampleData.map((item) => item.m2 < 0 ? 'rgba(225, 64, 64, 0.4)' : 'rgba(36, 183, 94, 0.4)'), 
                borderWidth: 0, 
                yAxisID: 'y2',
                barThickness: 'flex',
                barPercentage: 1.23,
            },
        ],
    };


    const options: any = {
        responsive: true,
        maintainAspectRatio: false, // Ensures the chart adjusts to the container size
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        return `${tooltipItem?.dataset.label}: ${tooltipItem?.raw?.toFixed(
                            2
                        )}`;
                    },
                },
                displayColors: true, // Show color box in tooltip
                usePointStyle: true, // Use point style (defined in datasets) for the color box
                bodyFontColor: '#dfdfdf', // Tooltip font color
                bodyFontSize: 12, // Tooltip font size
                bodyFontStyle: 'bold', // Tooltip font style
                boxWidth: 10, // Color box size
                caretPadding: 20,
            },
            title: {
                display: true,
                text: 'Dòng tiền trong tháng',
                padding: {
                    bottom: 0, // Reduce space below the title
                },
                font: {
                    family: 'Calibri, sans-serif',
                    size: 16, // Title font size
                    weight: 'bold', // Title font weight
                },
                color: '#dfdfdf', // Title font color
            },
            datalabels: {
                display: false, // Hide data labels
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                ticks: {
                    color: '#dfdfdf', // X-axis label color
                    callback: function (value: any, index: any, values: any) {
                        // Skip the first tick
                        if (index === 0) return '';
                        if (index < 10) return `0${value}`;
                        return value;
                    },
                },
            },
            y1: {
                type: 'linear',
                position: 'left',
                ticks: {
                    color: '#dfdfdf', // Y-axis label color
                },
                grid: {
                    display: false,
                    color: '#dfdfdf',
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 1 : 0; // Draw grid line only at value 0
                    },
                },
            },
            y2: {
                type: 'linear',
                position: 'right',
                ticks: {
                    display: false,
                    color: '#dfdfdf', // Y-axis label color
                },
                grid: {
                    drawOnChartArea: false, // Don't draw the grid for the secondary axis
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
            <div style={{ width: '50%', height: '300px' }}>
                <Line
                    data={data}
                    options={options}
                    plugins={[customLegendMargin, customTitleMargin]}
                />
            </div>
        );
    }
};

export default MarketMonthScoreChart;
