'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Card, Col, Menu, MenuProps, Radio, Row, Tooltip, notification } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { sessionLimit } from "@/utlis/sessionLimit";
import { resetAuthState } from "@/redux/authSlice";
import LockSection from "@/components/subscribers/blurComponents";


import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './styles.css'
import { CheckCircleTwoTone, InfoCircleOutlined } from "@ant-design/icons";
import MarketBullButton from "./components/signal/market_bull_button";
import MarketBearButton from "./components/signal/market_bear_button";
import AllocationLinesChart from "./components/chart/allocation_lines_chart";
import PerformChart from "./components/chart/perform_chart";
import AllocationPieChart from "./components/chart/allocation_pie_chart";
import IndustrySelector from "./components/table/industry_selector";
import HoldingStockTable from "./components/table/holding_stock_table";
import TradedStockTable from "./components/table/traded_stock_table";
import TopIndustryTable from "./components/table/top_industry_table";
import IndustryBullButton from "./components/signal/industry_bull_button";
import IndustryBearButton from "./components/signal/industry_bear_button";


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

export default function Page5() {

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
  const accessLevel = (authInfo?.user?.role === 'T2M ADMIN') || (authInfo?.user?.role === 'T2M CTV') ? 4 : authInfo?.user?.licenseInfo?.accessLevel

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const getData = async (tableName: string) => {
      if (!isMounted) return;

      let res;
      try {
        for (let i = 0; i < 8; i++) {
          try {
            res = await sendRequest<IBackendRes<any>>({
              url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
              method: "GET",
            });

            if ((res.data && res.data.length > 0) || (res.data && tableName === 'auto_holding_stock_df')) {
              break; // Exit loop when data meets conditions
            } else {
              console.log(`[${new Date().toLocaleTimeString()}] Bảng ${tableName} chưa tải xong, thử lại sau 1 giây...`);
              await delay(1000 * Math.min(i + 1, 3)); // Progressive delay with max 3 seconds
            }
          } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error(`Error fetching ${tableName}:`, error);
            await delay(1000);
          }
        }

        // Only update state if component is still mounted and we have data  
        if (isMounted && res?.data) {
          switch (tableName) {
            case 'market_update_time':
              set_market_update_time(res.data);
              break;
            case 'auto_concat_perform_df':
              set_auto_concat_perform_df(res.data);
              break;
            case 'auto_cap_allocation_line_df':
              set_auto_cap_allocation_line_df(res.data);
              break;
            case 'auto_cap_allocation_pie_df':
              set_auto_cap_allocation_pie_df(res.data);
              break;
            case 'auto_holding_stock_df':
              set_auto_holding_stock_df(res.data);
              break;
            case 'auto_traded_stock_df':
              set_auto_traded_stock_df(res.data);
              break;
            case 'auto_market_checklist_df':
              set_auto_market_checklist_df(res.data);
              break;
            case 'auto_industry_checklist_df':
              set_auto_industry_checklist_df(res.data);
              break;
            case 'auto_industry_toplist_df':
              set_auto_industry_toplist_df(res.data);
              break;
            case 'auto_industry_stocklist_df':
              set_auto_industry_stocklist_df(res.data);
              break;
          }
        }
      } catch (error) {
        console.error(`Failed to process data for ${tableName}:`, error);
      }
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          getData('market_update_time'),
          getData('stock_ta_filter_df'),
          getData('group_eod_score_liquidity_df'),
          getData('auto_concat_perform_df'),
          getData('auto_cap_allocation_line_df'),
          getData('auto_cap_allocation_pie_df'),
          getData('auto_holding_stock_df'),
          getData('auto_traded_stock_df'),
          getData('auto_market_checklist_df'),
          getData('auto_industry_checklist_df'),
          getData('auto_industry_toplist_df'),
          getData('auto_industry_stocklist_df'),
        ]);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    // Initial data fetch  
    fetchAllData();

    // Set up interval for periodic refreshes    
    const intervalId = setInterval(fetchAllData, 10000);

    // Cleanup function  
    return () => {
      isMounted = false;
      clearInterval(intervalId);
      abortController.abort();
    };
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [market_update_time, set_market_update_time] = useState<any[]>([]);
  const [auto_concat_perform_df, set_auto_concat_perform_df] = useState<any[]>([]);
  const [auto_cap_allocation_line_df, set_auto_cap_allocation_line_df] = useState<any[]>([]);
  const [auto_cap_allocation_pie_df, set_auto_cap_allocation_pie_df] = useState<any[]>([]);
  const [auto_holding_stock_df, set_auto_holding_stock_df] = useState<any[]>([]);
  const [auto_traded_stock_df, set_auto_traded_stock_df] = useState<any[]>([]);
  const [auto_market_checklist_df, set_auto_market_checklist_df] = useState<any[]>([]);
  const [auto_industry_checklist_df, set_auto_industry_checklist_df] = useState<any[]>([]);
  const [auto_industry_toplist_df, set_auto_industry_toplist_df] = useState<any[]>([]);
  const [auto_industry_stocklist_df, set_auto_industry_stocklist_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [pageSize1, setPageSize1] = useState(10);
  const [pageSize2, setPageSize2] = useState(10);
  const [industryDetail, setIndustryDetail] = useState(false);
  const [selectIndustryDetail, setSelectIndustryDetail] = useState('Bán lẻ');

  //State lưu giữ trạng thái của các filter
  const [time_span, set_time_span] = useState('3M');
  const [placeholder, setPlaceholder] = useState<string | undefined>('Chọn ngành');
  const [filter_holding_nganh, set_filter_holding_nganh] = useState<any[]>([]);
  const [filter_traded_nganh, set_filter_traded_nganh] = useState<any[]>([]);

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangePerformChart = (e: any) => {
    const value = e.target.value;
    set_time_span(value)
  };

  const getColorPerform = (value: number) => {
    if (value >= 0.01) return '#24B75E';
    else if (value <= -0.01) return '#e14040';
    else return '#D0be0f';
  };

  const onChangeIndustryDetail = (e: any) => {
    setIndustryDetail(industryDetail ? false : true)
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
              <Row style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col span={24}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Hiệu suất đầu tư theo hệ thống T2M
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row gutter={ww > 810 ? 20 : 10} style={{ position: 'relative', marginTop: '30px' }}>
                <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <Col xs={8} sm={8} md={6} lg={5} xl={5}>
                  <Radio.Group
                    className="custom-radio-group" size="small"
                    defaultValue={time_span}
                    buttonStyle="solid"
                    onChange={onChangePerformChart}
                    style={{ display: 'flex', width: '100%', height: '20px', marginTop: '10px' }}
                  >
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
                    <Radio.Button value="2Y" className="custom-radio-button"
                      style={{
                        fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.011, 10), color: '#dfdfdf'
                      }}>2Y
                    </Radio.Button>
                  </Radio.Group>
                  <p style={{
                    fontSize: pixel(0.013, 14), fontFamily: 'Calibri, sans-serif', height: '18px',
                    color: '#B3B3B3', fontWeight: 'bold', margin: '40px 0px 0px 0px', padding: 0
                  }}>
                    Khung thời gian
                  </p>
                  <div style={{
                    width: '100%', height: '40px', background: '#161616',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '5px', borderRadius: '5px', marginTop: '10px'
                  }}>
                    <p style={{
                      fontSize: pixel(0.016, 16), fontFamily: 'Calibri, sans-serif',
                      color: 'white',
                      fontWeight: 'bold', margin: 0, padding: 0
                    }}>
                      {time_span === '3M' ? '3 Tháng' : (time_span === '6M' ? '6 Tháng' : (time_span === '1Y' ? '1 Năm' : (time_span === '2Y' ? '2 Năm' : '')))}
                    </p>
                  </div>

                  <p style={{
                    fontSize: pixel(0.013, 14), fontFamily: 'Calibri, sans-serif', height: '18px',
                    color: '#B3B3B3', fontWeight: 'bold', margin: '20px 0px 0px 0px', padding: 0
                  }}>
                    {ww > 500 ? 'Hiệu suất VNINDEX' : 'VNINDEX'}
                  </p>
                  <div style={{
                    width: '100%', height: '40px', background: '#161616',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '5px', borderRadius: '5px', marginTop: '10px'
                  }}>
                    <p style={{
                      fontSize: pixel(0.016, 16), fontFamily: 'Calibri, sans-serif',
                      color: getColorPerform(auto_concat_perform_df?.filter((item: any) => item.time_span === time_span)[0]?.vnindex_perform * 100),
                      fontWeight: 'bold', margin: 0, padding: 0
                    }}>
                      {`${(auto_concat_perform_df?.filter((item: any) => item.time_span === time_span)[0]?.vnindex_perform * 100)?.toFixed(2)}%`}
                    </p>
                  </div>

                  <p style={{
                    fontSize: pixel(0.013, 14), fontFamily: 'Calibri, sans-serif', height: '18px',
                    color: '#B3B3B3', fontWeight: 'bold', margin: '20px 0px 0px 0px', padding: 0
                  }}>
                    {ww > 500 ? 'Hiệu suất hệ thống T2M' : 'Hệ thống T2M'}
                  </p>
                  <div style={{
                    width: '100%', height: '40px', background: '#161616',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '5px', borderRadius: '5px', marginTop: '10px'
                  }}>
                    <p style={{
                      fontSize: pixel(0.016, 16), fontFamily: 'Calibri, sans-serif',
                      color: getColorPerform(auto_concat_perform_df?.filter((item: any) => item.time_span === time_span)[0]?.invest_perform * 100),
                      fontWeight: 'bold', margin: 0, padding: 0
                    }}>
                      {`${(auto_concat_perform_df?.filter((item: any) => item.time_span === time_span)[0]?.invest_perform * 100)?.toFixed(2)}%`}
                    </p>
                  </div>
                </Col>

                <Col xs={16} sm={16} md={18} lg={19} xl={19}>
                  <Row>
                    <Col xs={24} sm={24} md={6} lg={8} xl={8}>
                      <p style={{
                        fontSize: pixel(0.022, 20), fontFamily: 'Calibri, sans-serif',
                        color: auto_concat_perform_df[0]?.final_portion ? '#24B75E' : '#e14040',
                        fontWeight: 'bold', margin: '0px 0px 0px 35px', padding: 0
                      }}>
                        {auto_concat_perform_df[0]?.final_portion ? 'Nắm giữ cổ phiếu' : 'Quan sát'}
                      </p>
                      <p data-tooltip-id="giai-doan-thi-truong-hien-tai" style={{
                        fontSize: pixel(0.013, 12), fontFamily: 'Calibri, sans-serif', height: '18px',
                        color: '#B3B3B3', fontWeight: 'bold', margin: '5px 0px 0px 35px', padding: 0, cursor: 'pointer'
                      }}>
                        {ww > 996 ? 'Giai đoạn thị trường hiện tại' : 'Thị trường'}
                        <InfoCircleOutlined style={{ marginLeft: '7px' }} />
                      </p>
                      <ReactTooltip id="giai-doan-thi-truong-hien-tai" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
                        <p style={{
                          fontSize: pixel(0.011, 11),
                          fontFamily: 'Calibri, sans-serif',
                          background: '#161616',
                          padding: 0,
                          whiteSpace: 'pre-wrap'
                        }}>
                          {'Theo hệ thống T2M, thị trường được chia thành 2 giai đoạn bao gồm:\n'}
                          <strong style={{ color: "#24B75E" }}>Nắm giữ cổ phiếu:</strong>
                          {' Nắm giữ và điều chỉnh danh mục cổ phiếu liên tục theo tỉ trọng phân bổ vốn\n'}
                          <strong style={{ color: "#e14040" }}>Quan sát:</strong>
                          {' Không nắm giữ cổ phiếu và theo dõi các diễn biến dòng tiền chờ đợi cơ hội\n'}
                          {!auto_concat_perform_df[0]?.final_portion ? (
                            <>
                              {'Khi toàn bộ điều kiện bên phải đạt yêu cầu, thị trường sẽ chuyển sang giai đoạn '}
                              <strong style={{ color: "#24B75E" }}>Nắm giữ cổ phiếu</strong>
                            </>
                          ) : (
                            <>
                              {'Khi toàn bộ điều kiện bên phải không đạt yêu cầu, thị trường sẽ chuyển sang giai đoạn '}
                              <strong style={{ color: "#e14040" }}>Quan sát</strong>
                            </>
                          )}
                        </p>
                      </ReactTooltip>
                    </Col>
                    {!auto_concat_perform_df[0]?.final_portion ? (
                      <Col xs={0} sm={0} md={18} lg={16} xl={16}>
                        <Row style={{ marginTop: '5px' }}>
                          <MarketBullButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'portion_raw_check'} name={'Sức mạnh dòng tiền'} />
                          <MarketBullButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'portion_phase_check'} name={'Rủi ro dòng tiền'} />
                          <MarketBullButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'up_check'} name={ww > 850 ? 'Cấu trúc sóng thị trường' : 'Cấu trúc sóng'} />
                        </Row>
                        <Row style={{ marginTop: '5px' }}>
                          <MarketBullButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'5p_upcheck'} name={ww < 850 ? 'Xu hướng tuần' : 'Xu hướng sóng tuần'} />
                          <MarketBullButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'20p_upcheck'} name={ww < 850 ? 'Xu hướng tháng' : 'Xu hướng sóng tháng'} />
                          <MarketBullButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'60p_upcheck'} name={ww < 850 ? 'Xu hướng quý' : 'Xu hướng sóng quý'} />
                        </Row>
                      </Col>
                    ) : (
                      <Col xs={0} sm={0} md={18} lg={16} xl={16}>
                        <Row style={{ marginTop: '5px' }}>
                          <MarketBearButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'portion_t3_check'} name={'Rủi ro dòng tiền'} />
                          <MarketBearButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'portion_phase_check'} name={'Trạng thái quá bán'} />
                        </Row>
                        <Row style={{ marginTop: '5px' }}>
                          <MarketBearButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'5p_downcheck'} name={'Xu hướng sóng tuần'} />
                          <MarketBearButton data={auto_market_checklist_df} fontSize={pixel(0.011, 11)}
                            checkid={'20p_downcheck'} name={'Xu hướng sóng tháng'} />
                        </Row>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <PerformChart data={auto_concat_perform_df} ww={ww} time_span={time_span} fontSize={pixel(0.015, 17)} />
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col xs={13} sm={14} md={15} lg={16} xl={16}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Tỉ trọng và phân bổ vốn
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
                <Col xs={11} sm={10} md={9} lg={8} xl={8}>
                  <Button className="custom-button" block={true} size={ww > 991 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 11) }} onClick={onChangeIndustryDetail}
                  >
                    {!industryDetail ? 'Xem chi tiết ngành' : 'Quay lại'}
                  </Button>
                </Col>
              </Row>
              <Row gutter={20} style={{ position: 'relative' }}>
                <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                {!industryDetail ? (
                  <>
                    <Col xs={13} sm={14} md={15} lg={16} xl={16}>
                      <AllocationLinesChart data={auto_cap_allocation_line_df} ww={ww} time_span={time_span} fontSize={pixel(0.015, 17)} />
                    </Col>
                    <Col xs={11} sm={10} md={9} lg={8} xl={8}>
                      <AllocationPieChart data={auto_cap_allocation_pie_df} ww={ww} pixel={pixel} fontSize={pixel(0.015, 17)} />
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xs={24} sm={24} md={9} lg={8} xl={8}>
                      <TopIndustryTable data={auto_industry_toplist_df} subdata={auto_industry_checklist_df} ww={ww} fontSize={pixel(0.013, 12)} lineHeight={ww > 776 ? '35px' : '24px'} setFunction={setSelectIndustryDetail} />
                    </Col>
                    <Col xs={24} sm={24} md={15} lg={16} xl={16}>
                      <Row>
                        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
                          <p style={{
                            fontSize: pixel(0.016, 17), fontFamily: 'Calibri, sans-serif',
                            color: auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.final_portion ? '#24B75E' : '#e14040',
                            fontWeight: 'bold', margin: '20px 0px 0px 10px', padding: 0
                          }}>
                            {auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.final_portion ? 'Nắm giữ cổ phiếu' : 'Quan sát'}
                          </p>
                          <p data-tooltip-id="giai-doan-nganh-hien-tai" style={{
                            fontSize: pixel(0.011, 11), fontFamily: 'Calibri, sans-serif', height: '18px',
                            color: '#B3B3B3', fontWeight: 'bold', margin: '5px 0px 0px 10px', padding: 0, cursor: 'pointer', whiteSpace: 'pre-wrap'
                          }}>
                            {ww > 767 ? `Khuyến nghị ngành \n${selectIndustryDetail}` : `Khuyến nghị ngành ${selectIndustryDetail}`}
                            <InfoCircleOutlined style={{ marginLeft: '7px' }} />
                          </p>
                          <ReactTooltip id="giai-doan-nganh-hien-tai" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616', zIndex: 1 }}>
                            <p style={{
                              fontSize: pixel(0.011, 11),
                              fontFamily: 'Calibri, sans-serif',
                              background: '#161616',
                              padding: 0,
                              whiteSpace: 'pre-wrap'
                            }}>
                              {'Theo hệ thống T2M, ngành được chia thành 2 giai đoạn bao gồm:\n'}
                              <strong style={{ color: "#24B75E" }}>Nắm giữ cổ phiếu:</strong>
                              {' Nắm giữ những cổ phiếu trong ngành theo khuyến nghị của hệ thống\n'}
                              <strong style={{ color: "#e14040" }}>Quan sát:</strong>
                              {' Không nắm giữ cổ phiếu và theo dõi các diễn biến dòng tiền chờ đợi cơ hội\n'}
                              {!auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.final_portion ? (
                                <>
                                  {'Khi toàn bộ điều kiện bên phải đạt yêu cầu, ngành sẽ chuyển sang giai đoạn '}
                                  <strong style={{ color: "#24B75E" }}>Nắm giữ cổ phiếu</strong>
                                </>
                              ) : (
                                <>
                                  {'Khi toàn bộ điều kiện bên phải không đạt yêu cầu, ngành sẽ chuyển sang giai đoạn '}
                                  <strong style={{ color: "#e14040" }}>Quan sát</strong>
                                </>
                              )}
                            </p>
                          </ReactTooltip>
                        </Col>
                        {!auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.final_portion ? (
                          <Col xs={0} sm={0} md={16} lg={17} xl={18}>
                            <Row style={{ marginTop: '25px' }}>
                              <IndustryBullButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'portion_raw_check'} name={ww > 996 ? 'Sức mạnh dòng tiền' : 'Sức mạnh DT'} />
                              <IndustryBullButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'portion_phase_check'} name={ww > 996 ? 'Rủi ro dòng tiền' : 'Rủi ro DT'} />
                              <IndustryBullButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'up_check'} name={ww > 996 ? 'Cấu trúc sóng ngành' : 'Sóng ngành'} />
                            </Row>
                            <Row style={{ marginTop: '5px' }}>
                              <IndustryBullButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'5p_upcheck'} name={ww > 996 ? 'Xu hướng sóng tuần' : 'Xu hướng tuần'} />
                              <IndustryBullButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'20p_upcheck'} name={ww > 996 ? 'Xu hướng sóng tháng' : 'Xu hướng tháng'} />
                            </Row>
                          </Col>
                        ) : (
                          <Col xs={0} sm={0} md={16} lg={17} xl={18}>
                            <Row style={{ marginTop: '25px' }}>
                              <IndustryBearButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'down_check'} name={'Cấu trúc sóng ngành'} />
                            </Row>
                            <Row style={{ marginTop: '5px' }}>
                              <IndustryBearButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'5p_downcheck'} name={'Xu hướng sóng tuần'} />
                              <IndustryBearButton data={auto_industry_checklist_df} industry={selectIndustryDetail} fontSize={pixel(0.011, 11)}
                                checkid={'20p_downcheck'} name={'Xu hướng sóng tháng'} />
                            </Row>
                          </Col>
                        )}
                      </Row>
                      <Row gutter={20}>
                        <Col xs={8} sm={6} md={6} lg={6} xl={6}>
                          <div style={{
                            width: '100%', height: '140.5px', background: '#161616',
                            padding: '5px', borderRadius: '5px', marginTop: '20px'
                          }}>
                            <p style={{
                              fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', height: '15px',
                              color: '#B3B3B3', fontWeight: 'bold', margin: '0px 0px 0px 2px', padding: 0
                            }}>
                              {'Điểm đánh giá ngành'}
                            </p>
                            <p style={{
                              fontSize: pixel(0.013, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                              color: '#dfdfdf',
                              fontWeight: 'bold', margin: '5px 0px 0px 2px', padding: 0
                            }}>
                              {auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.portion_raw.toFixed(4)}
                            </p>
                            <p style={{
                              fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', height: '15px',
                              color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                            }}>
                              {'Số ngày nắm giữ'}
                            </p>
                            <p style={{
                              fontSize: pixel(0.013, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                              color: '#dfdfdf',
                              fontWeight: 'bold', margin: '5px 0px 0px 2px', padding: 0
                            }}>
                              {auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.day_count.toFixed(0)}
                            </p>
                            <p style={{
                              fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', height: '15px',
                              color: '#B3B3B3', fontWeight: 'bold', margin: '10px 0px 0px 2px', padding: 0
                            }}>
                              {'Xếp hạng hệ thống'}
                            </p>
                            <p style={{
                              fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', height: '15px',
                              color: '#dfdfdf',
                              fontWeight: 'bold', margin: '5px 0px 0px 2px', padding: 0
                            }}>
                              {auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.top_rank.toFixed(0) != 10 ? auto_industry_checklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.top_rank.toFixed(0) : "Không xếp hạng"}
                            </p>
                          </div>
                        </Col>
                        <Col xs={0} sm={2} md={2} lg={2} xl={2} />
                        <Col xs={8} sm={8} md={7} lg={7} xl={7}>
                          <p style={{
                            fontSize: pixel(0.011, 11), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#B3B3B3', fontWeight: 'bold', margin: '25px 0px 0px 2px', padding: 0
                          }}>
                            {'Cổ phiếu đề xuất 1'}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            1.&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.score_stock}:
                            &nbsp;&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.score_value.toFixed(4)}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            2.&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[1]?.score_stock}:
                            &nbsp;&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[1]?.score_value.toFixed(4)}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            3.&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[2]?.score_stock}:
                            &nbsp;&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[2]?.score_value.toFixed(4)}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[3]?.score_stock && (
                              <>
                                4.&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[3]?.score_stock}:
                                &nbsp;&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[3]?.score_value.toFixed(4)}
                              </>
                            )}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[4]?.score_stock && (
                              <>
                                5.&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[4]?.score_stock}:
                                &nbsp;&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[4]?.score_value.toFixed(4)}
                              </>
                            )}
                          </p>
                        </Col>
                        <Col xs={8} sm={8} md={7} lg={7} xl={7}>
                          <p style={{
                            fontSize: pixel(0.011, 11), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#B3B3B3', fontWeight: 'bold', margin: '25px 0px 0px 2px', padding: 0
                          }}>
                            {'Cổ phiếu đề xuất 2'}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            1.&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.portion_stock}:
                            &nbsp;&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[0]?.portion_value.toFixed(4)}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            2.&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[1]?.portion_stock}:
                            &nbsp;&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[1]?.portion_value.toFixed(4)}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            3.&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[2]?.portion_stock}:
                            &nbsp;&nbsp;
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[2]?.portion_value.toFixed(4)}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[3]?.portion_stock && (
                              <>
                                4.&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[3]?.portion_stock}:
                                &nbsp;&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[3]?.portion_value.toFixed(4)}
                              </>
                            )}
                          </p>
                          <p style={{
                            fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15px',
                            color: '#dfdfdf',
                            fontWeight: 'bold', margin: '8px 0px 0px 2px', padding: 0
                          }}>
                            {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[4]?.portion_stock && (
                              <>
                                5.&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[4]?.portion_stock}:
                                &nbsp;&nbsp;
                                {auto_industry_stocklist_df.filter((item: any) => item.industry === selectIndustryDetail)[4]?.portion_value.toFixed(4)}
                              </>
                            )}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
              {auto_holding_stock_df?.length > 0 && (
                <>
                  <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                    <Col span={24}>
                      <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                        Cổ phiếu khuyến nghị
                      </p>
                      <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '20px', position: 'relative' }}>
                    <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='94%' width='100%' />
                    <IndustrySelector name='industry_name' sort='industry_name' data={auto_holding_stock_df} filter={set_filter_holding_nganh} filter_value={filter_holding_nganh} placeholder={placeholder} setPlaceholder={setPlaceholder} fontSize={pixel(0.011, 10)} />
                    <HoldingStockTable
                      data={auto_holding_stock_df} ww={ww} fontSize={ww > 400 ? pixel(0.012, 13) : pixel(0.012, 11)} lineHeight='34px'
                      currentPage={currentPage1} setCurrentPage={setCurrentPage1} pageSize={pageSize1} setPageSize={setPageSize1}
                      filter_nhom_nganh={filter_holding_nganh}
                    />
                  </Row>
                </>
              )}
              <Row style={{ marginTop: auto_holding_stock_df?.length > 0 ? '-10px' : '50px', marginBottom: '10px' }}>
                <Col span={24}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Lịch sử khuyến nghị
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: '20px', position: 'relative' }}>
                <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <IndustrySelector name='industry_name' sort='industry_name' data={auto_traded_stock_df} filter={set_filter_traded_nganh} filter_value={filter_traded_nganh} placeholder={placeholder} setPlaceholder={setPlaceholder} fontSize={pixel(0.011, 10)} />
                <TradedStockTable
                  data={auto_traded_stock_df} ww={ww} fontSize={ww > 400 ? pixel(0.012, 13) : pixel(0.012, 11)} lineHeight='34px'
                  currentPage={currentPage2} setCurrentPage={setCurrentPage2} pageSize={pageSize2} setPageSize={setPageSize2}
                  filter_nhom_nganh={filter_traded_nganh}
                />
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}
