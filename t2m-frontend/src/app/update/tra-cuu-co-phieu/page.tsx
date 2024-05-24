'use client'
import { sendRequest } from "@/utlis/api"
import { Input, Col, Menu, MenuProps, Radio, Row, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import './styles.css'

import StockPriceChart from "./components/thong_tin_co_phieu/stock_price_chart";
import SearchComponent from "./components/search_bar";
import StockTaTable from "./components/thong_tin_co_phieu/stock_ta_table";
import DtVaTkTrongPhien from "./components/dien_bien_dong_tien/dt_va_tk_trong_phien";
import StockWeekScoreChart from "./components/dien_bien_dong_tien/score_week";
import StockMonthScoreChart from "./components/dien_bien_dong_tien/score_month";
import StockRankingChart from "./components/suc_manh_dong_tien/stock_ranking";
import StockLiquidityLineChart20p from "./components/suc_manh_dong_tien/thanh_khoan_20p";


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
  const [data_state, set_data_state] = useState(true);

  const getData = async (tableName: string, columnName: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
      queryParams: { columnName: columnName, columnValue: select_stock },
    })
    // if (!res.data || res.data.length < 1) { set_data_state(data_state === true ? false : true) }
    if (tableName === 'update_time') {
      await set_update_time(res.data)
    } else if (tableName === 'stock_price_chart_df') {
      await set_stock_price_chart_df(res.data)
    } else if (tableName === 'stock_liquidty_score_t0') {
      await set_stock_liquidty_score_t0(res.data)
    } else if (tableName === 'stock_score_week') {
      await set_stock_score_week(res.data)
    } else if (tableName === 'stock_score_month') {
      await set_stock_score_month(res.data)
    } else if (tableName === 'stock_score_power_df') {
      await set_stock_score_power_df(res.data)
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
      getData('stock_liquidty_score_t0', 'stock');
      getData('stock_score_week', 'stock');
      getData('stock_score_month', 'stock');
      getData('stock_score_power_df', 'stock');
      getData('eod_score_df', null);
      getData('stock_ta_df', 'stock');
    };
    fetchData();
    const interval = setInterval(fetchData, 60 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [select_stock, data_state]);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [eod_score_df, set_eod_score_df] = useState<any[]>([]);
  const [stock_price_chart_df, set_stock_price_chart_df] = useState<any[]>([]);
  const [stock_ta_df, set_stock_ta_df] = useState<any[]>([]);
  const [stock_liquidty_score_t0, set_stock_liquidty_score_t0] = useState<any[]>([]);
  const [stock_score_week, set_stock_score_week] = useState<any[]>([]);
  const [stock_score_month, set_stock_score_month] = useState<any[]>([]);
  const [stock_score_power_df, set_stock_score_power_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [time_span, set_time_span] = useState('1M');
  const [thong_tin_cp, set_thong_tin_cp] = useState('BD');
  const [mobile_ta_mode, set_mobile_ta_mode] = useState('month');

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

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

  const getColorLiquidity = (value: number) => {
    if (value < 60) return '#00cccc';
    if (value < 90) return '#e14040';
    if (value < 120) return '#D0be0f';
    if (value < 150) return '#24B75E';
    return '#C031C7';
  };

  const getColorStockRank = (value: number) => {
    if (value < 10) return '#C031C7';
    if (value < 50) return '#24B75E';
    if (value < 150) return '#D0be0f';
    if (value < 250) return '#e14040';
    return '#00cccc';
  };

  const getColorTopRankCount = (value: number) => {
    if (value < 1) return '#00cccc';
    if (value < 3) return '#e14040';
    if (value < 5) return '#D0be0f';
    if (value < 10) return '#24B75E';
    return '#C031C7';
  };

  const getColorIndustryPerform = (value: string) => {
    if (value === 'Hiệu suất A') return '#24B75E';
    if (value === 'Hiệu suất B') return '#025bc4';
    if (value === 'Hiệu suất C') return '#D0be0f';
    if (value === 'Hiệu suất D') return '#e14040';
  };

  const getColorMarketCap = (value: string) => {
    if (value === 'LARGECAP') return '#24B75E';
    if (value === 'MIDCAP') return '#025bc4';
    if (value === 'SMALLCAP') return '#D0be0f';
    if (value === 'PENNY') return '#e14040';
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
              <Row style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', marginTop: '50px' }}>
                <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>Thông tin cổ phiếu</p>
                <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
              </Row>
              <Row gutter={10} style={{ marginTop: '0px' }}>
                <Col xs={8} sm={6} md={5} lg={5} xl={4}>
                  <div style={{
                    width: '100%', height: '185px', background: '#161616',
                    padding: '10px', borderRadius: '5px'
                  }}>
                    <Row>
                      <Col>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          Dòng tiền trong phiên
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.t0_score > 0 ? '#24B75E' :
                            (eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.t0_score < 0 ? '#e14040' : '#D0be0f'),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.t0_score.toFixed(2)}
                        </p>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Dòng tiền trong tuần
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.t5_score > 0 ? '#24B75E' :
                            (eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.t5_score < 0 ? '#e14040' : '#D0be0f'),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.t5_score.toFixed(2)}
                        </p>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Chỉ số thanh khoản
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: getColorLiquidity(eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.liquid_ratio * 100),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {`${(eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.liquid_ratio * 100).toFixed(2)}%`}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Xếp hạng
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: getColorStockRank(eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.rank),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.rank}
                        </p>
                      </Col>
                      <Col span={12}>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Top 10%
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: getColorTopRankCount(eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.top_count),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.top_count}
                          <span style={{ color: '#B3B3B3', fontSize: pixel(0.012, 9) }}> lần</span>
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div style={{
                    width: '100%', height: '145px', background: '#161616',
                    padding: '10px', borderRadius: '5px', marginTop: '10px'
                  }}>
                    <Row>
                      <Col>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          Hiệu suất cổ phiếu
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: 'white',
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.stock_perform}
                          &nbsp;
                          <span style={{ color: '#C031C7', fontSize: pixel(0.015, 12) }}>
                            {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.t2m_select}
                          </span>
                        </p>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Nhóm ngành
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: 'white',
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.industry_name}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={13}>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Hiệu suất
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: getColorIndustryPerform(eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.industry_perform),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.industry_perform}
                        </p>
                      </Col>
                      <Col span={11}>
                        <p style={{
                          fontSize: pixel(0.012, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Vốn hoá
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 9), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: getColorMarketCap(eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.marketcap_group),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {eod_score_df?.filter(item => item.stock === select_stock)?.[0]?.marketcap_group}
                        </p>
                      </Col>
                    </Row>
                  </div>
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
                              margin: `1px 0px 0px ${pixel(0.002, 0)}`, display: 'flex', alignItems: 'center'
                            }}>
                              Cổ phiếu {select_stock}
                            </p>
                            <div style={{ height: '24px', display: 'flex', margin: 0, padding: 0, alignItems: 'center', marginTop: '8px' }}>
                              <p style={{
                                color: 'white', fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                                margin: `0px 0px 0px ${pixel(0.002, 0)}`
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
                              }}>Biểu đồ giá
                            </Radio.Button>
                            <Radio.Button value="PTKT" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                              }}>Phân tích kỹ thuật
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
                        <StockPriceChart data={stock_price_chart_df} select_stock={select_stock} time_span={time_span} width='100%' height={ww > 768 ? '270px' : '255px'} />
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
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '64px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '64px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 768 ? 'month' : mobile_ta_mode} ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '62px'} marginTop={ww > 768 ? '8px' : '8px'} />
                          </div>
                        </Col>
                        <Col xs={0} sm={0} md={8} lg={8} xl={8}>
                          <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0, marginTop: ww > 768 ? '0px' : '15px' }}>
                            <p style={{
                              fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                              marginTop: '1px', margin: 0, height: ww > 768 ? '32px' : '22px'
                            }}>Chỉ số quý</p>
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
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
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0 }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 768 ? '20px' : '19px'}
                              width='100%' height={ww > 768 ? '70px' : '50px'} marginTop={ww > 768 ? '8px' : '8px'} />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Diễn biến dòng tiền cổ phiếu ${select_stock}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: '30px' }}>
                <DtVaTkTrongPhien data={stock_liquidty_score_t0} select_stock={select_stock} ww={ww} fontSize={pixel(0.017, 17)} />
              </Row>
              <Row gutter={10} style={{ marginTop: '20px' }}>
                <Col xs={12} sm={10} md={8} lg={8} xl={8}>
                  <StockWeekScoreChart data={stock_score_week} ww={ww} select_stock={select_stock} fontSize={pixel(0.015, 17)} />
                </Col>
                <Col xs={12} sm={14} md={16} lg={16} xl={16}>
                  <StockMonthScoreChart data={stock_score_month} ww={ww} select_stock={select_stock} fontSize={pixel(0.015, 17)} />
                </Col>
              </Row>
              <Row style={{ marginTop: '40px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Sức mạnh dòng tiền cổ phiếu ${select_stock}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: ww > 768 ? '30px' : '20px' }}>
                <Col span={12}>
                  <StockRankingChart data={stock_score_power_df} ww={ww} select_stock={select_stock} fontSize={pixel(0.017, 17)} stock_count={eod_score_df?.length} />
                </Col>
                <Col span={12}>
                </Col>
              </Row>
              <Row style={{ marginTop: ww > 768 ? '20px' : '10px' }}>
                <StockLiquidityLineChart20p data={stock_score_power_df} select_stock={select_stock} fontSize={pixel(0.017, 17)} />
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}