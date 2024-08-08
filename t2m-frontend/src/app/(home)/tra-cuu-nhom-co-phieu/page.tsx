'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import GroupRankingChart from "./components/thong_tin_nhom/group_ranking";
import GroupTopCoPhieuTable from "./components/bang_top_co_phieu/top_co_phieu_table";
import MoneyFlowBreathChart from "./components/thong_tin_nhom/do_rong_dong_tien";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { sessionLimit } from "@/utlis/sessionLimit";
import { resetAuthState } from "@/redux/authSlice";
import LockSection from "@/components/subscribers/blurComponents";
import GroupMarketStructureChart from "./components/cau_truc_song/cau_truc_song_chart";
import LiquidityBreathChart from "./components/thong_tin_nhom/do_rong_thanh_khoan";
import GroupMoneyFlowT5Chart from "./components/thong_tin_nhom/dong_tien_t5";
import GroupScorePriceCorrelationChart from "./components/suc_manh_dong_tien/suc_manh_dong_tien";

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

const getColorLiquidity = (value: number) => {
  if (value < 50) return '#00cccc';
  if (value < 80) return '#e14040';
  if (value < 120) return '#D0be0f';
  if (value < 150) return '#24B75E';
  return '#C031C7';
};

const getColorGroupRank = (value: string) => {
  if (value === '1') return '#C031C7';
  if (value === '2') return '#24B75E';
  if (value === '3') return '#D0be0f';
  if (value === '4') return '#e14040';
};

const getColorIndustryRank = (value: number) => {
  if (value < 5) return '#C031C7';
  if (value < 10) return '#24B75E';
  if (value < 15) return '#D0be0f';
  if (value < 20) return '#e14040';
  return '#00cccc';
};

