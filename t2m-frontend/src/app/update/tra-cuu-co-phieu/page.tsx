'use client'
import { sendRequest } from "@/utlis/api"
import { Input, Col, Menu, MenuProps, Radio, Row, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import './styles.css'

import StockPriceChart from "./components/thong_tin_co_phieu/stock_price_chart";
import SearchComponent from "./components/search_bar";
import StockTaTable from "./components/thong_tin_co_phieu/stock_ta_table";


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

export default function Page4() {
  const [select_stock, set_select_stock] = useState('AAA');

  const getData = async (tableName: string, columnName: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
      queryParams: { columnName: columnName, columnValue: select_stock },
    })
    if (tableName === 'update_time') {
      await set_update_time(res.data)
    } else if (tableName === 'stock_price_chart_df') {
      await set_stock_price_chart_df(res.data)
    } else if (tableName === 'itd_score_liquidity_melted') {
      await set_itd_score_liquidity_melted(res.data)
    } else if (tableName === 'group_score_week') {
      await set_group_score_week(res.data)
    } else if (tableName === 'group_score_month') {
      await set_group_score_month(res.data)
    } else if (tableName === 'group_score_ranking_melted') {
      await set_group_score_ranking_melted(res.data)
    } else if (tableName === 'eod_score_liquidity_melted') {
      await set_eod_score_liquidity_melted(res.data)
    } else if (tableName === 'market_ms') {
      await set_market_ms(res.data)
    } else if (tableName === 'group_stock_top_10_df') {
      await set_group_stock_top_10_df(res.data)
    } else if (tableName === 'eod_score_df') {
      await set_eod_score_df(res.data)
    } else if (tableName === 'stock_ta_df') {
      await set_stock_ta_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time', null);
      getData('stock_price_chart_df', 'stock');

      getData('itd_score_liquidity_melted', 'group_name');
      getData('group_score_week', 'group_name');
      getData('group_score_month', 'group_name');
      getData('group_score_month', 'group_name');
      getData('group_score_ranking_melted', 'group_name');
      getData('eod_score_liquidity_melted', 'group_name');
      getData('market_ms', 'name');
      getData('group_stock_top_10_df', 'name');

      getData('eod_score_df', 'stock');
      getData('stock_ta_df', 'stock');
    };
    fetchData();

    const interval = setInterval(fetchData, 10 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [select_stock]);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [eod_score_df, set_eod_score_df] = useState<any[]>([]);
  const [stock_price_chart_df, set_stock_price_chart_df] = useState<any[]>([]);
  const [stock_ta_df, set_stock_ta_df] = useState<any[]>([]);

  const [itd_score_liquidity_melted, set_itd_score_liquidity_melted] = useState<any[]>([]);
  const [group_score_week, set_group_score_week] = useState<any[]>([]);
  const [group_score_month, set_group_score_month] = useState<any[]>([]);
  const [group_score_ranking_melted, set_group_score_ranking_melted] = useState<any[]>([]);
  const [eod_score_liquidity_melted, set_eod_score_liquidity_melted] = useState<any[]>([]);
  const [market_ms, set_market_ms] = useState<any[]>([]);
  const [group_stock_top_10_df, set_group_stock_top_10_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [switch_group_industry, set_switch_group_industry] = useState('group');
  const [switch_hs_cap, set_switch_hs_cap] = useState('hs');
  const [switch_nhom_nganh_hs, set_switch_nhom_nganh_hs] = useState('A');
  const [time_span, set_time_span] = useState('1M');

  const [thong_tin_cp, set_thong_tin_cp] = useState('BD');
  const [mobile_ta_mode, set_mobile_ta_mode] = useState('month');

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeSelectGroup = (e: any) => {
    const value = e.target.value;
    set_select_stock(value)
  };

  const onChangeIndexPriceChartTimeSpan = (e: any) => {
    const value = e.target.value;
    set_time_span(value)
  };

  const onChangeChiSoThiTruong = (e: any) => {
    const value = e.target.value;
    set_thong_tin_cp(value)
  };

  const thong_tin_cp_mobile_items: any = [
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
    set_thong_tin_cp(e.key);
  };

  const onChangeMobileTaMode = (e: any) => {
    const value = e.target.value;
    set_mobile_ta_mode(value)
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
              <Row>
                <Col xs={0} sm={6} md={5} lg={5} xl={4}><div style={{ width: '100%' }} /></Col>
                <Col xs={24} sm={18} md={19} lg={19} xl={20}>
                  <Row gutter={20}>
                    <Col xs={0} sm={12} md={12} lg={12} xl={12}><div style={{ width: '100%' }} /></Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <SearchComponent data={eod_score_df} set_select_stock={set_select_stock} />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '50px' }}>
                <Col xs={8} sm={6} md={5} lg={5} xl={4}>
                </Col>
                <Col xs={16} sm={18} md={19} lg={19} xl={20}>
                  <Row gutter={20} style={{ height: '60px', marginBottom: '10px' }}>
                    <Col span={12} style={{ display: 'flex', flexDirection: ww > 800 ? 'row' : 'column' }}>
                      {(thong_tin_cp === 'BD' || thong_tin_cp === 'PTKT') && (
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
                              Cổ phiếu {select_stock}
                            </p>
                            <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center', marginTop: '8px' }}>
                              <p style={{
                                color: 'white', fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                                margin: `0px 0px 0px ${pixel(0.01, 0)}`
                              }}>
                                {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.close?.toFixed(2)}
                              </p>
                              <p style={{
                                fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif',
                                fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                                color: (eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) > 0.0001 ? '#24B75E' :
                                  ((eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) >= -0.0001 &&
                                    (eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) <= 0.0001 ? '#D0be0f' : '#e14040')
                              }}>
                                {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.value_change?.toFixed(2)}
                              </p>
                              <p style={{
                                fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', color: 'white',
                                fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                                background: (eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) > 0.0001 ? '#24B75E' :
                                  ((eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) >= -0.0001 &&
                                    (eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) <= 0.0001 ? '#D0be0f' : '#e14040')
                              }}>
                                {((eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) * 100)?.toFixed(2)}%
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
                            defaultValue={thong_tin_cp}
                            buttonStyle="solid"
                            onChange={onChangeChiSoThiTruong}
                            style={{ display: 'flex', width: '100%', marginTop: '5px', height: '20px' }}
                          >
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
                          {thong_tin_cp === 'BD' && (
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
                          style={{ width: '100%', background: 'black', fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf', height: '60px' }}
                          defaultOpenKeys={[thong_tin_cp]}
                          selectedKeys={[thong_tin_cp]}
                          mode="vertical"
                          items={thong_tin_cp_mobile_items}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    {thong_tin_cp === 'BD' && (
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
                        <StockPriceChart data={stock_price_chart_df} select_stock={select_stock} time_span={time_span} width='100%' height={ww > 768 ? '270px' : '215px'} />
                      </>
                    )}
                    {thong_tin_cp === 'PTKT' && (
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
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['fibo']}
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
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['fibo']}
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
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '15px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                {/* <Col xs={16} sm={18} md={19} lg={19} xl={20}>
                  <Row gutter={25} style={{ marginTop: '30px', marginBottom: '10px' }}>
                    <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                      <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                        {`Index nhóm ${select_stock}`}
                      </p>
                      <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                    </Col>
                    <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                      <Radio.Group
                        size='small'
                        className="custom-radio-group"
                        defaultValue={time_span}
                        buttonStyle="solid"
                        onChange={onChangeIndexPriceChartTimeSpan}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '30px' : '10px', height: '20px' }}
                      >
                        <Radio.Button value="1M" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>1M
                        </Radio.Button>
                        <Radio.Button value="3M" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>3M
                        </Radio.Button>
                        <Radio.Button value="6M" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>6M
                        </Radio.Button>
                        <Radio.Button value="1Y" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>1Y
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                  <Row>
                    <StockPriceChart data={stock_price_chart_df} select_stock={select_stock} time_span={time_span} width='100%' height={ww > 768 ? '270px' : '215px'} />
                  </Row>
                </Col> */}
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}