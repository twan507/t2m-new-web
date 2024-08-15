import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

const ReportSentimentLineChart = (props: any) => {
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
                label: 'Giá trị',
                data: data_sets?.map((item: any) => parseFloat(item.ratio?.toFixed(2))),
                fill: true,
                borderColor: '#999999',
                pointRadius: 0,
                hoverRadius: 4,
                pointBackgroundColor: '#999999',
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
                pointStyle: 'circle',
                usePointStyle: true,
            },
            title: {
                display: true,
            },
            tooltip: {
                enabled: props.ww > 767 ? true : false,
                mode: 'index',
                intersect: false,
                displayColors: true,
                usePointStyle: true,
                caretPadding: 20, // Kéo ô tooltip ra xa khỏi điểm dữ liệu một chút
                callbacks: {
                    label: function (tooltipItem: any) {
                        return ` ${tooltipItem?.dataset.label}: ${tooltipItem?.raw}`;
                    }
                }
            },
            datalabels: {
                display: false,
            },
            backgroundColorPlugin: {
                regions: [
                    { from: 0, to: 20, color: 'rgba(0, 204, 204, 0.25)' },
                    { from: 20, to: 40, color: 'rgba(225, 64, 64, 0.25)' },
                    { from: 40, to: 60, color: 'rgba(208, 190, 15, 0.25)' },
                    { from: 60, to: 80, color: 'rgba(36, 183, 94, 0.25)' },
                    { from: 80, to: 100, color: 'rgba(192, 49, 199, 0.25)' },
                ],
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
                grid: {
                    display: false
                }
            },
            y: {
                position: 'right',
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: '#dfdfdf',
                },
            },
        },
    };

    const backgroundColorPlugin = {
        id: 'backgroundColorPlugin',
        beforeDraw: (chart: any) => {
            const ctx = chart.ctx;
            const yAxis = chart.scales.y || chart.scales['y-axis-0'];

            if (!yAxis) {
                return;
            }

            const regions = options.plugins.backgroundColorPlugin.regions;

            regions.forEach((region: any) => {
                const yAxisTop = yAxis.getPixelForValue(region.to);
                const yAxisBottom = yAxis.getPixelForValue(region.from);
                ctx.fillStyle = region.color;
                ctx.fillRect(
                    chart.chartArea.left,
                    yAxisTop,
                    chart.chartArea.right - chart.chartArea.left,
                    yAxisBottom - yAxisTop
                );
            });
        }
    };

    return (
        <div style={{ width: props?.width, height: props?.height, marginTop: '-15px' }}>
            <Line data={lines} options={{ ...options, plugins: { ...options.plugins, backgroundColorPlugin } }} plugins={[backgroundColorPlugin]} />
        </div>
    );
};

export default ReportSentimentLineChart;