export default function Page3() {

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

  const [select_group, set_select_group] = useState('Bán lẻ');

  const getData = async (tableName: string, columnName: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
      queryParams: { columnName: columnName, columnValue: select_group },
    })
    if (tableName === 'update_time') {
      await set_update_time(res.data)
    } else if (tableName === 'group_score_power_df') {
      await set_group_score_power_df(res.data)
    } else if (tableName === 'market_ms') {
      await set_market_ms(res.data)
    } else if (tableName === 'group_stock_top_10_df') {
      await set_group_stock_top_10_df(res.data)
    } else if (tableName === 'group_breath_df') {
      await set_group_breath_df(res.data)
    } else if (tableName === 'group_score_liquidity_df') {
      await set_group_score_liquidity_df(res.data)
    } else if (tableName === 'group_score_5p_df') {
      await set_group_score_5p_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time', null);
      getData('group_stock_price_index', 'group_name');
      getData('group_score_power_df', 'name');
      getData('market_ms', 'name');
      getData('group_stock_top_10_df', 'name');
      getData('group_breath_df', 'name');
      getData('group_score_liquidity_df', 'name');
      getData('group_score_5p_df', 'name');
    };
    fetchData();

    const interval = setInterval(fetchData, 5 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [select_group]);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [group_score_power_df, set_group_score_power_df] = useState<any[]>([]);
  const [market_ms, set_market_ms] = useState<any[]>([]);
  const [group_stock_top_10_df, set_group_stock_top_10_df] = useState<any[]>([]);
  const [group_breath_df, set_group_breath_df] = useState<any[]>([]);
  const [group_score_liquidity_df, set_group_score_liquidity_df] = useState<any[]>([]);
  const [group_score_5p_df, set_group_score_5p_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [switch_group_industry, set_switch_group_industry] = useState('industry');
  const [switch_hs_cap, set_switch_hs_cap] = useState('hs');
  const [switch_nhom_nganh_hs, set_switch_nhom_nganh_hs] = useState('A');

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
                  <Button className="custom-button" block={true} size={ww > 767 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12) }} onClick={onChangeSwitchGroupIndustry}
                  >
                    {switch_group_industry === 'industry' ? (ww > 767 ? 'Chi tiết các nhóm cổ phiếu lớn' : 'Chi tiết nhóm cổ phiếu lớn')
                      : (ww > 767 ? 'Chi tiết các nhóm ngành' : 'Chi tiết nhóm ngành')}
                  </Button>
                </Col>
              </Row>
              {switch_group_industry === 'group' && (
                <>
                  <Row>
                    <Radio.Group
                      size={ww > 767 ? 'middle' : 'small'}
                      className="custom-radio-group"
                      defaultValue={switch_hs_cap}
                      buttonStyle="solid"
                      onChange={onChangeHsCap}
                      style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '20px' : '10px', height: '50px' }}
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
                        size={ww > 767 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '0px' : '-15px', height: '50px' }}
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
                        size={ww > 767 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '0px' : '-15px', height: '50px' }}
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
                      size={ww > 767 ? 'middle' : 'small'}
                      className="custom-radio-group"
                      defaultValue={switch_nhom_nganh_hs}
                      buttonStyle="solid"
                      onChange={onChangeNhomNganhHs}
                      style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '20px' : '10px', height: '50px' }}
                    >
                      <Radio.Button value="A" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 767 ? 'Ngành hiệu suất A' : 'Ngành HS A'}
                      </Radio.Button>
                      <Radio.Button value="B" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 767 ? 'Ngành hiệu suất B' : 'Ngành HS B'}
                      </Radio.Button>
                      <Radio.Button value="C" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 767 ? 'Ngành hiệu suất C' : 'Ngành HS C'}
                      </Radio.Button>
                      <Radio.Button value="D" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>{ww > 767 ? 'Ngành hiệu suất D' : 'Ngành HS D'}
                      </Radio.Button>
                    </Radio.Group>
                  </Row>
                  <Row>
                    {switch_nhom_nganh_hs === 'A' && (
                      <Radio.Group
                        size={ww > 767 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="Bán lẻ" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Bán lẻ
                        </Radio.Button>
                        <Radio.Button value="Bất động sản" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 600 ? 'Bất động sản' : 'BĐS'}
                        </Radio.Button>
                        <Radio.Button value="Chứng khoán" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 650 ? 'Chứng khoán' : 'CK'}
                        </Radio.Button>
                        <Radio.Button value="Công ty tài chính" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 910 ? 'Công ty tài chính' : 'CTTC'}
                        </Radio.Button>
                        <Radio.Button value="Thép" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Thép
                        </Radio.Button>
                        <Radio.Button value="Vật liệu xây dựng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 930 ? 'Vật liệu xây dựng' : 'VLXD'}
                        </Radio.Button>
                        <Radio.Button value="Xây dựng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 450 ? 'Xây dựng' : 'XD'}
                        </Radio.Button>
                      </Radio.Group>
                    )}
                    {switch_nhom_nganh_hs === 'B' && (
                      <Radio.Group
                        size={ww > 767 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="Công nghiệp" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 490 ? 'Công nghiệp' : 'C nghiệp'}
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
                          }}>{ww > 460 ? 'Khoáng sản' : 'K sản'}
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
                        size={ww > 767 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '0px' : '-15px', height: '50px' }}
                      >
                        <Radio.Button value="BĐS KCN" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 400 ? 'BĐS KCN' : 'BĐS KCN'}
                        </Radio.Button>
                        <Radio.Button value="Công nghệ" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 429 ? 'Công nghệ' : 'C nghệ'}
                        </Radio.Button>
                        <Radio.Button value="Hàng tiêu dùng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 590 ? 'Hàng tiêu dùng' : 'HTD'}
                        </Radio.Button>
                        <Radio.Button value="Ngân hàng" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 400 ? 'Ngân hàng' : 'NH'}
                        </Radio.Button>
                        <Radio.Button value="Thực phẩm" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>{ww > 450 ? 'Thực phẩm' : 'T Phẩm'}
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
                        size={ww > 767 ? 'middle' : 'small'}
                        className="custom-radio-group"
                        defaultValue={select_group}
                        buttonStyle="solid"
                        onChange={onChangeSelectGroup}
                        style={{ display: 'flex', width: '100%', marginTop: ww > 767 ? '0px' : '-15px', height: '50px' }}
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
              <Row gutter={25} style={{ marginTop: '30px', marginBottom: '20px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Thông tin nhóm ${select_group}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col xs={12} sm={10} md={8} lg={8} xl={6}>
                  <Row>
                    <Col span={24}>
                      <div style={{
                        width: '100%', height: ww > 767 ? '170px' : '140px', background: '#161616',
                        padding: '10px', borderRadius: '5px', marginTop: '10px'
                      }}>

                        <Row>
                          <Col span={14}>
                            <p style={{
                              fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                              color: '#B3B3B3', fontWeight: 'bold', margin: '0px 0px 0px 2px', padding: 0
                            }}>
                              {ww > 767 ? 'Chỉ số thanh khoản' : 'Thanh khoản'}
                            </p>
                            <p style={{
                              fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                              color: getColorLiquidity(group_score_liquidity_df?.[0]?.liquidity * 100),
                              fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                            }}>
                              {`${(group_score_liquidity_df?.[0]?.liquidity * 100).toFixed(2)}%`}
                            </p>
                          </Col>
                          <Col span={10}>
                            <p style={{
                              fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                              color: '#B3B3B3', fontWeight: 'bold', margin: '0px 0px 0px 2px', padding: 0
                            }}>
                              Xếp hạng
                            </p>
                            <p style={{
                              fontSize: pixel(0.014, 14), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                              color:
                                ['hs', 'cap'].includes(group_score_liquidity_df?.[0]?.group) ?
                                  getColorGroupRank(group_score_liquidity_df?.[0]?.rank) :
                                  getColorIndustryRank(group_score_liquidity_df?.[0]?.rank),
                              fontWeight: 'bold', margin: '2px 0px 0px 2px', padding: 0
                            }}>
                              {`${Math.round(group_score_liquidity_df?.[0]?.rank)}`}{['hs', 'cap'].includes(group_score_liquidity_df?.[0]?.group) ? '/4' : '/23'}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p style={{
                              fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                              color: '#B3B3B3', fontWeight: 'bold', margin: '15px 0px 0px 2px', padding: 0
                            }}>
                              Dòng tiền trong tuần
                            </p>
                            <GroupMoneyFlowT5Chart data={group_score_5p_df} ww={ww} fontSize={pixel(0.012, 11)}
                              height={ww > 767 ? '80px' : '60px'} select_group={select_group} />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div style={{
                        width: '100%', height: ww > 767 ? '120px' : '100px', background: '#161616',
                        padding: '10px', borderRadius: '5px', marginTop: '10px'
                      }}>
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '-5px 0px 0px 2px', padding: 0
                        }}>
                          Độ rộng dòng tiền
                        </p>
                        <MoneyFlowBreathChart data={group_breath_df}
                          ww={ww} fontSize={pixel(0.017, 16)}
                          group='hs' height={ww > 767 ? 40 : 30} type='group'
                        />
                        <p style={{
                          fontSize: pixel(0.012, 12), fontFamily: 'Calibri, sans-serif', height: '15.5px',
                          color: '#B3B3B3', fontWeight: 'bold', margin: '-5px 0px 0px 2px', padding: 0
                        }}>
                          Độ rộng thanh khoản
                        </p>
                        <LiquidityBreathChart data={group_breath_df}
                          ww={ww} fontSize={pixel(0.017, 16)}
                          group='hs' height={ww > 767 ? 40 : 30} type='group'
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={14} md={16} lg={16} xl={18}>
                  <GroupRankingChart data={group_score_power_df} ww={ww} select_group={select_group}
                    switch_group_industry={switch_group_industry} fontSize={pixel(0.017, 16)} />
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
              <Row>
                <GroupScorePriceCorrelationChart data={group_score_power_df} ww={ww} select_stock={select_group} fontSize={pixel(0.017, 16)} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Cấu trúc sóng nhóm ${select_group}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ position: 'relative' }}>
                <LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <GroupMarketStructureChart data={market_ms} ww={ww} fontSize={pixel(0.015, 15)} select_group={select_group} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Top cổ phiếu nhóm ${select_group}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ position: 'relative' }}>
                <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                <Col span={24}>
                  <div style={{ background: '#161616', padding: '10px 10px 10px 10px', borderRadius: '5px', margin: 0 }}>
                    <GroupTopCoPhieuTable data={group_stock_top_10_df} ww={ww} fontSize={pixel(0.013, 11)} lineHeight='34px' />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row >
        </Col >
      </>
    )
  }
}