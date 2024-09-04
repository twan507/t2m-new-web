'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { resetAuthState } from "@/redux/authSlice";
import { sessionLimit } from "@/utlis/sessionLimit";
import MarketBreathChart from "./components/tong_quan_thi_truong/market_breath";
import MarketTopStockChart from "./components/tong_quan_thi_truong/market_top_stock";
import MoneyFlowValueChart from "./components/dong_tien_thi_truong/gia_tri_dong_tien";
import MoneyFlowBreathChart from "./components/dong_tien_thi_truong/do_rong_dong_tien";
import MoneyFlowLiquidityChart from "./components/dong_tien_thi_truong/chi_so_thanh_khoan_eod";
import MarketStructureChart from "./components/dong_tien_thi_truong/cau_truc_song_chart";
import DailyReport from "./components/report";
import ReportSentimentGaugeChart from "./components/tong_quan_thi_truong/sentiment_gauge_chart";
import ReportSentimentLineChart from "./components/tong_quan_thi_truong/sentiment_line_chart";
import ReportLiquidityLineChart from "./components/tong_quan_thi_truong/liquidity_line_chart";
import ReportLiquidityGaugeChart from "./components/tong_quan_thi_truong/liquidity_gauge_chart";
import LiquidityBreathChart from "./components/dong_tien_thi_truong/do_rong_thanh_khoan";


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

const getUpdateTime = (timeString: any) => {
  if (timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);
    now.setMilliseconds(0);
    return now
  } else {
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    return now
  }
}

const getOpenTime = () => {
  const openTime = new Date();
  openTime.setHours(9, 15, 0, 0);
  return openTime
}

