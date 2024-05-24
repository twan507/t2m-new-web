'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'

import MarketBreathChart from "./components/chi_so_thi_truong/market_breath";
import MarketTopStockChart from "./components/chi_so_thi_truong/market_top_stock";
import IndexPriceChart from "./components/chi_so_thi_truong/index_price_chart";
import TaTable from "./components/chi_so_thi_truong/index_ta_table";
import SentimentGaugeChart from "./components/trang_thai_thi_truong/sentiment_gauge_chart";
import LiquidityGaugeChart from "./components/trang_thai_thi_truong/liquidity_gauge_chart";
import SentimentLineChart from "./components/trang_thai_thi_truong/sentiment_line_chart";
import LiquidityLineChart from "./components/trang_thai_thi_truong/liquidity_line_chart";
import NnTdBuySellTable from "./components/khoi_ngoai_tu_doanh/nn_td_buy_sell_table";
import NnTdHispory from "./components/khoi_ngoai_tu_doanh/nn_td_history";
import NdTdTopStockChart from "./components/khoi_ngoai_tu_doanh/nn_td_top_stock";
import MarketWeekScoreChart from "./components/dong_tien_thanh_khoan/score_week";
import MarketMonthScoreChart from "./components/dong_tien_thanh_khoan/score_month";
import LiquidityLineChart20p from "./components/dong_tien_thanh_khoan/thanh_khoan_20p";
import MarketStructureChart from "./components/cau_truc_song_va_top_cp/cau_truc_song_chart";
import TopCoPhieuTable from "./components/cau_truc_song_va_top_cp/top_co_phieu_table";

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
    } else if (tableName === 'index_card_df') {
      await set_index_card_df(res.data)
    } else if (tableName === 'market_info_df') {
      await set_market_info_df(res.data)
    } else if (tableName === 'market_top_stock') {
      await set_market_top_stock(res.data)
    } else if (tableName === 'index_price_chart_df') {
      await set_index_price_chart_df(res.data)
    } else if (tableName === 'ta_index_df') {
      await set_ta_index_df(res.data)
    } else if (tableName === 'market_sentiment') {
      await set_market_sentiment(res.data)
    } else if (tableName === 'itd_score_liquidity_last') {
      await set_itd_score_liquidity_last(res.data)
    } else if (tableName === 'itd_score_liquidity_df') {
      await set_itd_score_liquidity_df(res.data)
    } else if (tableName === 'nn_td_20p_df') {
      await set_nn_td_20p_df(res.data)
    } else if (tableName === 'nn_td_buy_sell_df') {
      await set_nn_td_buy_sell_df(res.data)
    } else if (tableName === 'nn_td_top_stock') {
      await set_nn_td_top_stock(res.data)
    } else if (tableName === 'group_score_week') {
      await set_group_score_week(res.data)
    } else if (tableName === 'group_score_month') {
      await set_group_score_month(res.data)
    } else if (tableName === 'eod_group_liquidity_df') {
      await set_eod_group_liquidity_df(res.data)
    } else if (tableName === 'market_ms') {
      await set_market_ms(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time');
      getData('index_card_df');
      getData('market_info_df');
      getData('market_top_stock');
      getData('index_price_chart_df');
      getData('ta_index_df');
      getData('market_sentiment');
      getData('itd_score_liquidity_last');
      getData('itd_score_liquidity_df');
      getData('nn_td_20p_df');
      getData('nn_td_buy_sell_df');
      getData('nn_td_top_stock');
      getData('group_score_week');
      getData('group_score_month');
      getData('eod_group_liquidity_df');
      getData('market_ms');
    };
    fetchData();

    const interval = setInterval(fetchData, 5 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [index_card_df, set_index_card_df] = useState<any[]>([]);
  const [market_info_df, set_market_info_df] = useState<any[]>([]);
  const [market_top_stock, set_market_top_stock] = useState<any[]>([]);
  const [index_price_chart_df, set_index_price_chart_df] = useState<any[]>([]);
  const [ta_index_df, set_ta_index_df] = useState<any[]>([]);
  const [market_sentiment, set_market_sentiment] = useState<any[]>([]);
  const [itd_score_liquidity_last, set_itd_score_liquidity_last] = useState<any[]>([]);
  const [itd_score_liquidity_df, set_itd_score_liquidity_df] = useState<any[]>([]);
  const [nn_td_20p_df, set_nn_td_20p_df] = useState<any[]>([]);
  const [nn_td_buy_sell_df, set_nn_td_buy_sell_df] = useState<any[]>([]);
  const [nn_td_top_stock, set_nn_td_top_stock] = useState<any[]>([]);
  const [group_score_week, set_group_score_week] = useState<any[]>([]);
  const [group_score_month, set_group_score_month] = useState<any[]>([]);
  const [eod_group_liquidity_df, set_eod_group_liquidity_df] = useState<any[]>([]);
  const [market_ms, set_market_ms] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [chi_so_thi_truong, set_chi_so_thi_truong] = useState('TQ');
  const [time_span, set_time_span] = useState('1M');
  const [index_name, set_index_name] = useState('VNINDEX');
  const [mobile_ta_mode, set_mobile_ta_mode] = useState('month');
  const [tttt_dttk, set_tttt_dttk] = useState('TTTT');
  const [id_kntd, set_id_kntd] = useState('HSX');
  const [switch_kntd, set_switch_kntd] = useState('NN');
  const [switch_top_mobile, set_switch_top_mobile] = useState('top');

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeChiSoThiTruong = (e: any) => {
    const value = e.target.value;
    set_chi_so_thi_truong(value)
  };

  const onChangeIndexPriceChartTimeSpan = (e: any) => {
    const value = e.target.value;
    set_time_span(value)
  };

  const onChangeTttt = (e: any) => {
    const value = e.target.value;
    set_tttt_dttk(value)
  };

  const onChangeMobileTaMode = (e: any) => {
    const value = e.target.value;
    set_mobile_ta_mode(value)
  };

  const onChangeKntdId = (e: any) => {
    const value = e.target.value;
    set_id_kntd(value)
  };

  const onChangeSwitchKntd = (e: any) => {
    const value = e.target.value;
    set_switch_kntd(value)
  };

  const chi_so_thi_truong_mobile_items: any = [
    {
      key: 'TQ',
      label: 'Tổng quan',
    },
    {
      key: 'BD',
      label: 'Biểu đồ',
    },
    {
      key: 'PTKT',
      label: 'PTKT',
    },
  ];

  const onChangeChiSoThiTruongMobile: MenuProps['onClick'] = (e) => {
    set_chi_so_thi_truong(e.key);
  };

  const tttt_mobile_items: any = [
    {
      key: 'TTTT',
      label: ww > 500 ? 'Trạng thái thị truờng' : 'Trạng thái TT',
    },
    {
      key: 'DTTK',
      label: ww > 500 ? 'Dòng tiền & Thanh khoản' : 'DT & TK',
    },
  ];

  const onChangeTtttMobile: MenuProps['onClick'] = (e) => {
    set_tttt_dttk(e.key);
  };

  const switch_top_mobile_items: any = [
    {
      key: 'top',
      label: 'Top tiền vào',
    },
    {
      key: 'bottom',
      label: 'Top tiền ra',
    },
  ];

  const onChangeSwitchTopMobile: MenuProps['onClick'] = (e) => {
    set_switch_top_mobile(e.key);
  };

  const getColorSentiment = (value: number) => {
    if (value < 20) return '#00cccc';
    if (value < 40) return '#e14040';
    if (value < 60) return '#D0be0f';
    if (value < 80) return '#24B75E';
    return '#C031C7';
  };

  const getColorLiquidity = (value: number) => {
    if (value < 60) return '#00cccc';
    if (value < 90) return '#e14040';
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
              <Row style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>Chỉ số thị trường</p>
                <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
              </Row>
              <Row gutter={10}>
                <Col xs={8} sm={6} md={5} lg={5} xl={4}>
                  <Button onClick={() => { set_index_name('VNINDEX') }} type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button onClick={() => { set_index_name('VN30') }} type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {index_card_df?.filter(item => item.stock === 'VN30')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {index_card_df?.filter(item => item.stock === 'VN30')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'VN30')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((index_card_df?.filter(item => item.stock === 'VNINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button onClick={() => { set_index_name('HNXINDEX') }} type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((index_card_df?.filter(item => item.stock === 'HNXINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button onClick={() => { set_index_name('UPINDEX') }} type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((index_card_df?.filter(item => item.stock === 'UPINDEX')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                  <Button onClick={() => { set_index_name('VN30F1M') }} type='text' style={{
                    height: '60px', background: '#161616', borderRadius: '5px',
                    margin: 0, padding: 0, width: '100%',
                    marginBottom: '10px', display: 'flex', flexDirection: 'column'
                  }}>
                    <p style={{
                      height: '28px', color: 'white', fontSize: pixel(0.015, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                      margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                    }}>
                      {index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.stock}
                    </p>
                    <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
                      <p style={{
                        color: 'white', fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: `0px 0px 0px ${pixel(0.01, 0)}`
                      }}>
                        {index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.close?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                        color: (index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_value?.toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: pixel(0.012, 10), fontFamily: 'Calibri, sans-serif', color: 'white',
                        fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                        background: (index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) > 0.0001 ? '#24B75E' :
                          ((index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) >= -0.0001 &&
                            (index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                      }}>
                        {((index_card_df?.filter(item => item.stock === 'VN30F1M')[0]?.change_percent) * 100)?.toFixed(2)}%
                      </p>
                    </div>
                  </Button>
                </Col>
                <Col xs={16} sm={18} md={19} lg={19} xl={20}>
                  <Row gutter={20} style={{ height: ww > 768 ? '60px' : '100px', marginBottom: '10px' }}>
                    <Col span={12} style={{ display: 'flex', flexDirection: ww > 800 ? 'row' : 'column' }}>
                      {chi_so_thi_truong === 'TQ' && (
                        <>
                          <div style={{ marginLeft: ww > 800 ? '10px' : '-10px' }}>
                            <p style={{ fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', color: '#B3B3B3', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                              Khối lượng giao dịch
                            </p>
                            <p style={{ fontSize: pixel(0.016, 14), fontFamily: 'Calibri, sans-serif', color: 'white', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                              {market_info_df?.reduce((sum, item) => sum + item.volume, 0).toLocaleString('en-US')}
                            </p>
                          </div>
                          <div style={{ marginLeft: ww > 800 ? '40px' : '-10px', marginTop: ww > 800 ? '0px' : '10px' }}>
                            <p style={{ fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', color: '#B3B3B3', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                              Giá trị giao dịch
                            </p>
                            <p style={{ fontSize: pixel(0.016, 14), fontFamily: 'Calibri, sans-serif', color: 'white', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0 }}>
                              {Math.round(market_info_df?.reduce((sum, item) => sum + item.value, 0)).toLocaleString('en-US')} <span style={{ fontSize: pixel(0.015, 12), color: '#B3B3B3' }}>Tỷ</span>
                            </p>
                          </div>
                        </>
                      )}
                      {(chi_so_thi_truong === 'BD' || chi_so_thi_truong === 'PTKT') && (
                        <>
                          <Button type='text' style={{
                            height: '60px', borderRadius: '5px',
                            margin: 0, padding: 0, width: '100%',
                            marginBottom: '10px', display: 'flex', flexDirection: 'column', marginTop: '-5px'
                          }}>
                            <p style={{
                              height: '28px', color: 'white', fontSize: pixel(0.02, 14), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                              margin: `1px 0px 0px ${pixel(0.01, 0)}`, display: 'flex', alignItems: 'center'
                            }}>
                              Chỉ số {index_name}
                            </p>
                            <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center', marginTop: '8px' }}>
                              <p style={{
                                color: 'white', fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                                margin: `0px 0px 0px ${pixel(0.01, 0)}`
                              }}>
                                {index_card_df?.filter(item => item.stock === index_name)?.[0]?.close?.toFixed(2)}
                              </p>
                              <p style={{
                                fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif',
                                fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                                color: (index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_percent) > 0.0001 ? '#24B75E' :
                                  ((index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_percent) >= -0.0001 &&
                                    (index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                              }}>
                                {index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_value?.toFixed(2)}
                              </p>
                              <p style={{
                                fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', color: 'white',
                                fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                                background: (index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_percent) > 0.0001 ? '#24B75E' :
                                  ((index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_percent) >= -0.0001 &&
                                    (index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_percent) <= 0.0001 ? '#D0be0f' : '#e14040')
                              }}>
                                {((index_card_df?.filter(item => item.stock === index_name)?.[0]?.change_percent) * 100)?.toFixed(2)}%
                              </p>
                            </div>
                          </Button>
                        </>
                      )}
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {ww > 768 && (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Radio.Group
                            className="custom-radio-group"
                            defaultValue={chi_so_thi_truong}
                            buttonStyle="solid"
                            onChange={onChangeChiSoThiTruong}
                            style={{ display: 'flex', width: '100%', marginTop: '5px', height: '20px' }}
                          >
                            <Radio.Button value="TQ" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                              }}>Tổng quan
                            </Radio.Button>
                            <Radio.Button value="BD" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                              }}>Biểu đồ
                            </Radio.Button>
                            <Radio.Button value="PTKT" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                              }}>PTKT
                            </Radio.Button>
                          </Radio.Group>
                          {chi_so_thi_truong === 'BD' && (
                            <Radio.Group
                              className="custom-radio-group" size="small"
                              defaultValue={time_span}
                              buttonStyle="solid"
                              onChange={onChangeIndexPriceChartTimeSpan}
                              style={{ display: 'flex', width: '100%', marginTop: '20px', height: '20px' }}
                            >
                              <Radio.Button value="1M" className="custom-radio-button"
                                style={{
                                  fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                                }}>1M
                              </Radio.Button>
                              <Radio.Button value="3M" className="custom-radio-button"
                                style={{
                                  fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                                }}>3M
                              </Radio.Button>
                              <Radio.Button value="6M" className="custom-radio-button"
                                style={{
                                  fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                                }}>6M
                              </Radio.Button>
                              <Radio.Button value="1Y" className="custom-radio-button"
                                style={{
                                  fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                                }}>1Y
                              </Radio.Button>
                            </Radio.Group>
                          )}
                        </div>
                      )}
                      {ww <= 768 && (
                        <Menu
                          theme='dark'
                          onClick={onChangeChiSoThiTruongMobile}
                          className="cstt-menu"
                          style={{ width: '100%', background: 'black', fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf', height: '100px' }}
                          defaultOpenKeys={[chi_so_thi_truong]}
                          selectedKeys={[chi_so_thi_truong]}
                          mode="vertical"
                          items={chi_so_thi_truong_mobile_items}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    {chi_so_thi_truong === 'TQ' && (
                      <>
                        <Col xs={24} sm={24} md={12} lg={11} xl={10} style={{ display: 'flex', justifyContent: 'center', height: '240px' }}>
                          <MarketBreathChart data={market_info_df} width={ww > 400 ? '100%' : '200px'} height={ww > 800 ? '230px' : '180px'} ww={ww} pixel={pixel} />
                        </Col>
                        <Col xs={0} sm={0} md={12} lg={13} xl={14}>
                          <MarketTopStockChart data={market_top_stock} ww={ww} pixel={pixel} />
                        </Col>
                      </>
                    )}
                    {chi_so_thi_truong === 'BD' && (
                      <>
                        {ww < 768 && (
                          <Radio.Group
                            className="custom-radio-group" size="small"
                            defaultValue={time_span}
                            buttonStyle="solid"
                            onChange={onChangeIndexPriceChartTimeSpan}
                            style={{ display: 'flex', width: '100%', marginTop: '-5px', height: '20px' }}
                          >
                            <Radio.Button value="1M" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                              }}>1M
                            </Radio.Button>
                            <Radio.Button value="3M" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                              }}>3M
                            </Radio.Button>
                            <Radio.Button value="6M" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                              }}>6M
                            </Radio.Button>
                            <Radio.Button value="1Y" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                              }}>1Y
                            </Radio.Button>
                          </Radio.Group>
                        )}
                        <IndexPriceChart data={index_price_chart_df} index_name={index_name} time_span={time_span} width='100%' height={ww > 768 ? '270px' : '215px'} />
                      </>
                    )}
                    {chi_so_thi_truong === 'PTKT' && (
                      <>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          {ww < 768 && (
                            <Radio.Group
                              className="custom-radio-group" size="small"
                              defaultValue={mobile_ta_mode}
                              buttonStyle="solid"
                              onChange={onChangeMobileTaMode}
                              style={{ display: 'flex', width: '100%', marginTop: '-5px', height: '20px' }}
                            >
                              <Radio.Button value="month" className="custom-radio-button"
                                style={{
                                  fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                                }}>Tháng
                              </Radio.Button>
                              <Radio.Button value="quarter" className="custom-radio-button"
                                style={{
                                  fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                                }}>Quý
                              </Radio.Button>
                              <Radio.Button value="year" className="custom-radio-button"
                                style={{
                                  fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                                }}>Năm
                              </Radio.Button>
                            </Radio.Group>
                          )}
                          <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0, marginTop: ww > 768 ? '0px' : '15px' }}>
                            <p style={{
                              fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                              marginTop: '1px', margin: 0, height: ww > 768 ? '32px' : '22px'
                            }}>Chỉ số {ww > 768 ? 'tháng' : (mobile_ta_mode === 'month' ? 'tháng' : (mobile_ta_mode === 'quarter' ? 'quý' : 'năm'))}</p>
                            <TaTable data={ta_index_df} index_name={index_name} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <TaTable data={ta_index_df} index_name={index_name} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <TaTable data={ta_index_df} index_name={index_name} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                          </div>
                        </Col>
                        <Col xs={0} sm={0} md={8} lg={8} xl={8}>
                          <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0, marginTop: ww > 768 ? '0px' : '15px' }}>
                            <p style={{
                              fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                              marginTop: '1px', margin: 0, height: ww > 768 ? '32px' : '22px'
                            }}>Chỉ số quý</p>
                            <TaTable data={ta_index_df} index_name={index_name} id='quarter' ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <TaTable data={ta_index_df} index_name={index_name} id='quarter' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <TaTable data={ta_index_df} index_name={index_name} id='quarter' ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                          </div>
                        </Col>
                        <Col xs={0} sm={0} md={8} lg={8} xl={8}>
                          <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0, marginTop: ww > 768 ? '0px' : '15px' }}>
                            <p style={{
                              fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                              marginTop: '1px', margin: 0, height: ww > 768 ? '32px' : '22px'
                            }}>Chỉ số năm</p>
                            <TaTable data={ta_index_df} index_name={index_name} id='year' ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <TaTable data={ta_index_df} index_name={index_name} id='year' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <TaTable data={ta_index_df} index_name={index_name} id='year' ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row >
              <Row gutter={25} style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col xs={16} sm={15} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {switch_kntd === 'NN' ? 'Giao dịch nước ngoài' : 'Giao dịch tự doanh'}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                <Col xs={8} sm={9} md={10} lg={10} xl={10}>
                  {ww > 768 && (
                    <Radio.Group
                      className="custom-radio-group"
                      defaultValue={switch_kntd}
                      buttonStyle="solid"
                      onChange={onChangeSwitchKntd}
                      style={{ display: 'flex', width: '100%', marginTop: '5px', height: '30px' }}
                    >
                      <Radio.Button value="NN" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Nước ngoài
                      </Radio.Button>
                      <Radio.Button value="TD" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Tự doanh
                      </Radio.Button>
                    </Radio.Group>
                  )}
                </Col>
              </Row>
              <Row gutter={10}>
                <Col xs={12} sm={10} md={6} lg={6} xl={6}>
                  {ww <= 768 && (
                    <Radio.Group
                      className="custom-radio-group" size='small'
                      defaultValue={switch_kntd}
                      buttonStyle="solid"
                      onChange={onChangeSwitchKntd}
                      style={{ display: 'flex', width: '100%', marginTop: '5px', height: '30px' }}
                    >
                      <Radio.Button value="NN" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Nước ngoài
                      </Radio.Button>
                      <Radio.Button value="TD" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Tự doanh
                      </Radio.Button>
                    </Radio.Group>
                  )}
                  <Radio.Group
                    className="custom-radio-group" size='small'
                    defaultValue={id_kntd}
                    buttonStyle="solid"
                    onChange={onChangeKntdId}
                    style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '10px' : '5px', height: '40px' }}
                  >
                    <Radio.Button value="HSX" className="custom-radio-button"
                      style={{
                        fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                      }}>HSX
                    </Radio.Button>
                    <Radio.Button value="HNX" className="custom-radio-button"
                      style={{
                        fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                      }}>HNX
                    </Radio.Button>
                    <Radio.Button value="UPCOM" className="custom-radio-button"
                      style={{
                        fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                      }}>UPCOM
                    </Radio.Button>
                  </Radio.Group>
                  <NnTdBuySellTable data={nn_td_buy_sell_df} id={id_kntd} switch_kntd={switch_kntd}
                    fontSize={pixel(0.013, 11)} lineHeight={ww > 768 ? '34px' : '23px'} width='100%' height={ww > 768 ? '145px' : '115px'} marginTop={ww > 768 ? '0px' : '5px'} />
                </Col>
                <Col xs={12} sm={14} md={18} lg={18} xl={18}>
                  <NnTdHispory data={nn_td_20p_df} id={id_kntd} switch_kntd={switch_kntd} ww={ww} fontSize={pixel(0.015, 17)} />
                </Col>
              </Row>
              <Row>
                <NdTdTopStockChart data={nn_td_top_stock} ww={ww} pixel={pixel} id={id_kntd} switch_kntd={switch_kntd} />
              </Row>
              <Row gutter={25} style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {tttt_dttk === 'TTTT' ? 'Trạng thái thị trường' : 'Dòng tiền & Thanh khoản'}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                  {ww > 900 && (
                    <Radio.Group
                      className="custom-radio-group"
                      defaultValue={tttt_dttk}
                      buttonStyle="solid"
                      onChange={onChangeTttt}
                      style={{ display: 'flex', width: '100%', marginTop: '5px', height: '50px' }}
                    >
                      <Radio.Button value="TTTT" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Trạng thái thị trường
                      </Radio.Button>
                      <Radio.Button value="DTTK" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Dòng tiền & Thanh khoản
                      </Radio.Button>
                    </Radio.Group>
                  )}
                  {ww <= 900 && (
                    <Menu
                      theme='dark'
                      onClick={onChangeTtttMobile}
                      className="tttt-menu"
                      style={{ width: '100%', background: 'black', fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf', height: '50px' }}
                      defaultOpenKeys={[tttt_dttk]}
                      selectedKeys={[tttt_dttk]}
                      mode="vertical"
                      items={tttt_mobile_items}
                    />
                  )}
                </Col>
              </Row>
              {tttt_dttk === 'TTTT' && (
                <>
                  <Row gutter={10} style={{ marginTop: '25px' }}>
                    <Col xs={8} sm={7} md={5} lg={5} xl={4}>
                      <div style={{ background: '#161616', padding: '10px', borderRadius: '5px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{
                          color: 'white', fontSize: pixel(0.016, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                        }}> Trạng thái tâm lý
                        </p>
                        <SentimentGaugeChart data={market_sentiment} width='100%' height='150px' ww={ww} />
                      </div>
                      <div style={{
                        background: getColorSentiment(market_sentiment?.[0]?.last_ratio),
                        padding: '10px', borderRadius: '5px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px', height: '30px'
                      }}>
                        <p style={{
                          color: 'white', fontSize: pixel(0.016, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                        }}> {market_sentiment?.[0]?.last_sentiment}
                        </p>
                      </div>
                    </Col>
                    <Col xs={16} sm={17} md={19} lg={19} xl={20}>
                      <SentimentLineChart data={market_sentiment} width='100%' height='250px' />
                    </Col>
                  </Row>
                  <Row gutter={10} style={{ marginTop: '20px' }}>
                    <Col xs={8} sm={7} md={5} lg={5} xl={4}>
                      <div style={{ background: '#161616', padding: '10px', borderRadius: '5px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{
                          color: 'white', fontSize: pixel(0.016, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                        }}> Chỉ số thanh khoản
                        </p>
                        <LiquidityGaugeChart data={itd_score_liquidity_last} width='100%' height='150px' ww={ww} />
                      </div>
                      <div style={{
                        background: getColorLiquidity(itd_score_liquidity_last?.filter((item: any) => item.name === 'Thị trường')[0]?.liquidity * 100),
                        padding: '10px', borderRadius: '5px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px', height: '30px'
                      }}>
                        <p style={{
                          color: 'white', fontSize: pixel(0.016, 11), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', margin: 0, padding: 0, width: '100%', display: 'flex', justifyContent: 'center'
                        }}> {itd_score_liquidity_last?.filter((item: any) => item.name === 'Thị trường')[0]?.liquid_state}
                        </p>
                      </div>
                    </Col>
                    <Col xs={16} sm={17} md={19} lg={19} xl={20}>
                      <LiquidityLineChart data={itd_score_liquidity_df} width='100%' height='250px' />
                    </Col>
                  </Row>
                </>
              )}
              {tttt_dttk === 'DTTK' && (
                <>
                  <Row gutter={10} style={{ marginTop: '20px' }}>
                    <Col xs={12} sm={10} md={8} lg={8} xl={8}>
                      <MarketWeekScoreChart data={group_score_week} ww={ww} fontSize={pixel(0.015, 17)} />
                    </Col>
                    <Col xs={12} sm={14} md={16} lg={16} xl={16}>
                      <MarketMonthScoreChart data={group_score_month} ww={ww} fontSize={pixel(0.015, 17)} />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '30px' }}>
                    <LiquidityLineChart20p data={eod_group_liquidity_df} fontSize={pixel(0.015, 17)} width='100%' height='250px' />
                  </Row>
                </>
              )}
              <Row gutter={25} style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Cấu trúc sóng thị trường
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row>
                <MarketStructureChart data={market_ms} ww={ww} fontSize={pixel(0.015, 17)} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '20px' }}>
                <Col xs={12} sm={12} md={24} lg={24} xl={24}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Top cổ phiếu
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                <Col xs={12} sm={12} md={0} lg={0} xl={0}>
                  <Menu
                    theme='dark'
                    onClick={onChangeSwitchTopMobile}
                    className="tttt-menu"
                    style={{ width: '100%', background: 'black', fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf', height: '50px' }}
                    defaultOpenKeys={[switch_top_mobile]}
                    selectedKeys={[switch_top_mobile]}
                    mode="vertical"
                    items={switch_top_mobile_items}
                  />
                </Col>
              </Row>
              <Row gutter={10}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  {switch_top_mobile === 'top' && (
                    <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0 }}>
                      <p style={{
                        fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                        marginTop: '1px', margin: 0, height: ww > 768 ? '32px' : '22px'
                      }}>Top cổ phiếu dòng tiền vào mạnh</p>
                      <TopCoPhieuTable data={market_top_stock} type='top' ww={ww}
                        fontSize={pixel(0.013, 11)} lineHeight='34px' width='100%' height='375px' />
                    </div>
                  )}
                  {switch_top_mobile === 'bottom' && (
                    <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0 }}>
                      <p style={{
                        fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                        marginTop: '1px', margin: 0, height: ww > 768 ? '32px' : '22px'
                      }}>Top cổ phiếu dòng tiền ra mạnh</p>
                      <TopCoPhieuTable data={market_top_stock} type='bottom' ww={ww}
                        fontSize={pixel(0.013, 11)} lineHeight='34px' width='100%' height='375px' />
                    </div>
                  )}
                </Col>
                <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                  <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0 }}>
                    <p style={{
                      fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                      marginTop: '1px', margin: 0, height: ww > 768 ? '32px' : '22px'
                    }}>Top cổ phiếu dòng tiền ra mạnh</p>
                    <TopCoPhieuTable data={market_top_stock} type='bottom' ww={ww}
                      fontSize={pixel(0.013, 11)} lineHeight='34px' width='100%' height='375px' />
                  </div>
                </Col>
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}
