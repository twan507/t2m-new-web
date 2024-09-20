import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const AllocationLinesChart = (props: any) => {

    function getColor(name: any) {
        switch (name) {
            case 'Bán lẻ':
                return '#C031C7';  // Màu cho Bán lẻ
            case 'Bất động sản':
                return '#24B75E ';  // Màu cho Bất động sản
            case 'Chứng khoán':
                return '#025bc4';  // Màu cho Chứng khoán
            case 'Thép':
                return '#ed0211 ';  // Màu cho Thép
            case 'Xây dựng':
                return '#666666';  // Màu cho Xây dựng
            case 'Công nghiệp':
                return '#ad5deb ';  // Màu cho Công nghiệp
            case 'Dầu khí':
                return '#250275';  // Màu cho Dầu khí
            case 'Hoá chất':
                return '#D0be0f ';  // Màu cho Hoá chất
            case 'Thuỷ sản':
                return '#00cccc';  // Màu cho Thuỷ sản
            case 'Công nghệ':
                return '#c91263';  // Màu cho Công nghệ
            case 'Ngân hàng':
                return '#EC8000';  // Màu cho Ngân hàng 
            case 'Thực phẩm':
                return '#800b13';  // Màu cho Thực phẩm
            case 'Vận tải':
                return '#025218';  // Màu cho Vận tải
            default:
                return '#161616';  // Màu mặc định cho các trường hợp khác
        }
    }

    const slice = props.ww > 767 ? 30 : (props.ww > 500 ? 20 : 10)

    const data_sets = props?.data.slice(0, slice)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1))?.slice(-2);
        const day = ('0' + date.getDate())?.slice(-2);
        return `${day}-${month}`;
    });

    const lines: any = {
        labels: dateList || [],
        datasets: [
            {
                label: 'Xây dựng',
                data: data_sets?.map((item: any) => item['Xây dựng']),
                fill: 'origin',
                backgroundColor: getColor('Xây dựng'), // Màu nền
                borderColor: getColor('Xây dựng'), // Màu viền
                pointBackgroundColor: getColor('Xây dựng'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Bán lẻ',
                data: data_sets?.map((item: any) => item['Bán lẻ']),
                fill: 'origin',
                backgroundColor: getColor('Bán lẻ'), // Màu nền
                borderColor: getColor('Bán lẻ'), // Màu viền
                pointBackgroundColor: getColor('Bán lẻ'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Bất động sản',
                data: data_sets?.map((item: any) => item['Bất động sản']),
                fill: 'origin',
                backgroundColor: getColor('Bất động sản'), // Màu nền
                borderColor: getColor('Bất động sản'), // Màu viền
                pointBackgroundColor: getColor('Bất động sản'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Chứng khoán',
                data: data_sets?.map((item: any) => item['Chứng khoán']),
                fill: 'origin',
                backgroundColor: getColor('Chứng khoán'), // Màu nền
                borderColor: getColor('Chứng khoán'), // Màu viền
                pointBackgroundColor: getColor('Chứng khoán'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Thép',
                data: data_sets?.map((item: any) => item['Thép']),
                fill: 'origin',
                backgroundColor: getColor('Thép'), // Màu nền
                borderColor: getColor('Thép'), // Màu viền
                pointBackgroundColor: getColor('Thép'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Công nghiệp',
                data: data_sets?.map((item: any) => item['Công nghiệp']),
                fill: 'origin',
                backgroundColor: getColor('Công nghiệp'), // Màu nền
                borderColor: getColor('Công nghiệp'), // Màu viền
                pointBackgroundColor: getColor('Công nghiệp'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Dầu khí',
                data: data_sets?.map((item: any) => item['Dầu khí']),
                fill: 'origin',
                backgroundColor: getColor('Dầu khí'), // Màu nền
                borderColor: getColor('Dầu khí'), // Màu viền
                pointBackgroundColor: getColor('Dầu khí'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Hoá chất',
                data: data_sets?.map((item: any) => item['Hoá chất']),
                fill: 'origin',
                backgroundColor: getColor('Hoá chất'), // Màu nền
                borderColor: getColor('Hoá chất'), // Màu viền
                pointBackgroundColor: getColor('Hoá chất'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Thuỷ sản',
                data: data_sets?.map((item: any) => item['Thuỷ sản']),
                fill: 'origin',
                backgroundColor: getColor('Thuỷ sản'), // Màu nền
                borderColor: getColor('Thuỷ sản'), // Màu viền
                pointBackgroundColor: getColor('Thuỷ sản'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Công nghệ',
                data: data_sets?.map((item: any) => item['Công nghệ']),
                fill: 'origin',
                backgroundColor: getColor('Công nghệ'), // Màu nền
                borderColor: getColor('Công nghệ'), // Màu viền
                pointBackgroundColor: getColor('Công nghệ'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Ngân hàng',
                data: data_sets?.map((item: any) => item['Ngân hàng']),
                fill: 'origin',
                backgroundColor: getColor('Ngân hàng'), // Màu nền
                borderColor: getColor('Ngân hàng'), // Màu viền
                pointBackgroundColor: getColor('Ngân hàng'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Thực phẩm',
                data: data_sets?.map((item: any) => item['Thực phẩm']),
                fill: 'origin',
                backgroundColor: getColor('Thực phẩm'), // Màu nền
                borderColor: getColor('Thực phẩm'), // Màu viền
                pointBackgroundColor: getColor('Thực phẩm'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Vận tải',
                data: data_sets?.map((item: any) => item['Vận tải']),
                fill: 'origin',
                backgroundColor: getColor('Vận tải'), // Màu nền
                borderColor: getColor('Vận tải'), // Màu viền
                pointBackgroundColor: getColor('Vận tải'), // Màu điểm
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
            {
                label: 'Tiền mặt',
                data: data_sets?.map((item: any) => item['Tiền mặt']),
                fill: 'origin',
                backgroundColor: '#161616',
                borderColor: '#161616',
                pointBackgroundColor: '#161616',
                pointRadius: 0,
                hoverRadius: 5,
                stepped: 'middle',
                borderWidth: props?.ww > 767 ? 2.5 : 2,
            },
        ],
    };


    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Lịch sử luân chuyển vốn',
                color: '#dfdfdf',
                font: {
                    family: 'Calibri, sans-serif',
                    size: parseInt(props?.fontSize) - 2,
                    weight: 'bold',
                },
                padding: {
                    bottom: 20
                }
            },
            legend: {
                display: false,
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
                    color: '#dfdfdf'
                }
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Ngày ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                        const value = tooltipItem?.raw * 100;
                        if (value > 0) {
                            return `${tooltipItem?.dataset.label}: ${value.toFixed(0)}%`;
                        }
                        return null; // Không hiển thị nếu giá trị <= 0
                    }
                },
                displayColors: true,
                usePointStyle: true,
                bodyFontColor: '#dfdfdf',
                bodyFontSize: parseInt(props?.fontSize) - 4,
                bodyFontStyle: 'bold',
                boxWidth: 10,
                caretPadding: 20
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
                min: 0,
                max: 1,
                stacked: true, // Tích hợp stacked cho các datasets
                ticks: {
                    stepSize: 0.2,
                    color: '#dfdfdf',
                    callback: function (value: any) {
                        return value * 100 + '%';
                    }
                },
                grid: {
                    display: true,
                    color: '#dfdfdf',
                    drawBorder: false,
                    lineWidth: function (context: any) {
                        return context.tick.value === 0 ? 0.5 : 0;
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
            <div style={{ width: '100%', height: '320px' }}>
                <Line data={lines} options={options} />
                {/* <Line data={lines} options={options} plugins={[customLegendMargin, customTitleMargin]} /> */}
            </div>
        );
    };
}

export default AllocationLinesChart;
