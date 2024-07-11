import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

const IndexPriceChart = (props: any) => {

	const data_sets = props?.data?.filter((item: any) => item.index_name === props?.index_name)
		.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

	const dateList: string[] = data_sets?.map((item: any) => {
		const date = new Date(item.date);
		const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng và thêm số 0 nếu cần
		const day = ('0' + date.getDate()).slice(-2); // Lấy ngày và thêm số 0 nếu cần
		return `${day}-${month}`;
	});

	const slice = props?.time_span == '1M' ? -20 :
		(props?.time_span == '3M' ? -50 :
			(props?.time_span == '6M' ? -100 : -props?.time_span))

	const lines = {
		labels: dateList?.slice(slice) || [],
		datasets: [
			{
				label: 'Giá trị',
				data: data_sets?.map((item: any) => item.value).slice(slice),
				fill: true,
				borderColor: '#C031C7',
				pointRadius: 0, // Tắt các chấm màu xám ở các data label
				hoverRadius: 4, // Tăng kích thước khi di chuột tới
				pointBackgroundColor: '#C031C7', // Màu nền cho các điểm
				cubicInterpolationMode: 'monotone', // Đường cong mượt
				borderWidth: props?.ww > 767 ? 2.5 : 2,
			},
		],
	};

	const options: any = {
		responsive: true,
		maintainAspectRatio: false, // Đảm bảo biểu đồ sẽ điều chỉnh kích thước theo container
		plugins: {
			legend: {
				display: false,
				pointStyle: 'circle', // Đặt kiểu điểm thành hình tròn
				usePointStyle: true, // Bảo đảm sử dụng pointStyle cho biểu tượng
			},
			title: {
				display: true,
			},
			tooltip: {
				mode: 'index',
				intersect: false,
				displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
				usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
				caretPadding: 20, // Kéo ô tooltip ra xa khỏi điểm dữ liệu một chút
				callbacks: {
					title: function (tooltipItems: any) {
						return `Ngày ${tooltipItems[0].label}`;
					},
					label: function (tooltipItem: any) {
						return ` ${tooltipItem?.dataset.label}: ${tooltipItem?.raw}`;
					}
				}
			},
			datalabels: {
				display: false, // Tắt các số tại các data label
			},
		},
		interaction: {
			mode: 'index',
			intersect: false,
		},
		scales: {
			x: {
				ticks: {
					color: '#dfdfdf', // Màu của các nhãn trên trục X
				},
			},
			y: {
				position: 'right',
				ticks: {
					color: '#dfdfdf', // Màu của các nhãn trên trục Y
				},
			},
		},
	};

	return (
		<div style={{ width: props?.width, height: props?.height }}>
			<Line data={lines} options={options} />
		</div>
	);
};

export default IndexPriceChart;
