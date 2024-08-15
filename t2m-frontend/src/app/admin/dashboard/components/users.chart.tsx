import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
    LineController,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Đăng ký các thành phần cần thiết từ chart.js
ChartJS.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

interface ChartData {
    _id: string;
    createdAt: string;
    price: number;
}

interface LineChartProps {
    width: string;
    height: string;
    data: ChartData[];
}

const UsersChart: React.FC<LineChartProps> = ({ width, height, data }) => {

    // Chuyển đổi và gom nhóm dữ liệu
    const groupedData = data?.reduce((acc, item) => {
        const date = new Date(item.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object?.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const cumulativeData = sortedDates.reduce((acc, date, index) => {
        if (index === 0) {
            acc.push(groupedData[date]);
        } else {
            acc.push(acc[index - 1] + groupedData[date]);
        }
        return acc;
    }, [] as number[]);

    const pricesData = sortedDates.map(date => groupedData[date]);

    const chartData: any = {
        labels: sortedDates,
        plugins: {
            datalabels: {
                display: false, // Tắt các số tại các data label
            },
        },
        interaction: {
            mode: 'nearest',
            intersect: false,
        },
        datasets: [
            {
                type: 'line',
                label: 'Số tài khoản luỹ kế',
                data: cumulativeData,
                borderColor: '#98217c',
                backgroundColor: '#98217c',
                fill: false,
            },
            {
                type: 'bar',
                label: 'Tài khoản mở trong ngày',
                data: pricesData,
                borderColor: '#1777ff',
                backgroundColor: '#1777ff',
            }
        ],
    };

    const options: any = {
        responsive: true, // Make sure the chart is responsive
        maintainAspectRatio: false, // Allows you to set custom width and height without maintaining the aspect ratio
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                grid: {
                    display: false, // This will remove the vertical grid lines
                }
            }
        },
        plugins: {
            datalabels: {
                display: false, // Tắt các số tại các data label
            },
            tooltip: {
                enabled: props.ww > 767 ? true : false,
                enabled: true, // Always enable tooltips
                mode: 'index',
                intersect: false,
                position: 'nearest', // Position the tooltip near the nearest data point
                external: (context: any) => {
                    // Code to create an always-visible tooltip
                    const tooltipEl = document.getElementById('chartjs-tooltip');
                    if (!tooltipEl) {
                        const newTooltipEl = document.createElement('div');
                        newTooltipEl.id = 'chartjs-tooltip';
                        newTooltipEl.innerHTML = '<table></table>';
                        document.body.appendChild(newTooltipEl);
                    }
                }
            },
        },
    };

    return (
        <div style={{ width: width, height: height }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default UsersChart;
