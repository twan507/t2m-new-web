'use client'
import { sendRequest } from "@/utlis/api"
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);


const MarketBreathChart = (props: any) => {

  function getColor(name: any) {
    switch (name) {
      case 'Tăng giá':
        return '#24B75E';  // Màu cho Tăng giá
      case 'Không đổi':
        return '#D0be0f';  // Màu cho Không đổi
      case 'Giảm giá':
        return '#e14040';  // Màu cho Giảm giá
      default:
        return '#cccccc';  // Một màu mặc định cho các trường hợp khác
    }
  }

  const data = {
    labels: props?.data?.map((item: any) => item.name) || [],
    datasets: [
      {
        label: '',
        data: props?.data?.map((item: any) => item.count), // Giá trị value từ dữ liệu của bạn
        backgroundColor: props?.data?.map((item: any) => getColor(item.name)),  // Màu sắc dựa trên tên
        borderWidth: 0,
      },
    ],
  };

  const options: any = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#FFFFFF', // Màu chữ của nhãn
        font: {
          family: 'Calibri',
          weight: 'bold',
          size: props?.pixel(0.012, 11)
        },
        textAlign: 'center',
        align: 'end',
        offset: 0,  // Khoảng cách giữa nhãn và các mảnh của biểu đồ
        formatter: (value: any, ctx: any) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          //@ts-ignore
          dataArr.map(data => {
            sum += parseInt(data);
          });
          let percentage = (value * 100 / sum).toFixed(1) + "%";
          return percentage;
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Số lượng: ${tooltipItem?.raw} (${((tooltipItem?.raw / props?.data?.reduce((sum: any, item: any) => sum + parseInt(item.count, 10), 0)) * 100).toFixed(1) + '%'})`;
          }
        },
        displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
        usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
        bodyFontColor: 'white', // Màu chữ của tooltip
        boxWidth: 20, // Kích thước của ô màu
      },
      legend: {
        display: props?.ww > 500,
        position: 'right', // Đặt vị trí của legend sang bên phải
        align: 'center', // Căn giữa legend theo chiều dọc
        labels: {
          boxWidth: 20, // Độ rộng của hộp màu trong legend
          boxHeight: 8,
          padding: 10, // Khoảng cách giữa các mục trong legend
          pointStyle: 'circle', // Đặt kiểu điểm thành hình tròn
          usePointStyle: true, // Bảo đảm sử dụng pointStyle cho biểu tượng
          font: {
            size: props?.pixel(0.012, 12), // Điều chỉnh cỡ chữ của legend
            family: 'Calibri', // Điều chỉnh font chữ của legend
          },
          color: 'white'
        }
      }
    }
  };

  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <div style={{ width: props?.width, height: props?.height, marginTop: '40px', display: 'flex', alignItems: 'center' }}> {/* Điều chỉnh kích thước container */}
        <Pie data={data} options={options} />
      </div>
    )
  }
}

export default MarketBreathChart