export default function Report() {

  const [limitState, setLimitState] = useState(false);
  const dispatch = useAppDispatch();
  const authInfo = useAppSelector((state) => state.auth)
  useEffect(() => {
    (async () => {
      const limitState = await sessionLimit(authInfo?.user?.email, authInfo?.access_token);
      if (!limitState) { dispatch(resetAuthState()) }
      setLimitState(limitState);
    })()
  }, [authInfo?.user?.email, authInfo?.access_token]);
  const authState = !!authInfo?.user?._id && limitState
  const accessLevel = authInfo?.user?.role === 'T2M ADMIN' ? 4 : authInfo?.user?.licenseInfo?.accessLevel

  const getData = async (tableName: string) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
    })
    if (tableName === 'market_update_time') {
      await set_market_update_time(res.data)
    } else if (tableName === 'market_index_card_df') {
      await set_market_index_card_df(res.data)
    } else if (tableName === 'market_price_breath_df') {
      await set_market_price_breath_df(res.data)
    } else if (tableName === 'market_top_stock_df') {
      await set_market_top_stock_df(res.data)
    } else if (tableName === 'market_sentiment_df') {
      await set_market_sentiment_df(res.data)
    } else if (tableName === 'group_eod_score_liquidity_df') {
      await set_group_eod_score_liquidity_df(res.data)
    } else if (tableName === 'group_itd_score_liquidity_df') {
      await set_group_itd_score_liquidity_df(res.data)
    } else if (tableName === 'group_ms_chart_df') {
      await set_group_ms_chart_df(res.data)
    } else if (tableName === 'group_breath_df ') {
      await set_group_breath_df(res.data)
    } else if (tableName === 'daily_report_df') {
      await set_daily_report_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('market_update_time');
      getData('market_index_card_df');
      getData('market_price_breath_df');
      getData('market_top_stock_df');
      getData('market_sentiment_df');
      getData('group_eod_score_liquidity_df');
      getData('group_itd_score_liquidity_df');
      getData('group_ms_chart_df');
      getData('group_breath_df ');
      getData('daily_report_df');
    };
    fetchData();

    const interval = setInterval(fetchData, 30000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [market_update_time, set_market_update_time] = useState<any[]>([]);
  const [market_index_card_df, set_market_index_card_df] = useState<any[]>([]);
  const [market_price_breath_df, set_market_price_breath_df] = useState<any[]>([]);
  const [market_top_stock_df, set_market_top_stock_df] = useState<any[]>([]);
  const [market_sentiment_df, set_market_sentiment_df] = useState<any[]>([]);
  const [group_eod_score_liquidity_df, set_group_eod_score_liquidity_df] = useState<any[]>([]);
  const [group_itd_score_liquidity_df, set_group_itd_score_liquidity_df] = useState<any[]>([]);
  const [group_ms_chart_df, set_group_ms_chart_df] = useState<any[]>([]);
  const [group_breath_df, set_group_breath_df] = useState<any[]>([]);
  const [daily_report_df, set_daily_report_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm

  const currentTime = getUpdateTime(market_update_time?.[0]?.date?.slice(-8))
  const openTime = getOpenTime()
  const openState = currentTime > openTime

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const getColorSentiment = (value: any) => {
    if (value === '') return '#B3B3B3';
    if (value < 20) return '#00cccc';
    if (value < 40) return '#e14040';
    if (value < 60) return '#D0be0f';
    if (value < 80) return '#24B75E';
    return '#C031C7';
  };

  const getColorLiquidity = (value: any) => {
    if (value === '') return '#B3B3B3';
    if (value < 50) return '#00cccc';
    if (value < 80) return '#e14040';
    if (value < 120) return '#D0be0f';
    if (value < 150) return '#24B75E';
    return '#C031C7';
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
              <Row>
                <DailyReport data={daily_report_df} />
              </Row>
              <Row style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>Tổng quan thị trường</p>
                <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
              </Row>
              <Row gutter={10}>
                <Col span={4}>
                  <Button type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((market_index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((market_index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((market_index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) >= -0.0001 &&
                            (market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((market_index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                </Col>
                <Col span={7}>
                  <Row gutter={20} style={{ height: ww > 767 ? '60px' : '100px', marginBottom: '10px' }}>
                    <div style={{ marginLeft: ww > 800 ? '10px' : '-10px' }}>
                      <p style={{ fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', color: '#B3B3B3', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                        Khối lượng giao dịch
                      </p>
                      <p style={{ fontSize: pixel(0.016, 14), fontFamily: 'Calibri, sans-serif', color: 'white', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                        {market_price_breath_df?.reduce((sum, item) => sum + item.volume, 0).toLocaleString('en-US')}
                      </p>
                    </div>
                    <div style={{ marginLeft: ww > 800 ? '40px' : '-10px', marginTop: ww > 800 ? '0px' : '10px' }}>
                      <p style={{ fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', color: '#B3B3B3', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                        Giá trị giao dịch
                      </p>
                      <p style={{ fontSize: pixel(0.016, 14), fontFamily: 'Calibri, sans-serif', color: 'white', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                        {Math.round(market_price_breath_df?.reduce((sum, item) => sum + item.value, 0)).toLocaleString('en-US')} <span style={{ fontSize: pixel(0.015, 12), color: '#B3B3B3' }}>Tỷ</span>
                      </p>
                    </div>
                  </Row>
                  <Row gutter={10}>
                    <MarketBreathChart data={market_price_breath_df} width={ww > 400 ? '100%' : '200px'} height={ww > 800 ? '230px' : '180px'} ww={ww} pixel={pixel} />
                  </Row>
                </Col>
                <Col span={1}>
                </Col>
                <Col span={12}>
                  <MarketTopStockChart data={market_top_stock_df} ww={ww} pixel={pixel} />
                </Col>
              </Row >
              <Row gutter={10}>
                <Col span={12}>
                  <Row style={{ background: '#161616', borderRadius: '5px' }}>
                    <Col span={7} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ padding: '10px', borderRadius: '5px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{
                          color: '#B3B3B3', fontSize: pixel(0.016, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                        }}> Trạng thái tâm lý
                        </p>
                        <ReportSentimentGaugeChart openState={openState} data={market_sentiment_df} width='100%' height='100px' ww={ww} />
                        <div style={{
                          background: getColorSentiment(openState ? market_sentiment_df?.[0]?.last_ratio : ''),
                          padding: '0px', borderRadius: '5px', margin: '10px 0px 0px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px', height: '25px'
                        }}>
                          <p style={{
                            color: 'white', fontSize: pixel(0.015, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                          }}> {openState ? market_sentiment_df?.[0]?.last_sentiment : ''}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col span={17}>
                      <ReportSentimentLineChart data={market_sentiment_df} width='99%' height='200px' />
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={{ background: '#161616', borderRadius: '5px' }}>
                    <Col span={7} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ padding: '10px', borderRadius: '5px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{
                          color: '#B3B3B3', fontSize: pixel(0.016, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                        }}> Chỉ số thanh khoản
                        </p>
                        <ReportLiquidityGaugeChart openState={openState} data={group_eod_score_liquidity_df} width='100%' height='100px' ww={ww} />
                        <div style={{
                          background: getColorLiquidity(openState ? (group_eod_score_liquidity_df?.filter((item: any) => item.name === 'Thị trường')[0]?.liquidity * 100) : ''),
                          padding: '0px', borderRadius: '5px', margin: '10px 0px 0px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px', height: '25px'
                        }}>
                          <p style={{
                            color: 'white', fontSize: pixel(0.016, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                          }}> {openState ? group_eod_score_liquidity_df?.filter((item: any) => item.name === 'Thị trường')[0]?.liquid_state : ''}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col span={17}>
                      <ReportLiquidityLineChart openState={openState} data={group_itd_score_liquidity_df} width='99%' height='200px' />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={25} style={{ marginTop: '100px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền thị trường
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row gutter={20} style={{ marginTop: '20px' }}>
                <Col xs={15} sm={15} md={7} lg={8} xl={8}>
                  <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='hs' height='120px' type='group' />
                </Col>
                <Col xs={9} sm={9} md={6} lg={5} xl={5}>
                  <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='hs' height='120px' type='group' />
                </Col>
                <Col xs={15} sm={15} md={6} lg={6} xl={6}>
                  <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='hs' height='120px' type='group' />
                </Col>
                <Col xs={9} sm={9} md={5} lg={5} xl={5}>
                  <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='hs' height='120px' type='group' />
                </Col>
              </Row>
              <Row gutter={20} style={{ marginTop: '20px' }}>
                <Col xs={15} sm={15} md={7} lg={8} xl={8}>
                  <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='cap' height='120px' type='group' />
                </Col>
                <Col xs={9} sm={9} md={6} lg={5} xl={5}>
                  <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='cap' height='120px' type='group' />
                </Col>
                <Col xs={15} sm={15} md={6} lg={6} xl={6}>
                  <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='cap' height='120px' type='group' />
                </Col>
                <Col xs={9} sm={9} md={5} lg={5} xl={5}>
                  <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='cap' height='120px' type='group' />
                </Col>
              </Row>
              <Row>
                <MarketStructureChart data={group_ms_chart_df} ww={ww} fontSize={pixel(0.015, 15)} />
              </Row>

              <Row gutter={25} style={{ marginTop: '100px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền nhóm ngành
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row gutter={20} style={{ marginTop: '10px' }}>
                <Col xs={15} sm={15} md={7} lg={8} xl={8}>
                  <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='A' height='190px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={6} lg={5} xl={5}>
                  <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='A' height='190px' type='industry' />
                </Col>
                <Col xs={15} sm={15} md={6} lg={6} xl={6}>
                  <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='A' height='190px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={5} lg={5} xl={5}>
                  <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='A' height='190px' type='group' />
                </Col>
              </Row>
              <Row gutter={20} style={{ marginTop: '10px' }}>
                <Col xs={15} sm={15} md={7} lg={8} xl={8}>
                  <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='B' height='160px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={6} lg={5} xl={5}>
                  <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='B' height='160px' type='industry' />
                </Col>
                <Col xs={15} sm={15} md={6} lg={6} xl={6}>
                  <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='B' height='160px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={5} lg={5} xl={5}>
                  <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='B' height='160px' type='group' />
                </Col>
              </Row>
              <Row gutter={20} style={{ marginTop: '10px' }}>
                <Col xs={15} sm={15} md={7} lg={8} xl={8}>
                  <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='C' height='160px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={6} lg={5} xl={5}>
                  <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='C' height='160px' type='industry' />
                </Col>
                <Col xs={15} sm={15} md={6} lg={6} xl={6}>
                  <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='C' height='160px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={5} lg={5} xl={5}>
                  <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='C' height='160px' type='group' />
                </Col>
              </Row>
              <Row gutter={20} style={{ marginTop: '10px' }}>
                <Col xs={15} sm={15} md={7} lg={8} xl={8}>
                  <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='D' height='120px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={6} lg={5} xl={5}>
                  <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='D' height='120px' type='industry' />
                </Col>
                <Col xs={15} sm={15} md={6} lg={6} xl={6}>
                  <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='D' height='120px' type='industry' />
                </Col>
                <Col xs={9} sm={9} md={5} lg={5} xl={5}>
                  <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.015, 15)}
                    group='D' height='120px' type='group' />
                </Col>
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}
