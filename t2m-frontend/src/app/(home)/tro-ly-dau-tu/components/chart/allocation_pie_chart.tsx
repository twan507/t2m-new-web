'use client'
import { sendRequest } from "@/utlis/api"
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);


const AllocationPieChart = (props: any) => {

  function getColor(name: any) {
    switch (name) {
      case 'Bán lẻ':
        return '#C031C7';  // Màu cho Bán lẻ
      case 'Bất động sản':
        return '#24B75E ';  // Màu cho Bất động sản
      case 'Chứng khoán':
        return '#025bc4';  // Màu cho Chứng khoán
      case 'Thép':
        return '#e14040 ';  // Màu cho Thép
      case 'Xây dựng':
        return '#555555';  // Màu cho Xây dựng
      case 'Công nghiệp':
        return '#6101c0 ';  // Màu cho Công nghiệp
      case 'Dầu khí':
        return '#250275';  // Màu cho Dầu khí
      case 'Hoá chất':
        return '#D0be0f ';  // Màu cho Hoá chất
      case 'Thuỷ sản':
        return '#00cccc';  // Màu cho Thuỷ sản
      case 'Công nghệ':
        return '#c91263';  // Màu cho Công nghệ
      case 'Ngân hàng':
        return '#ad5deb';  // Màu cho Ngân hàng
      case 'Thực phẩm':
        return '#EC8000';  // Màu cho Thực phẩm
      case 'Vận tải':
        return '#2cb581';  // Màu cho Vận tải
      default:
        return '#161616';  // Màu mặc định cho các trường hợp khác
    }
  }


  const data = {
    labels: props?.data?.map((item: any) => item.industry_name) || [],
    datasets: [
      {
        label: '',
        data: props?.data?.map((item: any) => item.value), // Giá trị value từ dữ liệu của bạn
        backgroundColor: props?.data?.map((item: any) => getColor(item.industry_name)),  // Màu sắc dựa trên tên
        borderWidth: 0,
      },
    ],
  };

  const options: any = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Tỉ trọng vốn hiện tại',
        color: '#dfdfdf',
        font: {
          family: 'Calibri, sans-serif',
          size: parseInt(props?.fontSize) - 2,
          weight: 'bold',
        },
        padding: {
          bottom: props?.ww > 767 ? 20 : 0
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Tỉ trọng: ${tooltipItem?.raw * 100}%`;
          }
        },
        displayColors: true, // Kiểm soát việc hiển thị ô màu trong tooltip
        usePointStyle: true, // Sử dụng point style (hình dáng được định nghĩa trong datasets cho ô màu)
        bodyFontColor: 'white', // Màu chữ của tooltip
        boxWidth: 20, // Kích thước của ô màu
      },
      datalabels: {
        color: '#FFFFFF', // Màu chữ của nhãn
        font: {
          family: 'Calibri',
          size: props?.pixel(0.012, 11)
        },
        textAlign: 'center',
        align: 'end',
        offset: 0,
        formatter: function (value: any, context: any) {
          // Hiển thị giá trị dưới dạng phần trăm nếu giá trị > 0
          if (value > 0) {
            return `${(value * 100)}%`; // Định dạng với 2 chữ số thập phân
          }
          return null; // Không hiển thị nếu giá trị <= 0
        },
        display: function (context: any) {
          // Hiển thị chỉ nếu giá trị lớn hơn 0
          return context.dataset.data[context.dataIndex] > 0;
        }
      },
      legend: {
        display: true,
        // display: props?.ww > 500,
        position: props?.ww > 767 ? 'right' : 'top',
        align: 'center',
        labels: {
          boxWidth: 20,
          boxHeight: 8,
          padding: 10,
          pointStyle: 'circle',
          usePointStyle: true,
          font: {
            size: props?.pixel(0.012, 11),
            family: 'Calibri',
          },
          color: 'white',
          // Thêm filter để loại bỏ các mục có giá trị <= 0
          filter: function (legendItem: any, data: any) {
            const index = legendItem.index;
            const value = data.datasets[0].data[index];
            return value > 0;
          }
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
      <div style={{ width: '100%', height: '300px', marginTop: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pie data={data} options={options} />
      </div>
    )
  }
}

export default AllocationPieChart