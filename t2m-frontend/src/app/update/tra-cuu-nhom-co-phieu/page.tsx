'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import IndexGroupPriceChart from "./components/index_chart/index_price_chart";
import DtVaTkTrongPhien from "./components/dien_bien_dong_tien/dt_va_tk_trong_phien";
import GroupWeekScoreChart from "./components/dien_bien_dong_tien/score_week";
import GroupMonthScoreChart from "./components/dien_bien_dong_tien/score_month";
import GroupRankingChart from "./components/suc_manh_dong_tien/group_ranking";
import GroupLiquidityLineChart20p from "./components/suc_manh_dong_tien/thanh_khoan_20p";
import GroupMarketStructureChart from "./components/cau_truc_song/cau_truc_song_chart";
import GroupTopCoPhieuTable from "./components/bang_top_co_phieu/top_co_phieu_table";


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

const groupList = ['Khoáng sản', 'Thực phẩm', 'Hiệu suất A', 'Hiệu suất C', 'Hàng tiêu dùng', 'SMALLCAP', 'Chứng khoán',
  'Y tế', 'Công nghiệp', 'MIDCAP', 'Bảo hiểm', 'LARGECAP', 'Dệt may', 'Vật liệu xây dựng', 'Ngân hàng', 'Hiệu suất B',
  'Hiệu suất D', 'PENNY', 'Thuỷ sản', 'Du lịch và DV', 'Thép', 'BĐS KCN', 'Bất động sản', 'Công nghệ', 'Bán lẻ', 'Vận tải',
  'DV hạ tầng', 'Hoá chất', 'Xây dựng', 'Công ty tài chính', 'Dầu khí', 'Thị trường']


