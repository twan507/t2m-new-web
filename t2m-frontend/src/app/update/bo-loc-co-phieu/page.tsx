'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import FilterStockTable from "./components/filter_table";
import BasicSelector from "./components/basic_selector";

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
  const [filter_nhom_nganh, set_filter_nhom_nganh] = useState<any[]>([]);
  const [filter_hieu_suat, set_filter_hieu_suat] = useState<any[]>([]);
  const [filter_von_hoa, set_filter_von_hoa] = useState<any[]>([]);
  const [filter_t0, set_filter_t0] = useState<any[]>([]);
  const [filter_t5, set_filter_t5] = useState<any[]>([]);
  const [filter_liquid, set_filter_liquid] = useState<any[]>([]);
  const [filter_rank, set_filter_rank] = useState<any[]>([]);


  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const clearFilter = (e: any) => {
    console.log('clear filter')
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
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền và thanh khoản nhóm cổ phiếu
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                  <Button className="custom-button" block={true} size={ww > 768 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12) }} onClick={clearFilter}
                  >Xoá bộ lọc
                  </Button>
                </Col>
              </Row>
              <Row gutter={10}>
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




              <Row>
                <FilterStockTable
                  data={filter_stock_df} ww={ww} fontSize={pixel(0.013, 11)} lineHeight='34px'
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
