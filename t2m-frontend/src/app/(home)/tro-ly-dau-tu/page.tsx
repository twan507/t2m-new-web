'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Card, Col, Menu, MenuProps, Radio, Row, Tooltip, notification } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { sessionLimit } from "@/utlis/sessionLimit";
import { resetAuthState } from "@/redux/authSlice";
import LockSection from "@/components/subscribers/blurComponents";
import PerformChart from "./components/chart/perform_chart";
import AllocationLinesChart from "./components/chart/allocation_lines_chart";
import AllocationPieChart from "./components/chart/allocation_pie_chart";
import IndustrySelector from "./components/table/basic_selector";
import HoldingStockTable from "./components/table/holding_stock_table";
import TradedStockTable from "./components/table/traded_stock_table";
import './styles.css'

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
  const accessLevel = authInfo?.user?.role === 'T2M ADMIN' ? 4 : authInfo?.user?.licenseInfo?.accessLevel

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const getData = async (tableName: string) => {

    let res;
    for (let i = 0; i < 8; i++) {
      res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
        method: "GET",
      })

      if ((res.data && res.data.length > 0) || (res.data && tableName === 'auto_holding_stock_df')) {
        break; // Thoát khỏi vòng lặp khi dữ liệu thỏa mãn điều kiện
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] Bảng ${tableName} chưa tải xong, thử lại sau 1 giây...`);
        await delay(1000); // Nghỉ 1 giây trước khi thử lại
      }
    }

    if (tableName === 'market_update_time') {
      await set_market_update_time(res?.data)
    } else if (tableName === 'auto_concat_perform_df') {
      await set_auto_concat_perform_df(res?.data)
    } else if (tableName === 'auto_cap_allocation_line_df') {
      await set_auto_cap_allocation_line_df(res?.data)
    } else if (tableName === 'auto_cap_allocation_pie_df') {
      await set_auto_cap_allocation_pie_df(res?.data)
    } else if (tableName === 'auto_holding_stock_df') {
      await set_auto_holding_stock_df(res?.data)
    } else if (tableName === 'auto_traded_stock_df') {
      await set_auto_traded_stock_df(res?.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('market_update_time');
      getData('stock_ta_filter_df');
      getData('group_eod_score_liquidity_df');
      getData('auto_concat_perform_df');
      getData('auto_cap_allocation_line_df');
      getData('auto_cap_allocation_pie_df');
      getData('auto_holding_stock_df');
      getData('auto_traded_stock_df');
    };
    fetchData();
    setInterval(fetchData, 10000)
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [market_update_time, set_market_update_time] = useState<any[]>([]);
  const [auto_concat_perform_df, set_auto_concat_perform_df] = useState<any[]>([]);
  const [auto_cap_allocation_line_df, set_auto_cap_allocation_line_df] = useState<any[]>([]);
  const [auto_cap_allocation_pie_df, set_auto_cap_allocation_pie_df] = useState<any[]>([]);
  const [auto_holding_stock_df, set_auto_holding_stock_df] = useState<any[]>([]);
  const [auto_traded_stock_df, set_auto_traded_stock_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
              <Row gutter={ww > 767 ? 20 : 10} style={{ position: 'relative' }}>
                <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <Col xs={16} sm={16} md={18} lg={19} xl={19}>
                  <PerformChart data={auto_concat_perform_df} ww={ww} time_span={time_span} fontSize={pixel(0.015, 17)} />
                </Col>
                <Col xs={8} sm={8} md={6} lg={5} xl={5}>
                  <Radio.Group
                    className="custom-radio-group" size="small"
                    defaultValue={time_span}
                    buttonStyle="solid"
                    onChange={onChangePerformChart}
                    style={{ display: 'flex', width: '100%', height: '20px' }}
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
                    fontSize: pixel(0.013, 14), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                    color: '#B3B3B3', fontWeight: 'bold', margin: '30px 0px 0px 0px', padding: 0
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
                    fontSize: pixel(0.013, 14), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                    color: '#B3B3B3', fontWeight: 'bold', margin: '20px 0px 0px 0px', padding: 0
                  }}>
                    Giai đoạn hiện tại
                  </p>
                  <div style={{
                    width: '100%', height: '40px', background: '#161616',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '5px', borderRadius: '5px', marginTop: '10px'
                  }}>
                    <p style={{
                      fontSize: pixel(0.016, 16), fontFamily: 'Calibri, sans-serif',
                      color: auto_concat_perform_df[0]?.final_portion ? '#24B75E' : '#e14040',
                    fontWeight: 'bold', margin: 0, padding: 0
                    }}>
                    {auto_concat_perform_df[0]?.final_portion ? (ww > 500 ? 'Nắm giữ cổ phiếu' : 'Nắm giữ') : 'Quan sát'}
                  </p>
                </div>

                <p style={{
                  fontSize: pixel(0.013, 14), fontFamily: 'Calibri, sans-serif', height: '15.5px',
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
                    color: getColorPerform(auto_concat_perform_df.filter((item: any) => item.time_span === time_span)[0]?.vnindex_perform * 100),
                    fontWeight: 'bold', margin: 0, padding: 0
                  }}>
                    {`${(auto_concat_perform_df.filter((item: any) => item.time_span === time_span)[0]?.vnindex_perform * 100)?.toFixed(2)}%`}
                  </p>
                </div>

                <p style={{
                  fontSize: pixel(0.013, 14), fontFamily: 'Calibri, sans-serif', height: '15.5px',
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
                    color: getColorPerform(auto_concat_perform_df.filter((item: any) => item.time_span === time_span)[0]?.invest_perform * 100),
                    fontWeight: 'bold', margin: 0, padding: 0
                  }}>
                    {`${(auto_concat_perform_df.filter((item: any) => item.time_span === time_span)[0]?.invest_perform * 100)?.toFixed(2)}%`}
                  </p>
                </div>
            </Col>
          </Row>
          <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
            <Col span={24}>
              <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                Tỉ trọng và phân bổ vốn
              </p>
              <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
            </Col>
          </Row>
          <Row gutter={20} style={{ position: 'relative' }}>
            <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
            <Col xs={13} sm={14} md={15} lg={16} xl={16}>
              <AllocationLinesChart data={auto_cap_allocation_line_df} ww={ww} time_span={time_span} fontSize={pixel(0.015, 17)} />
            </Col>
            <Col xs={11} sm={10} md={9} lg={8} xl={8}>
              <AllocationPieChart data={auto_cap_allocation_pie_df} ww={ww} pixel={pixel} fontSize={pixel(0.015, 17)} />
            </Col>
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
                  currentPage={currentPage} setCurrentPage={setCurrentPage} pageSize={pageSize} setPageSize={setPageSize}
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
              currentPage={currentPage} setCurrentPage={setCurrentPage} pageSize={pageSize} setPageSize={setPageSize}
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
