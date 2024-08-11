'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Card, Col, Menu, MenuProps, Radio, Row, Tooltip, notification } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import BasicSelector from "./components/basic_selector";
import TaSlider from "./components/ta_slider";
import TaSelector from "./components/ta_selector";
import { ClearOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { sessionLimit } from "@/utlis/sessionLimit";
import { resetAuthState } from "@/redux/authSlice";
import LockSection from "@/components/subscribers/blurComponents";
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

  const getData = async (tableName: string) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
    })
    if (tableName === 'market_update_time') {
      await set_market_update_time(res.data)
    } else if (tableName === 'stock_ta_filter_df') {
      await set_stock_ta_filter_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('market_update_time');
      getData('stock_ta_filter_df');
    };
    fetchData();

    const interval = setInterval(fetchData, 60000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [market_update_time, set_market_update_time] = useState<any[]>([]);
  const [stock_ta_filter_df, set_stock_ta_filter_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [table_type, set_table_type] = useState('dt');
  const [switch_ta_filter, set_switch_ta_filter] = useState(false);
  const [switch_ta_table, set_switch_ta_table] = useState('candle');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //State lưu giữ trạng thái của các filter
  const [placeholder, setPlaceholder] = useState<string | undefined>('All');
  const [filter_nhom_nganh, set_filter_nhom_nganh] = useState<any[]>([]);
  const [filter_hieu_suat, set_filter_hieu_suat] = useState<any[]>([]);
  const [filter_von_hoa, set_filter_von_hoa] = useState<any[]>([]);
  const [filter_t0, set_filter_t0] = useState<any[]>([]);
  const [filter_t5, set_filter_t5] = useState<any[]>([]);
  const [filter_liquid, set_filter_liquid] = useState<any[]>([]);
  const [filter_rank, set_filter_rank] = useState<any[]>([]);
  const [filter_month_trend, set_filter_month_trend] = useState<any[]>([]);
  const [filter_quarter_trend, set_filter_quarter_trend] = useState<any[]>([]);
  const [filter_year_trend, set_filter_year_trend] = useState<any[]>([]);

  const [ta_filter_candle, set_ta_filter_candle] = useState<any[]>([]);
  const [ta_filter_ma_pivot, set_ta_filter_ma_pivot] = useState<any[]>([]);
  const [ta_filter_fibo, set_ta_filter_fibo] = useState<any[]>([]);
  const [filter_slider_value, set_filter_slider_value] = useState<any[]>([-0.1, 0.1]);

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const clearFilter = (e: any) => {
    set_filter_nhom_nganh([])
    set_filter_hieu_suat([])
    set_filter_von_hoa([])
    set_filter_t0([])
    set_filter_t5([])
    set_filter_liquid([])
    set_filter_rank([])
    set_filter_month_trend([])
    set_filter_quarter_trend([])
    set_filter_year_trend([])
    set_ta_filter_candle([])
    set_ta_filter_ma_pivot([])
    set_ta_filter_fibo([])
    set_filter_slider_value([])
  };

  useEffect(() => {
    if (ww < 767) {
      set_table_type('dt')
      set_switch_ta_filter(false)
      set_filter_month_trend([])
      set_filter_quarter_trend([])
      set_filter_year_trend([])
      set_ta_filter_candle([])
      set_ta_filter_ma_pivot([])
      set_ta_filter_fibo([])
      set_filter_slider_value([])
    }
  }, [ww]);

  const toggleTaFilter = (e: any) => {
    if (ww > 767) {
      set_switch_ta_filter(!switch_ta_filter)
      if (switch_ta_filter) {
        set_table_type('dt')
      }
    } else {
      notification.destroy();
      notification.warning({
        message: "Xoay ngang màn hình",
      });
    }
  };

  const onChangeTaTable = (e: any) => {
    const value = e.target.value;
    set_switch_ta_table(value)
  };

  const onChangeTableType = (e: any) => {
    const value = e.target.value;
    set_table_type(value)
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
                    Bộ lọc cổ phiếu T2M
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row gutter={10} style={{ marginTop: '20px', position: 'relative' }}>
                <LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '10px 10px 20px 10px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <Row gutter={10}>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Nhóm hiệu suất
                        </p>
                        <BasicSelector name='industry_perform' sort='industry_perform' data={stock_ta_filter_df} filter={set_filter_hieu_suat} filter_value={filter_hieu_suat} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                      </Col>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Nhóm vốn hoá
                        </p>
                        <BasicSelector name='marketcap_group' sort='marketcap_group' data={stock_ta_filter_df} filter={set_filter_von_hoa} filter_value={filter_von_hoa} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                      </Col>
                    </Row>
                    <Row>
                      <p style={{
                        color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: '10px 0px 5px 2px', padding: 0, height: '20px'
                      }}>
                        Nhóm ngành
                      </p>
                      <BasicSelector name='industry_name' sort='industry_name' data={stock_ta_filter_df} filter={set_filter_nhom_nganh} filter_value={filter_nhom_nganh} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                    </Row>
                  </div>
                </Col>
                <Col xs={20} sm={20} md={12} lg={12} xl={12}>
                  <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '10px 10px 20px 10px', marginTop: ww > 767 ? '0px' : '10px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <Row gutter={10}>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Dòng tiền trong phiên
                        </p>
                        <BasicSelector name='filter_t0' sort='filter_t0' data={stock_ta_filter_df} filter={set_filter_t0} filter_value={filter_t0} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Chỉ số thanh khoản
                        </p>
                        <BasicSelector name='filter_liquid' sort='order_filter_liquid' data={stock_ta_filter_df} filter={set_filter_liquid} filter_value={filter_liquid} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                      </Col>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Dòng tiền trong tuần
                        </p>
                        <BasicSelector name='filter_t5' sort='filter_t5' data={stock_ta_filter_df} filter={set_filter_t5} filter_value={filter_t5} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Xếp hạng hiện tại
                        </p>
                        <BasicSelector name='filter_rank' sort='order_filter_rank' data={stock_ta_filter_df} filter={set_filter_rank} filter_value={filter_rank} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                      </Col>
                    </Row>
                  </div>
                </Col >
                <Col xs={4} sm={4} md={2} lg={2} xl={2}>
                  <div style={{ height: ww > 767 ? '100%' : 'calc(100% + 10px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <Tooltip title="Xoá tất cả bộ lọc">
                      <Button
                        className="filter-button"
                        icon={<ClearOutlined style={{ fontSize: pixel(0.02, 20) }} />}
                        size={ww > 767 ? 'large' : 'middle'}
                        style={{ width: '100%', height: '50%', border: 0, backgroundColor: '#161616', padding: 0, marginTop: ww > 767 ? '0px' : '10px' }}
                        onClick={clearFilter}
                      />
                    </Tooltip>
                    <Tooltip title="Bộ lọc chỉ số kĩ thuật">
                      <Button
                        className="filter-button"
                        icon={<PlusCircleOutlined style={{ fontSize: pixel(0.02, 20) }} />}
                        size={ww > 767 ? 'large' : 'middle'}
                        style={{ width: '100%', height: '50%', border: 0, backgroundColor: switch_ta_filter ? '#1677ff' : '#161616', padding: 0, marginTop: '9px' }}
                        onClick={toggleTaFilter}
                      />
                    </Tooltip>
                  </div>
                </Col>
              </Row >
              {switch_ta_filter === true && (
                <>
                  <Row gutter={10} style={{ marginTop: '10px' }}>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '10px 10px 20px 10px', width: '100%' }}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Xu hướng giá tháng
                        </p>
                        <BasicSelector name='month_trend' sort='month_trend' data={stock_ta_filter_df} filter={set_filter_month_trend} filter_value={filter_month_trend} placeholder={placeholder} setPlaceholder={setPlaceholder} />

                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Xu hướng giá quý
                        </p>
                        <BasicSelector name='quarter_trend' sort='quarter_trend' data={stock_ta_filter_df} filter={set_filter_quarter_trend} filter_value={filter_quarter_trend} placeholder={placeholder} setPlaceholder={setPlaceholder} />

                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Xu hướng giá năm
                        </p>
                        <BasicSelector name='year_trend' sort='year_trend' data={stock_ta_filter_df} filter={set_filter_year_trend} filter_value={filter_year_trend} placeholder={placeholder} setPlaceholder={setPlaceholder} />
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                      <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '10px 10px 20px 10px', width: '100%', marginTop: ww > 767 ? '0px' : '10px' }}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Lọc theo biến động giá
                        </p>
                        <TaSelector name='filter_candle' data={stock_ta_filter_df} filter={set_ta_filter_candle} filter_value={ta_filter_candle} />

                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Lọc theo MA và Pivot
                        </p>
                        <TaSelector name='filter_ma_pivot' data={stock_ta_filter_df} filter={set_ta_filter_ma_pivot} filter_value={ta_filter_ma_pivot} />

                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.013, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0, height: '20px'
                        }}>
                          Lọc theo mức giá Fibonacci
                        </p>
                        <TaSelector name='filter_fibo' data={stock_ta_filter_df} filter={set_ta_filter_fibo} filter_value={ta_filter_fibo} />
                      </div>
                    </Col>
                  </Row>
                  {(ta_filter_candle?.length > 0 || ta_filter_ma_pivot?.length > 0 || ta_filter_fibo?.length > 0) && (
                    <Row>
                      <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '0px 10px 20px 10px', width: '100%', height: '80px', marginTop: '10px' }}>
                        <TaSlider fontSize={pixel(0.014, 13)} set_filter_slider_value={set_filter_slider_value} />
                      </div>
                    </Row>
                  )}
                  <Row gutter={10} style={{ marginTop: '20px' }}>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                      <Radio.Group
                        className="custom-radio-group"
                        defaultValue={table_type}
                        buttonStyle="solid"
                        onChange={onChangeTableType}
                        style={{ display: 'flex', width: '100%', marginTop: '5px' }}
                        size='small'
                      >
                        <Radio.Button value="dt" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 11), color: '#dfdfdf'
                          }}>{ww > 767 ? 'Bảng thông tin chung' : 'Thông tin'}
                        </Radio.Button>
                        <Radio.Button value="kt" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 11), color: '#dfdfdf'
                          }}>{ww > 767 ? 'Bảng chỉ số kĩ thuật' : 'Kĩ thuật'}
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}></Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      {table_type === 'kt' && (
                        <Radio.Group
                          className="custom-radio-group"
                          defaultValue={switch_ta_table}
                          buttonStyle="solid"
                          onChange={onChangeTaTable}
                          style={{ display: 'flex', width: '100%', marginTop: '5px' }}
                          size='small'
                        >
                          <Radio.Button value="candle" className="custom-radio-button"
                            style={{
                              fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 11), color: '#dfdfdf'
                            }}>{ww > 767 ? 'Biến động giá' : 'BĐ giá'}
                          </Radio.Button>
                          <Radio.Button value="ma_pivot" className="custom-radio-button"
                            style={{
                              fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 11), color: '#dfdfdf'
                            }}>{ww > 767 ? 'Đường MA và Pivot' : 'MA Pivot'}
                          </Radio.Button>
                          <Radio.Button value="fibo" className="custom-radio-button"
                            style={{
                              fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 11), color: '#dfdfdf'
                            }}>{ww > 767 ? 'Mức giá Fibonacci' : 'Fibonacci'}
                          </Radio.Button>
                        </Radio.Group>
                      )}
                    </Col>
                  </Row>
                </>
              )}
              <Row style={{ marginTop: '20px', position: 'relative' }}>
                <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                {table_type === 'kt' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 'calc(27% + 55px)',
                      height: 'calc(100% - 70px)',
                      backgroundColor: '#161616',
                      borderRadius: '5px',
                      zIndex: 0,
                    }}
                  />
                )}
                <FilterStockTable
                  data={stock_ta_filter_df} ww={ww} fontSize={ww > 400 ? pixel(0.012, 13) : pixel(0.012, 11)} lineHeight='34px'
                  table_type={table_type} switch_ta_table={switch_ta_table}
                  currentPage={currentPage} setCurrentPage={setCurrentPage} pageSize={pageSize} setPageSize={setPageSize}
                  filter_nhom_nganh={filter_nhom_nganh}
                  filter_hieu_suat={filter_hieu_suat}
                  filter_von_hoa={filter_von_hoa}
                  filter_t0={filter_t0}
                  filter_t5={filter_t5}
                  filter_liquid={filter_liquid}
                  filter_rank={filter_rank}
                  filter_month_trend={filter_month_trend}
                  filter_quarter_trend={filter_quarter_trend}
                  filter_year_trend={filter_year_trend}
                  ta_filter_candle={ta_filter_candle}
                  ta_filter_ma_pivot={ta_filter_ma_pivot}
                  ta_filter_fibo={ta_filter_fibo}
                  filter_slider_value={filter_slider_value}
                />
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}
