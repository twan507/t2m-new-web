'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import MoneyFlowValueChart from "./eod/gia_tri_dong_tien";
import MoneyFlowBreathChart from "./eod/do_rong_dong_tien";
import MoneyFlowLiquidityChart from "./eod/chi_so_thanh_khoan_eod";

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
    } else if (tableName === 'itd_score_liquidity_last') {
      await set_itd_score_liquidity_last(res.data)
    } else if (tableName === 'market_breath_df') {
      await set_market_breath_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time');
      getData('itd_score_liquidity_last');
      getData('market_breath_df');
    };
    fetchData();

    const interval = setInterval(fetchData, 10 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [itd_score_liquidity_last, set_itd_score_liquidity_last] = useState<any[]>([]);
  const [market_breath_df, set_market_breath_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [switch_itd_eod, set_switch_itd_eod] = useState('eod');
  const [switch_group_stock, set_switch_group_stock] = useState('D');


  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeSwitchItdEod = (e: any) => {
    set_switch_itd_eod(switch_itd_eod === 'eod' ? 'itd' : 'eod')
  };

  const onChangeGroupStock = (e: any) => {
    const value = e.target.value;
    set_switch_group_stock(value)
  };

  const switch_itd_eod_items: any = [
    {
      key: 'D',
      label: 'Trong phiên',
    },
    {
      key: 'M',
      label: 'Trong tuần/tháng',
    },
  ];

  const onChangeGroupStockMobile: MenuProps['onClick'] = (e) => {
    set_switch_group_stock(e.key);
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
              <Row gutter={25} style={{ height: '10px', margin: '-40px 0px 0px 0px' }}></Row>
              <Row gutter={25} style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <div style={{ height: '100%', width: '100%' }}></div>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                  <Button className="custom-button" block={true} size={ww > 768 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12) }} onClick={onChangeSwitchItdEod}
                  >
                    {switch_itd_eod === 'eod' ? (ww > 768 ? 'Xem diễn biến Intraday' : 'Xem diễn biến ITD')
                      : (ww > 768 ? 'Xem diễn biến End-of-day' : 'Xem diễn biến EOD')}
                  </Button>
                </Col>
              </Row>
              <Row gutter={25} style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền & Thanh khoản nhóm cổ phiếu
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                  {ww > 768 && (
                    <Radio.Group
                      className="custom-radio-group"
                      defaultValue={switch_group_stock}
                      buttonStyle="solid"
                      onChange={onChangeGroupStock}
                      style={{ display: 'flex', width: '100%', marginTop: '5px', height: '50px' }}
                    >
                      <Radio.Button value="D" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Trong phiên
                      </Radio.Button>
                      <Radio.Button value="M" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Trong tuần/tháng
                      </Radio.Button>
                    </Radio.Group>
                  )}
                  {ww <= 768 && (
                    <Menu
                      theme='dark'
                      onClick={onChangeGroupStockMobile}
                      className="page2-menu"
                      style={{ width: '100%', background: 'black', fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf', height: '50px' }}
                      defaultOpenKeys={[switch_group_stock]}
                      selectedKeys={[switch_group_stock]}
                      mode="vertical"
                      items={switch_itd_eod_items}
                    />
                  )}
                </Col>
              </Row>
              {switch_itd_eod === 'eod' && (
                <>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                      <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.015, 17)} group='hs'/>
                    </Col>
                    <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                      <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.015, 17)} group='hs'/>
                    </Col>
                    <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                      <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.015, 17)} group='hs'/>
                    </Col>
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                      <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.015, 17)} group='cap'/>
                    </Col>
                    <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                      <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.015, 17)} group='cap'/>
                    </Col>
                    <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                      <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.015, 17)} group='cap'/>
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Col >
      </>
    )
  }
}