'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Card, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import FilterStockTable from "./components/filter_table";
import BasicSelector from "./components/basic_selector";
import TaSlider from "./components/ta_slider";
import TaSelector from "./components/ta_selector";

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
  const [table_type, set_table_type] = useState('dt');
  const [switch_ta_filter, set_switch_ta_filter] = useState(false);
  const [switch_ta_table, set_switch_ta_table] = useState('candle');

  //State lưu giữ trạng thái của các filter
  const [filter_nhom_nganh, set_filter_nhom_nganh] = useState<any[]>([]);
  const [filter_hieu_suat, set_filter_hieu_suat] = useState<any[]>([]);
  const [filter_von_hoa, set_filter_von_hoa] = useState<any[]>([]);
  const [filter_t0, set_filter_t0] = useState<any[]>([]);
  const [filter_t5, set_filter_t5] = useState<any[]>([]);
  const [filter_liquid, set_filter_liquid] = useState<any[]>([]);
  const [filter_rank, set_filter_rank] = useState<any[]>([]);
  const [ta_filter_candle, set_ta_filter_candle] = useState<any[]>([]);
  const [ta_filter_ma_pivot, set_ta_filter_ma_pivot] = useState<any[]>([]);
  const [ta_filter_fibo, set_ta_filter_fibo] = useState<any[]>([]);

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const clearFilter = (e: any) => {
    console.log('clear filter')
  };

  const toggleTaFilter = (e: any) => {
    set_switch_ta_filter(!switch_ta_filter)
  };

  const onChangeTaTable = (e: any) => {
    const value = e.target.value;
    set_switch_ta_table(value)
  };

  const onChangeTableType = (e: any) => {
    const value = e.target.value;
    set_table_type(value)
  };

  // const onChangeGroup = (e: any) => {
  //   const value = e.target.value;
  //   set_switch_group(value)
  // };

  // const switch_group_items: any = [
  //   {
  //     key: 'D',
  //     label: 'Trong phiên',
  //   },
  //   {
  //     key: 'M',
  //     label: 'Trong tuần/tháng',
  //   },
  // ];

  // const onChangeGroupMobile: MenuProps['onClick'] = (e) => {
  //   set_switch_group(e.key);
  // };

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
                <Col xs={14} sm={14} md={18} lg={18} xl={18}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền và thanh khoản nhóm cổ phiếu
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                <Col xs={10} sm={10} md={6} lg={6} xl={6}>
                  <Button className="custom-button" block={true} size={ww > 768 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12), marginTop: '12px' }} onClick={clearFilter}
                  >Xoá bộ lọc
                  </Button>
                </Col>
              </Row>
              <Row gutter={10} style={{ marginTop: '20px' }}>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '10px 10px 20px 10px' }}>
                    <Row>
                      <p style={{
                        color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                        margin: '0px 0px 5px 2px', padding: 0
                      }}>
                        Nhóm ngành
                      </p>
                      <BasicSelector name='industry_name' sort='industry_name' data={filter_stock_df} filter={set_filter_nhom_nganh} />
                    </Row>
                    <Row gutter={10}>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0
                        }}>
                          Nhóm hiệu suất
                        </p>
                        <BasicSelector name='industry_perform' sort='industry_perform' data={filter_stock_df} filter={set_filter_hieu_suat} />
                      </Col>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0
                        }}>
                          Nhóm vốn hoá
                        </p>
                        <BasicSelector name='marketcap_group' sort='marketcap_group' data={filter_stock_df} filter={set_filter_von_hoa} />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                  <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '10px 10px 20px 10px' }}>
                    <Row gutter={10}>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0
                        }}>
                          Dòng tiền trong phiên
                        </p>
                        <BasicSelector name='filter_t0' sort='filter_t0' data={filter_stock_df} filter={set_filter_t0} />
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0
                        }}>
                          Chỉ số thanh khoản
                        </p>
                        <BasicSelector name='filter_liquid' sort='order_filter_liquid' data={filter_stock_df} filter={set_filter_liquid} />
                      </Col>
                      <Col span={12}>
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0
                        }}>
                          Dòng tiền trong tuần
                        </p>
                        <BasicSelector name='filter_t5' sort='filter_t5' data={filter_stock_df} filter={set_filter_t5} />
                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0
                        }}>
                          Xếp hạng hiện tại
                        </p>
                        <BasicSelector name='filter_rank' sort='order_filter_rank' data={filter_stock_df} filter={set_filter_rank} />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row gutter={25} style={{ marginTop: '25px' }}>
                <Col xs={14} sm={14} md={18} lg={18} xl={18}></Col>
                <Col xs={10} sm={10} md={6} lg={6} xl={6}>
                  <Button className="custom-button" block={true} size={ww > 768 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12) }} onClick={toggleTaFilter}
                  >{switch_ta_filter ? 'Tắt bộ lọc kĩ thuật' : 'Bật bộ lọc kĩ thuật'}
                  </Button>
                </Col>
              </Row>
              {switch_ta_filter === true && (
                <>
                  <Row style={{ marginTop: '20px' }}>
                    <div style={{ backgroundColor: '#161616', borderRadius: '5px', padding: '10px 10px 20px 10px', width: '100%' }}>
                      <Col span={24}>

                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '0px 0px 5px 2px', padding: 0
                        }}>
                          Lọc theo biến động giá
                        </p>
                        <TaSelector name='filter_candle' data={filter_stock_df} filter={set_ta_filter_candle} />

                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0
                        }}>
                          Lọc theo MA và Pivot
                        </p>
                        <TaSelector name='filter_ma_pivot' data={filter_stock_df} filter={set_ta_filter_ma_pivot} />

                        <p style={{
                          color: '#dfdfdf', fontSize: pixel(0.014, 13), fontFamily: 'Calibri, sans-serif', fontWeight: 'bold',
                          margin: '10px 0px 5px 2px', padding: 0
                        }}>
                          Lọc theo mức giá Fibonacci
                        </p>
                        <TaSelector name='filter_fibo' data={filter_stock_df} filter={set_ta_filter_fibo} />

                        {(ta_filter_candle.length > 0 || ta_filter_ma_pivot.length > 0 || ta_filter_fibo.length > 0) && (
                          <TaSlider fontSize={pixel(0.014, 13)} />
                        )}

                      </Col>
                    </div>
                  </Row>
                  <Row style={{ marginTop: '20px' }}>
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
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Bảng thông tin dòng tiền
                        </Radio.Button>
                        <Radio.Button value="ptkt" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Bảng chỉ số kĩ thuật
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}></Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Biến động giá
                        </Radio.Button>
                        <Radio.Button value="ma_pivot" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Đường MA và Pivot
                        </Radio.Button>
                        <Radio.Button value="fibo" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Mức giá Fibonacci
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                </>
              )}


              <Row style={{ marginTop: '20px', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '31%',
                    height: 'calc(100% - 70px)',
                    backgroundColor: '#161616',
                    borderRadius: '5px',
                    zIndex: 0,
                  }}
                />
                <FilterStockTable
                  data={filter_stock_df} ww={ww} fontSize={pixel(0.013, 11)} lineHeight='34px' type={table_type}
                  filter_nhom_nganh={filter_nhom_nganh}
                  filter_hieu_suat={filter_hieu_suat}
                  filter_von_hoa={filter_von_hoa}
                  filter_t0={filter_t0}
                  filter_t5={filter_t5}
                  filter_liquid={filter_liquid}
                  filter_rank={filter_rank}
                />
              </Row>
            </Col >
          </Row >
        </Col >
      </>
    )
  }
}
