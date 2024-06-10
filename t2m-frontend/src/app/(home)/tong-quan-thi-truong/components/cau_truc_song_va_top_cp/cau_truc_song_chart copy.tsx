import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels, zoomPlugin);

const MarketStructureChart = (props: any) => {
    const [zoomState, setZoomState] = useState({ x: { min: null, max: null }, y: { min: null, max: null } });
    const [chartInstance, setChartInstance] = useState<any>(null);

    const data_sets = props?.data?.filter((item: any) => item.name === 'Thị trường')
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Tạo một đối tượng dữ liệu fake với các giá trị là null
    const fakeDataPoint = {
        date: new Date().toISOString(),  // Ngày hiện tại hoặc ngày kế tiếp phù hợp với định dạng ngày của bạn
        trend_5p: null,
        trend_20p: null,
        trend_60p: null,
        trend_120p: null,
        trend_240p: null,
        trend_480p: null
    };
    data_sets.push(fakeDataPoint);

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
        const year = date.getFullYear(); // Lấy năm
        return `${day}-${month}-${year}`; // Trả về định dạng ngày-tháng-năm
    });

    const datasetsForChart = data_sets.slice(0, -1)
    const slice = props?.ww > 767 ? 60 : (props?.ww > 500 ? 40 : 25);

    const lines = {
        labels: dateList,
        datasets: [
            {
                label: 'Tuần',
                data: datasetsForChart?.map((item: any) => item.trend_5p * 100),
                borderColor: '#C031C7',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#C031C7',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Tháng',
                data: datasetsForChart?.map((item: any) => item.trend_20p * 100),
                fill: 'origin',
                borderColor: '#24B75E',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#24B75E',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Quý',
                data: datasetsForChart?.map((item: any) => item.trend_60p * 100),
                fill: 'origin',
                borderColor: '#025bc4',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#025bc4',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Bán niên',
                data: datasetsForChart?.map((item: any) => item.trend_120p * 100),
                fill: 'origin',
                borderColor: '#D0be0f',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#D0be0f',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: '1 Năm',
                data: datasetsForChart?.map((item: any) => item.trend_240p * 100),
                fill: 'origin',
                borderColor: '#e14040',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#e14040',
                tension: 0.4,
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: '2 Năm',
                data: datasetsForChart?.map((item: any) => item.trend_480p * 100),
                fill: 'origin',
                borderColor: '#b3b3b3',
                pointRadius: 1.4,
                hoverRadius: 5,
                pointBackgroundColor: '#b3b3b3',
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
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 20,
                    boxHeight: 6,
                    padding: 10,
                    pointStyle: 'circle',
                    usePointStyle: true,
                    font: {
                        size: parseInt(props?.fontSize) - 4,
                        family: 'Calibri',
                    },
                    color: '#dfdfdf',
                },
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        return `${tooltipItem?.dataset?.label}: ${tooltipItem?.raw?.toFixed(2)}%`;
                    },
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                bodyFontSize: parseInt(props?.fontSize) - 4,
                bodyFontStyle: 'bold',
                boxHeight: 8,
                caretPadding: 20,
            },
            title: {
                display: true,
                text: '',
                padding: {
                    bottom: 0,
                },
                font: {
                    family: 'Calibri, sans-serif',
                    size: props?.fontSize,
                    weight: 'bold',
                },
                color: '#dfdfdf',
            },
            datalabels: {
                display: false,
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                    onZoom: ({ chart }: any) => {
                        const { min, max } = chart.scales.x;
                        setZoomState({ x: { min, max }, y: { min: chart.scales.y.min, max: chart.scales.y.max } });
                    },
                    onPan: ({ chart }: any) => {
                        const { min, max } = chart.scales.x;
                        setZoomState({ x: { min, max }, y: { min: chart.scales.y.min, max: chart.scales.y.max } });
                    },
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                    limits: {
                        x: { min: dateList.length - 60, max: dateList.length },
                    },
                    onZoom: ({ chart }: any) => {
                        const { min, max } = chart.scales.x;
                        setZoomState({ x: { min, max }, y: { min: chart.scales.y.min, max: chart.scales.y.max } });
                    },
                    onPan: ({ chart }: any) => {
                        const { min, max } = chart.scales.x;
                        setZoomState({ x: { min, max }, y: { min: chart.scales.y.min, max: chart.scales.y.max } });
                    },
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                min: zoomState.x.min !== null ? zoomState.x.min : dateList.length - slice,
                max: zoomState.x.max !== null ? zoomState.x.max : dateList.length + 1,
                ticks: {
                    color: '#dfdfdf',
                },
            },
            y: {
                position: 'right',
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: '#dfdfdf',
                    callback: function (value: number) {
                        return `${value}%`;
                    },
                },
                grid: {
                    display: true,
                    drawTicks: false,
                    color: '#dfdfdf',
                    lineWidth: 0.6,
                },
            },
        },
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false);
    }, []);

    useEffect(() => {
        if (chartInstance) {
            chartInstance.update('none');
        }
    }, [props.data]);

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Line
                data={lines}
                options={options}
                ref={(chart: any) => {
                    if (chart && !chartInstance) {
                        setChartInstance(chart.chartInstance);
                    }
                }}
            />
        </div>
    );
}

export default MarketStructureChart;

