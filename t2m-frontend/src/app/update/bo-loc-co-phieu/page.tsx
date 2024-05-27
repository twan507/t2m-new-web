'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import FilterStockTable from "./components/filter_table";

const useWindowWidth = (): any => {
  const [windowWidth, setWindowWidth] = useState(Math.min(window.innerWidth, 1250));

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(Math.min(window.innerWidth, 1250));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowWidth;
};

export default function Page1() {
  const getData = async (tableName: string) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
    })
    if (tableName === 'update_time') {
      await set_update_time(res.data)
    } else if (tableName === 'filter_stock_df') {
      await set_filter_stock_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time');
      getData('filter_stock_df');
    };
    fetchData();

    const interval = setInterval(fetchData, 5 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [filter_stock_df, set_filter_stock_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [chi_so_thi_truong, set_chi_so_thi_truong] = useState('TQ');
  const [switch_itd_eod, set_switch_itd_eod] = useState('eod');
  const [switch_group, set_switch_group] = useState('D');

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeSwitchItdEod = (e: any) => {
    set_switch_itd_eod(switch_itd_eod === 'eod' ? 'itd' : 'eod')
  };

  const onChangeGroup = (e: any) => {
    const value = e.target.value;
    set_switch_group(value)
  };

  const switch_group_items: any = [
    {
      key: 'D',
      label: 'Trong phiên',
    },
    {
      key: 'M',
      label: 'Trong tuần/tháng',
    },
  ];

  const onChangeGroupMobile: MenuProps['onClick'] = (e) => {
    set_switch_group(e.key);
  };

  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);
  if (!checkAuth) {
    return (
      <>
        <Col style={{
          display: 'flex',
          justifyContent: 'center',  // Căn giữa ngang
          alignItems: 'center',      // Căn giữa dọc
          marginTop: '30px'
        }}>
          <Row>
            <Col style={{ width: ww, margin: 0.03 * ww }}>
              <Row gutter={25} style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền và thanh khoản nhóm cổ phiếu
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                  <Button className="custom-button" block={true} size={ww > 768 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12) }} onClick={onChangeSwitchItdEod}
                  >Xoá bộ lọc
                  </Button>
                </Col>
              </Row>
              <Row>
                <FilterStockTable data={filter_stock_df} ww={ww} fontSize={pixel(0.013, 11)} lineHeight='34px' />
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}