export default function Page3() {
  const [select_group, set_select_group] = useState('Bán lẻ');

  const getData = async (tableName: string, columnName: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
      queryParams: { columnName: columnName, columnValue: select_group },
    })
    if (tableName === 'update_time') {
      await set_update_time(res.data)
    } else if (tableName === 'group_stock_price_index') {
      await set_group_stock_price_index(res.data)
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
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time', null);
      getData('group_stock_price_index', 'group_name');
      getData('itd_score_liquidity_melted', 'group_name');
      getData('group_score_week', 'group_name');
      getData('group_score_month', 'group_name');
      getData('group_score_month', 'group_name');
      getData('group_score_ranking_melted', 'group_name');
      getData('eod_score_liquidity_melted', 'group_name');
      getData('market_ms', 'name');
      getData('group_stock_top_10_df', 'name');
    };
    fetchData();

    const interval = setInterval(fetchData, 10 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [select_group]);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [group_stock_price_index, set_group_stock_price_index] = useState<any[]>([]);
  const [itd_score_liquidity_melted, set_itd_score_liquidity_melted] = useState<any[]>([]);
  const [group_score_week, set_group_score_week] = useState<any[]>([]);
  const [group_score_month, set_group_score_month] = useState<any[]>([]);
  const [group_score_ranking_melted, set_group_score_ranking_melted] = useState<any[]>([]);
  const [eod_score_liquidity_melted, set_eod_score_liquidity_melted] = useState<any[]>([]);
  const [market_ms, set_market_ms] = useState<any[]>([]);
  const [group_stock_top_10_df, set_group_stock_top_10_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [switch_group_industry, set_switch_group_industry] = useState('industry');
  const [switch_hs_cap, set_switch_hs_cap] = useState('hs');
  const [switch_nhom_nganh_hs, set_switch_nhom_nganh_hs] = useState('A');
  const [time_span, set_time_span] = useState('1Y');

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeSwitchGroupIndustry = (e: any) => {
    set_switch_group_industry(switch_group_industry === 'group' ? 'industry' : 'group')
    if (switch_group_industry === 'group') {
      set_switch_nhom_nganh_hs('A')
      set_select_group('Bán lẻ')
    } else {
      set_switch_hs_cap('hs')
      set_select_group('Hiệu suất A')
    }
  };

  const onChangeHsCap = (e: any) => {
    const value = e.target.value;
    set_switch_hs_cap(value)
    if (value === 'hs') {
      set_select_group('Hiệu suất A')
    } else {
      set_select_group('LARGECAP')
    }
  };

  const onChangeNhomNganhHs = (e: any) => {
    const value = e.target.value;
    set_switch_nhom_nganh_hs(value)
    if (value === 'A') {
      set_select_group('Bán lẻ')
    } else if (value === 'B') {
      set_select_group('Công nghiệp')
    } else if (value === 'C') {
      set_select_group('BĐS KCN')
    } else if (value === 'D') {
      set_select_group('Bảo hiểm')
    }
  };

  const onChangeSelectGroup = (e: any) => {
    const value = e.target.value;
    set_select_group(value)
  };

  const onChangeIndexPriceChartTimeSpan = (e: any) => {
    const value = e.target.value;
    set_time_span(value)
  };


  // const nhom_hs_items: any = [
  //   {
  //     key: 'A',
  //     label: 'Hiệu suất A',
  //   },
  //   {
  //     key: 'B',
  //     label: 'Hiệu suất B',
  //   },
  //   {
  //     key: 'C',
  //     label: 'Hiệu suất C',
  //   },
  //   {
  //     key: 'D',
  //     label: 'Hiệu suất D',
  //   },
  // ];

  // const onChangeHsCapMobile: MenuProps['onClick'] = (e) => {
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
              <Row gutter={25} style={{ height: '10px', margin: '-40px 0px 0px 0px' }}></Row>
              <Row gutter={0} style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div style={{ height: '100%', width: '100%' }}></div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button className="custom-button" block={true} size={ww > 768 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12) }} onClick={onChangeSwitchGroupIndustry}
                  >
                    {switch_group_industry === 'industry' ? (ww > 768 ? 'Chi tiết các nhóm cổ phiếu lớn' : 'Chi tiết nhóm cổ phiếu lớn')
                      : (ww > 768 ? 'Chi tiết các nhóm ngành' : 'Chi tiết nhóm ngành')}
                  </Button>
                </Col>
              </Row>
              {switch_group_industry === 'group' && (
                <>
                  <Row>
                    <Radio.Group
                      size={ww > 768 ? 'middle' : 'small'}
                      className="custom-radio-group"
                      defaultValue={switch_hs_cap}
                      buttonStyle="solid"
                      onChange={onChangeHsCap}
                      style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '20px' : '10px', height: '50px' }}
                    >
                      <Radio.Button value="hs" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Các nhóm hiệu suất
                      </Radio.Button>
                      <Radio.Button value="cap" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Các nhóm vốn hoá
                      </Radio.Button>
                    </Radio.Group>
                  </Row>
                  <Row>
                    {switch_hs_cap === 'hs' && (
                      <Radio.Group
                        size={ww > 768 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="Hiệu suất A" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Hiệu suất A
                        </Radio.Button>
                        <Radio.Button value="Hiệu suất B" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Hiệu suất B
                        </Radio.Button>
                        <Radio.Button value="Hiệu suất C" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Hiệu suất C
                        </Radio.Button>
                        <Radio.Button value="Hiệu suất D" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Hiệu suất D
                        </Radio.Button>
                      </Radio.Group>
                    )}
                    {switch_hs_cap === 'cap' && (
                      <Radio.Group
                        size={ww > 768 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="LARGECAP" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>LARGECAP
                        </Radio.Button>
                        <Radio.Button value="MIDCAP" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>MIDCAP
                        </Radio.Button>
                        <Radio.Button value="SMALLCAP" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>SMALLCAP
                        </Radio.Button>
                        <Radio.Button value="PENNY" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>PENNY
                        </Radio.Button>
                      </Radio.Group>
                    )}
                  </Row>
                </>
              )}
              {switch_group_industry === 'industry' && (
                <>
                  <Row>
                    <Radio.Group
                      size={ww > 768 ? 'middle' : 'small'}
                      className="custom-radio-group"
                      defaultValue={switch_nhom_nganh_hs}
                      buttonStyle="solid"
                      onChange={onChangeNhomNganhHs}
                      style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '20px' : '10px', height: '50px' }}
                    >
                      <Radio.Button value="A" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 768 ? 'Ngành hiệu suất A' : 'Ngành HS A'}
                      </Radio.Button>
                      <Radio.Button value="B" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 768 ? 'Ngành hiệu suất B' : 'Ngành HS B'}
                      </Radio.Button>
                      <Radio.Button value="C" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 768 ? 'Ngành hiệu suất C' : 'Ngành HS C'}
                      </Radio.Button>
                      <Radio.Button value="D" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 768 ? 'Ngành hiệu suất D' : 'Ngành HS D'}
                      </Radio.Button>
                    </Radio.Group>
                  </Row>
                  <Row>
                    {switch_nhom_nganh_hs === 'A' && (
                      <Radio.Group
                        size={ww > 768 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="Bán lẻ" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Bán lẻ
                        </Radio.Button>
                        <Radio.Button value="Bất động sản" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Bất động sản' : 'BĐS'}
                        </Radio.Button>
                        <Radio.Button value="Chứng khoán" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Chứng khoán' : 'CK'}
                        </Radio.Button>
                        <Radio.Button value="Công ty tài chính" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Công ty tài chính' : 'CTTC'}
                        </Radio.Button>
                        <Radio.Button value="Thép" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Thép
                        </Radio.Button>
                        <Radio.Button value="Vật liệu xây dựng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Vật liệu xây dựng' : 'VLXD'}
                        </Radio.Button>
                        <Radio.Button value="Xây dựng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Xây dựng' : 'XD'}
                        </Radio.Button>
                      </Radio.Group>
                    )}
                    {switch_nhom_nganh_hs === 'B' && (
                      <Radio.Group
                        size={ww > 768 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="Công nghiệp" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Công nghiệp' : 'C nghiệp'}
                        </Radio.Button>
                        <Radio.Button value="Dầu khí" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Dầu khí
                        </Radio.Button>
                        <Radio.Button value="Dệt may" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Dệt may
                        </Radio.Button>
                        <Radio.Button value="Hoá chất" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Hoá chất
                        </Radio.Button>
                        <Radio.Button value="Khoáng sản" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Khoáng sản' : 'K sản'}
                        </Radio.Button>
                        <Radio.Button value="Thuỷ sản" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Thuỷ sản
                        </Radio.Button>
                      </Radio.Group>
                    )}
                    {switch_nhom_nganh_hs === 'C' && (
                      <Radio.Group
                        size={ww > 768 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="BĐS KCN" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'BĐS KCN' : 'BĐS KCN'}
                        </Radio.Button>
                        <Radio.Button value="Công nghệ" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Công nghệ' : 'C nghệ'}
                        </Radio.Button>
                        <Radio.Button value="Hàng tiêu dùng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Hàng tiêu dùng' : 'HTD'}
                        </Radio.Button>
                        <Radio.Button value="Ngân hàng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Ngân hàng' : 'NH'}
                        </Radio.Button>
                        <Radio.Button value="Thực phẩm" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 768 ? 'Thực phẩm' : 'TP'}
                        </Radio.Button>
                        <Radio.Button value="Vận tải" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Vận tải
                        </Radio.Button>
                      </Radio.Group>
                    )}
                    {switch_nhom_nganh_hs === 'D' && (
                      <Radio.Group
                        size={ww > 768 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 768 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="Bảo hiểm" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Bảo hiểm
                        </Radio.Button>
                        <Radio.Button value="Du lịch và DV" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Du lịch và DV
                        </Radio.Button>
                        <Radio.Button value="DV hạ tầng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>DV hạ tầng
                        </Radio.Button>
                        <Radio.Button value="Y tế" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Y tế
                        </Radio.Button>
                      </Radio.Group>
                    )}
                  </Row>
                </>
              )}
              <Row gutter={25} style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Index nhóm ${select_group}`}
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
                <IndexGroupPriceChart data={group_stock_price_index} select_group={select_group} time_span={time_span} width='100%' height={ww > 768 ? '270px' : '215px'} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Diễn biến dòng tiền nhóm ${select_group}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: '30px' }}>
                <DtVaTkTrongPhien data={itd_score_liquidity_melted} select_group={select_group} ww={ww} fontSize={pixel(0.017, 17)} />
              </Row>
              <Row gutter={10} style={{ marginTop: '20px' }}>
                <Col xs={12} sm={10} md={8} lg={8} xl={8}>
                  <GroupWeekScoreChart data={group_score_week} ww={ww} select_group={select_group} fontSize={pixel(0.015, 17)} />
                </Col>
                <Col xs={12} sm={14} md={16} lg={16} xl={16}>
                  <GroupMonthScoreChart data={group_score_month} ww={ww} select_group={select_group} fontSize={pixel(0.015, 17)} />
                </Col>
              </Row>
              <Row style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Sức mạnh dòng tiền nhóm ${select_group}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: ww > 768 ? '30px' : '20px' }}>
                <GroupRankingChart data={group_score_ranking_melted} ww={ww} select_group={select_group}
                  switch_group_industry={switch_group_industry} fontSize={pixel(0.017, 17)} />
              </Row>
              <Row style={{ marginTop: ww > 768 ? '20px' : '10px' }}>
                <GroupLiquidityLineChart20p data={eod_score_liquidity_melted} select_group={select_group} fontSize={pixel(0.017, 17)} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Cấu trúc sóng nhóm ${select_group}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row>
                <GroupMarketStructureChart data={market_ms} ww={ww} fontSize={pixel(0.015, 17)} select_group={select_group} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Top cổ phiếu nhóm ${select_group}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ background: '#161616', padding: '10px 10px 10px 10px', borderRadius: '5px', margin: 0 }}>
                    <GroupTopCoPhieuTable data={group_stock_top_10_df} ww={ww} fontSize={pixel(0.013, 11)} lineHeight='34px' />
                  </div>
                </Col>
              </Row>

            </Col>
          </Row>
        </Col >
      </>
    )
  }
}