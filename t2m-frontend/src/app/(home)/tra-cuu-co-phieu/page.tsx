'use client'
import { sendRequest } from "@/utlis/api"
import { Input, Col, Menu, MenuProps, Radio, Row, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import './styles.css'

import SearchComponent from "./components/search_bar/search_bar";
import StockTaTable from "./components/thong_tin_co_phieu/stock_ta_table";
import StockRankingChart from "./components/suc_manh_dong_tien/stock_ranking";
import GroupRankingChart from "./components/dong_tien_nhom_lien_quan/group_ranking";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { sessionLimit } from "@/utlis/sessionLimit";
import { resetAuthState } from "@/redux/authSlice";
import LockSection from "@/components/subscribers/blurComponents";
import StockMoneyFlowT5Chart from "./components/thong_tin_co_phieu/dong_tien_t5";
import StockScorePriceCorrelationChart from "./components/suc_manh_dong_tien/tuong_quan_dong_tien";
import StockWeekScore from "./components/suc_manh_dong_tien/dong_tien_trong_tuan";
import StockPriceChart from "./components/thong_tin_co_phieu/stock_price_chart";


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

  const [select_stock, set_select_stock] = useState('AAA');
  const [select_industry, set_select_industry] = useState('Hoá chất');
  const [select_perform, set_select_perform] = useState('Hiệu suất B');
  const [select_cap, set_select_cap] = useState('SMALLCAP');

  const getData = async (tableName: string, columnName: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
      queryParams: { columnName: columnName, columnValue: select_stock },
    })
    if (tableName === 'market_update_time') {
      await set_market_update_time(res.data)
    } else if (tableName === 'stock_score_5p_df') {
      await set_stock_score_5p_df(res.data)
    } else if (tableName === 'stock_score_power_df') {
      await set_stock_score_power_df(res.data)
    } else if (tableName === 'stock_score_filter_df') {
      await set_stock_score_filter_df(res.data)
    } else if (tableName === 'stock_ta_df') {
      await set_stock_ta_df(res.data)
    } else if (tableName === 'group_score_power_df') {
      await set_group_score_power_df(res.data)
    } else if (tableName === 'stock_price_chart_df') {
      await set_stock_price_chart_df(res.data)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      getData('market_update_time', null);
      getData('stock_score_power_df', 'stock');
      getData('stock_score_filter_df', null);
      getData('stock_ta_df', 'stock');
      getData('group_score_power_df', null);
      getData('stock_score_5p_df', 'stock');
      getData('stock_price_chart_df', 'stock');
    };
    fetchData();

    function resetInterval() {
      clearInterval(interval);
      interval = setInterval(fetchData, 10000);
    }
    let interval = setInterval(fetchData, 10000);
    window.addEventListener('click', resetInterval);
    window.addEventListener('wheel', resetInterval);
    window.addEventListener('mousemove', resetInterval);
  }, [select_stock]);

  //State lưu trữ dữ liệu cổ phiếu
  const [market_update_time, set_market_update_time] = useState<any[]>([]);
  const [stock_score_filter_df, set_stock_score_filter_df] = useState<any[]>([]);
  const [group_score_power_df, set_group_score_power_df] = useState<any[]>([]);
  const [stock_score_5p_df, set_stock_score_5p_df] = useState<any[]>([]);
  const [stock_ta_df, set_stock_ta_df] = useState<any[]>([]);
  const [stock_score_power_df, set_stock_score_power_df] = useState<any[]>([]);
  const [stock_price_chart_df, set_stock_price_chart_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [thong_tin_cp, set_thong_tin_cp] = useState('BD');
  const [mobile_ta_mode, set_mobile_ta_mode] = useState('month');

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeChiSoThiTruong = (e: any) => {
    const value = e.target.value;
    set_thong_tin_cp(value)
  };

  const thong_tin_cp_mobile_items: any = [
    {
      key: 'BD',
      label: 'BD',
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
    if (value < 50) return '#00cccc';
    if (value < 80) return '#e14040';
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

  const getColorStockPerform = (value: string) => {
    const lastChar = value?.charAt(value?.length - 1);
    switch (lastChar) {
      case '1':
        return '#24B75E'; // màu cho ký tự '1'
      case '2':
        return '#025bc4'; // màu cho ký tự '2'
      case '3':
        return '#D0be0f'; // màu cho ký tự '3'
      case '4':
        return '#e14040'; // màu cho ký tự '4'
    }
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
                <Col xs={0} sm={0} md={5} lg={5} xl={4}><div style={{ width: '100%' }} /></Col>
                <Col xs={24} sm={24} md={19} lg={19} xl={20}>
                  <Row gutter={20}>
                    <Col xs={0} sm={0} md={16} lg={16} xl={16}><div style={{ width: '100%' }} /></Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <SearchComponent data={stock_score_filter_df}
                        set_select_stock={set_select_stock}
                        set_select_industry={set_select_industry}
                        set_select_perform={set_select_perform}
                        set_select_cap={set_select_cap}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', marginTop: '50px' }}>
                <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                  {`Thông tin cổ phiếu ${select_stock}`}
                </p>
                <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>
                  {market_update_time?.[0]?.date}
                </p>
              </Row>
              <Row gutter={10} style={{ marginTop: '0px' }}>
                <Col xs={11} sm={10} md={8} lg={8} xl={6}>
                  <div style={{
                    width: '100%', height: ww > 767 ? '170px' : '140px', background: '#161616',
                    padding: '5px 5px 5px 5px', borderRadius: '5px'
                  }}>
                    <Row>
                      <Col span={14}>
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '0px 0px 0px 2px', padding: 0
                        }}>
                          {ww > 767 ? 'Chỉ số thanh khoản' : 'Thanh khoản'}
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: getColorLiquidity(stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.liquid_ratio * 100),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {`${(stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.liquid_ratio * 100).toFixed(2)}%`}
                        </p>
                      </Col>
                      <Col span={10}>
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '0px 0px 0px 2px', padding: 0
                        }}>
                          Xếp hạng
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: getColorStockRank(stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.rank_t5),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {`${stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.rank_t5}/${stock_score_filter_df?.length}`}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <p style={{
                        fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                        color: '#B3B3B3', fontWeight: 'bold', margin: '15px 0px 0px 2px', padding: 0
                      }}>
                        Dòng tiền trong tuần
                      </p>
                      <StockMoneyFlowT5Chart data={stock_score_5p_df} ww={ww} fontSize={pixel(0.012, 11)}
                        height={ww > 767 ? '80px' : '60px'} select_group={select_stock} />
                    </Row>
                  </div>
                  <div style={{
                    width: '100%', height: '145px', background: '#161616',
                    padding: '5px', borderRadius: '5px', marginTop: '10px'
                  }}>
                    <Row>
                      <Col>
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          Hiệu suất cổ phiếu
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: getColorStockPerform(stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.stock_perform),
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.stock_perform}
                        </p>
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          Nhóm ngành
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: 'white',
                          fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                        }}>
                          {stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.industry_name}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={ww > 767 ? 14 : 13}>
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          {ww > 767 ? 'Nhóm hiệu suất' : 'Hiệu suất'}
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: getColorIndustryPerform(stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.industry_perform),
                          fontWeight: 'bold', margin: '5px 0px 0px 2px', padding: 0
                        }}>
                          {stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.industry_perform}
                        </p>
                      </Col>
                      <Col span={ww > 767 ? 10 : 11}>
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                        }}>
                          {ww > 767 ? 'Nhóm vốn hoá' : 'Vốn hoá'}
                        </p>
                        <p style={{
                          fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '16.5px',
                          color: getColorMarketCap(stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.marketcap_group),
                          fontWeight: 'bold', margin: '5px 0px 0px 2px', padding: 0
                        }}>
                          {stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.marketcap_group}
                        </p>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={13} sm={14} md={16} lg={16} xl={18}>
                  <Row gutter={20} style={{ height: '60px', marginBottom: '10px' }}>
                    <Col xs={12} sm={12} md={14} lg={14} xl={14} style={{ display: 'flex', flexDirection: ww > 800 ? 'row' : 'column' }}>
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
                            {stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.close?.toFixed(2)}
                          </p>
                          <p style={{
                            fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif',
                            fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: 0,
                            color: (stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) > 0.0001 ? '#24B75E' :
                              ((stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) >= -0.0001 &&
                                (stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) <= 0.0001 ? '#D0be0f' : '#e14040')
                          }}>
                            {ww > 410 ? stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.value_change?.toFixed(2) : null}
                          </p>
                          <p style={{
                            fontSize: pixel(0.015, 12), fontFamily: 'Calibri, sans-serif', color: 'white',
                            fontWeight: 'bold', margin: `0px 0px 0px ${pixel(0.01, 2)}`, padding: '0px 3px 0px 3px', borderRadius: '5px',
                            background: (stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) > 0.0001 ? '#24B75E' :
                              ((stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) >= -0.0001 &&
                                (stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) <= 0.0001 ? '#D0be0f' : '#e14040')
                          }}>
                            {((stock_score_filter_df?.filter(item => item.stock === select_stock)?.[0]?.price_change) * 100)?.toFixed(2)}%
                          </p>
                        </div>
                      </Button>
                    </Col>
                    <Col xs={12} sm={12} md={10} lg={10} xl={10} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {ww > 767 && (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Radio.Group
                            className="custom-radio-group"
                            defaultValue={thong_tin_cp}
                            buttonStyle="solid"
                            onChange={onChangeChiSoThiTruong}
                            style={{ display: 'flex', width: '100%', marginTop: '-10px', height: '20px' }}
                          >
                            <Radio.Button value="BD" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                              }}>{ww > 400 ? 'Biểu đồ giá' : 'Biểu đồ'}
                            </Radio.Button>
                            <Radio.Button value="PTKT" className="custom-radio-button"
                              style={{
                                fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                              }}>Phân tích kĩ thuật
                            </Radio.Button>
                          </Radio.Group>
                        </div>
                      )}
                      {ww <= 767 && (
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
                        {stock_price_chart_df?.length > 0 && (
                          <StockPriceChart data={stock_price_chart_df} ww={ww} key={JSON.stringify(stock_price_chart_df)} />
                        )}
                      </>
                    )}
                    {thong_tin_cp === 'PTKT' && (
                      <>
                        <LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height={ww > 767 ? '255px' : '235px'} width='100%' marginTop={ww > 767 ? '0px' : '-10px'} />
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          {ww < 767 && (
                            <Radio.Group
                              className="custom-radio-group" size='small'
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
                          <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0, marginTop: ww > 767 ? '0px' : '15px' }}>
                            {ww > 767 && (
                              <p style={{
                                fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                                marginTop: '1px', margin: 0, height: ww > 767 ? '32px' : '22px'
                              }}>Chỉ số {ww > 767 ? 'tháng' : (mobile_ta_mode === 'month' ? 'tháng' : (mobile_ta_mode === 'quarter' ? 'quý' : 'năm'))
                                }</p>
                            )}
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 767 ? 'month' : mobile_ta_mode} ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '0px' : '0px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0, marginTop: '-4px' }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 767 ? 'month' : mobile_ta_mode} ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '5px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0, marginTop: '-4px' }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id={ww > 767 ? 'month' : mobile_ta_mode} ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '5px' : '8px'} />
                          </div>
                        </Col>
                        <Col xs={0} sm={0} md={8} lg={8} xl={8}>
                          <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0, marginTop: ww > 767 ? '0px' : '15px' }}>
                            <p style={{
                              fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                              marginTop: '1px', margin: 0, height: ww > 767 ? '32px' : '22px'
                            }}>Chỉ số quý</p>
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '0px' : '0px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0, marginTop: '-4px' }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '5px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0, marginTop: '-4px' }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='quarter' ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '5px' : '8px'} />
                          </div>
                        </Col>
                        <Col xs={0} sm={0} md={8} lg={8} xl={8}>
                          <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0, marginTop: ww > 767 ? '0px' : '15px' }}>
                            <p style={{
                              fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: pixel(0.016, 15), color: 'white',
                              marginTop: '1px', margin: 0, height: ww > 767 ? '32px' : '22px'
                            }}>Chỉ số năm</p>
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['candle']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '0px' : '0px'}
                            />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0, marginTop: '-4px' }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['ma', 'pivot']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '5px' : '8px'} />
                            <hr style={{ border: 0, height: '1px', backgroundColor: '#dfdfdf', margin: 0, marginTop: '-4px' }} />
                            <StockTaTable data={stock_ta_df} select_stock={select_stock} id='year' ta_name={['fibo']}
                              fontSize={pixel(0.012, 12)} lineHeight={ww > 767 ? '20px' : '16px'}
                              width='100%' height={ww > 767 ? '70px' : '58px'} marginTop={ww > 767 ? '5px' : '8px'} />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '40px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Sức mạnh dòng tiền cổ phiếu ${select_stock}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: ww > 767 ? '30px' : '20px', position: 'relative' }}>
                <LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <StockWeekScore data={stock_score_power_df} ww={ww} select_stock={select_stock} fontSize={pixel(0.017, 16)} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <StockScorePriceCorrelationChart data={stock_score_power_df} ww={ww} select_stock={select_stock} fontSize={pixel(0.017, 16)} />
                </Col>
              </Row>
              <Row gutter={10} style={{ marginTop: '20px', position: 'relative' }}>
                <LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <StockRankingChart data={stock_score_power_df} ww={ww} select_stock={select_stock} fontSize={pixel(0.017, 16)} stock_count={stock_score_filter_df?.length} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Sức mạnh các nhóm liên quan cổ phiếu ${select_stock}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row gutter={10} style={{ position: 'relative' }}>
                <LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <Col span={8}>
                  <GroupRankingChart data={group_score_power_df} ww={ww} select_group={select_industry}
                    switch_group_industry='industry' fontSize={pixel(0.017, 16)} />
                </Col>
                <Col span={8}>
                  <GroupRankingChart data={group_score_power_df} ww={ww} select_group={select_perform}
                    switch_group_industry='group' fontSize={pixel(0.017, 16)} />
                </Col>
                <Col span={8}>
                  <GroupRankingChart data={group_score_power_df} ww={ww} select_group={select_cap}
                    switch_group_industry='group' fontSize={pixel(0.017, 16)} />
                </Col>
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}