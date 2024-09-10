'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import MoneyFlowValueChart from "./trong_phien_eod/gia_tri_dong_tien";
import MoneyFlowBreathChart from "./trong_phien_eod/do_rong_dong_tien";
import MoneyFlowLiquidityChart from "./trong_phien_eod/chi_so_thanh_khoan_eod";
import TopIndustryChart from "./tuan_thang_eod/xep_hang_nganh";
import MoneyFlowT5Chart from "./tuan_thang_eod/dong_tien_t5";
import NhomVhRanking from "./tuan_thang_eod/nhom_vh_ranking";
import NhomHsRanking from "./tuan_thang_eod/nhom_hs_ranking";
import NganhHsARanking from "./tuan_thang_eod/nganh_hsA_ranking";
import NganhHsCRanking from "./tuan_thang_eod/nganh_hsC_ranking";
import NganhHsBRanking from "./tuan_thang_eod/nganh_hsB_ranking";
import NganhHsDRanking from "./tuan_thang_eod/nganh_hsD_ranking";
import NhomHsScoreItd from "./dong_tien_itd/nhom_hs_score";
import NhomVhScoreItd from "./dong_tien_itd/nhom_vh_score";
import NhomVhLiquidItd from "./thanh_khoan_itd/nhom_vh_liquid";
import NganhHsAScoreItd from "./dong_tien_itd/nganh_hsA_score";
import NganhHsALiquidItd from "./thanh_khoan_itd/nganh_hsA_liquid";
import NhomHsLiquidItd from "./thanh_khoan_itd/nhom_hs_liquid";
import NganhHsBLiquidItd from "./thanh_khoan_itd/nganh_hsB_liquid";
import NganhHsBScoreItd from "./dong_tien_itd/nganh_hsB_score";
import NganhHsCScoreItd from "./dong_tien_itd/nganh_hsC_score";
import NganhHsCLiquidItd from "./thanh_khoan_itd/nganh_hsC_liquid";
import NganhHsDScoreItd from "./dong_tien_itd/nganh_hsD_score";
import NganhHsDLiquidItd from "./thanh_khoan_itd/nganh_hsD_liquid";
import LockSection from "@/components/subscribers/blurComponents";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { sessionLimit } from "@/utlis/sessionLimit";
import { resetAuthState } from "@/redux/authSlice";
import LiquidityBreathChart from "./trong_phien_eod/do_rong_thanh_khoan";

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

function extractTime(updateString: string) {
  // Kiểm tra xem chuỗi có hợp lệ và chứa thông tin ngày và giờ hay không
  if (updateString && updateString.includes(": ")) {
    // Bước 1: Trích xuất phần ngày và giờ từ chuỗi
    const dateTimeString = updateString.split(": ")[1]; // "09/09/2024 13:07:43"

    // Bước 2: Tách phần ngày và phần thời gian
    const [datePart, timePart] = dateTimeString.split(" "); // ["09/09/2024", "13:07:43"]

    // Bước 3: Tạo đối tượng Date từ phần ngày
    const [day, month, year] = datePart.split("/").map(Number);
    const extractedDate = new Date(year, month - 1, day); // Lưu ý: tháng trong Date bắt đầu từ 0

    // Bước 4: Tách giờ, phút và giây từ phần thời gian
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Bước 5: Đặt giờ, phút, giây vào đối tượng Date bằng các giá trị đã trích xuất
    extractedDate.setHours(hours, minutes, seconds, 0);

    // Bước 6: Trả về đối tượng thời gian đã xử lý
    return extractedDate;
  }
}

function isInTimeFrame(market_update_time: any) {
  // const now = new Date();
  const now = extractTime(market_update_time[0]?.date)
  if (now) {
    // Thời gian bắt đầu (8:30)
    const startTime = new Date();
    startTime.setHours(8, 30, 0, 0); // 8:30 AM

    // Thời gian kết thúc (9:16)
    const endTime = new Date();
    endTime.setHours(9, 16, 0, 0); // 9:16 AM

    // Kiểm tra nếu thời gian hiện tại nằm trong khoảng từ 8:30 đến 9:16
    const isInTime = !(now >= startTime && now <= endTime);

    // Nếu chưa mở cửa thì biến này là false, đã mở của thì là true
    return isInTime;
  }
}

export default function Page2() {

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

      if (res.data && res.data.length > 0) {
        break; // Thoát khỏi vòng lặp khi dữ liệu thỏa mãn điều kiện
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] Bảng ${tableName} chưa tải xong, thử lại sau 1 giây...`);
        await delay(1000); // Nghỉ 1 giây trước khi thử lại
      }
    }

    if (tableName === 'market_update_time') {
      await set_market_update_time(res?.data)
    } else if (tableName === 'group_eod_score_liquidity_df') {
      await set_group_eod_score_liquidity_df(res?.data)
    } else if (tableName === 'group_breath_df') {
      await set_group_breath_df(res?.data)
    } else if (tableName === 'group_industry_ranking_df') {
      await set_group_industry_ranking_df(res?.data)
    } else if (tableName === 'group_score_5p_df') {
      await set_group_score_5p_df(res?.data)
    } else if (tableName === 'group_score_ranking_df') {
      await set_group_score_ranking_df(res?.data)
    } else if (tableName === 'group_itd_score_liquidity_df') {
      await set_group_itd_score_liquidity_df(res?.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('market_update_time');
      getData('group_eod_score_liquidity_df');
      getData('group_breath_df');
      getData('group_industry_ranking_df');
      getData('group_score_5p_df');
      getData('group_score_ranking_df');
      getData('group_itd_score_liquidity_df');
    };
    fetchData();
    setInterval(fetchData, 10000)
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [market_update_time, set_market_update_time] = useState<any[]>([]);
  const [group_eod_score_liquidity_df, set_group_eod_score_liquidity_df] = useState<any[]>([]);
  const [group_breath_df, set_group_breath_df] = useState<any[]>([]);
  const [group_industry_ranking_df, set_group_industry_ranking_df] = useState<any[]>([]);
  const [group_score_5p_df, set_group_score_5p_df] = useState<any[]>([]);
  const [group_score_ranking_df, set_group_score_ranking_df] = useState<any[]>([]);
  const [group_itd_score_liquidity_df, set_group_itd_score_liquidity_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [switch_itd_eod, set_switch_itd_eod] = useState('eod');
  const [switch_group, set_switch_group] = useState('D');
  const [switch_industry, set_switch_industry] = useState('D');
  const [switch_flow_liquid_group, set_switch_flow_liquid_group] = useState('F');
  const [switch_flow_liquid_industry, set_switch_flow_liquid_industry] = useState('F');


  const openState = isInTimeFrame(market_update_time)
  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeSwitchItdEod = (e: any) => {
    set_switch_itd_eod(switch_itd_eod === 'eod' ? 'itd' : 'eod')
  };

  const onChangeGroup = (e: any) => {
    const value = e.target.value;
    set_switch_group(value)
  };

  const onChangeIndustry = (e: any) => {
    const value = e.target.value;
    set_switch_industry(value)
  };

  const onChangeFlowLiquidGroup = (e: any) => {
    const value = e.target.value;
    set_switch_flow_liquid_group(value)
  };

  const onChangeFlowLiquidIndustry = (e: any) => {
    const value = e.target.value;
    set_switch_flow_liquid_industry(value)
  };

  const switch_group_items: any = [
    {
      key: 'D',
      label: 'Trong phiên',
    },
    {
      key: 'M',
      label: 'Trong tuần/tháng',
    },
  ];

  const onChangeGroupMobile: MenuProps['onClick'] = (e) => {
    set_switch_group(e.key);
  };

  const switch_industry_items: any = [
    {
      key: 'D',
      label: 'Trong phiên',
    },
    {
      key: 'M',
      label: 'Trong tuần/tháng',
    },
  ];

  const onChangeIndustryMobile: MenuProps['onClick'] = (e) => {
    set_switch_industry(e.key);
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
              <Row gutter={25} style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <div style={{ height: '100%', width: '100%' }}></div>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                  <Button className="custom-button" block={true} size={ww > 991 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 11) }} onClick={onChangeSwitchItdEod}
                  >
                    {switch_itd_eod === 'eod' ? (ww > 991 ? 'Xem diễn biến trong phiên' : 'Diễn biến trong phiên')
                      : (ww > 991 ? 'Quay lại' : 'Quay lại')}
                  </Button>
                </Col>
              </Row>
              <Row gutter={25} style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền và thanh khoản nhóm cổ phiếu
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
                {switch_itd_eod === 'eod' && (
                  <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                    {ww > 991 && (
                      <Radio.Group
                        className="custom-radio-group"
                        defaultValue={switch_group}
                        buttonStyle="solid"
                        onChange={onChangeGroup}
                        style={{ display: 'flex', width: '100%', marginTop: '5px', height: '50px' }}
                      >
                        <Radio.Button value="D" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Trong phiên
                        </Radio.Button>
                        <Radio.Button value="M" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Trong tuần/tháng
                        </Radio.Button>
                      </Radio.Group>
                    )}
                    {ww <= 991 && (
                      <Menu
                        theme='dark'
                        onClick={onChangeGroupMobile}
                        className="page2-menu"
                        style={{ width: '100%', background: 'black', fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf', height: '50px' }}
                        defaultOpenKeys={[switch_group]}
                        selectedKeys={[switch_group]}
                        mode="vertical"
                        items={switch_group_items}
                      />
                    )}
                  </Col>
                )}
              </Row>
              {switch_itd_eod === 'eod' && (
                <>
                  {switch_group === 'D' && (
                    <>
                      {ww < 991 && (
                        <Radio.Group
                          className="custom-radio-group"
                          defaultValue={switch_flow_liquid_group}
                          buttonStyle="solid" size='small'
                          onChange={onChangeFlowLiquidGroup}
                          style={{ display: 'flex', width: '100%', marginTop: '20px' }}
                        >
                          <Radio.Button value="F" className="custom-radio-button"
                            style={{
                              fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                            }}>Dòng tiền
                          </Radio.Button>
                          <Radio.Button value="L" className="custom-radio-button"
                            style={{
                              fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                            }}>Thanh khoản
                          </Radio.Button>
                        </Radio.Group>
                      )}
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        {(ww > 991 || switch_flow_liquid_group === 'F') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={8} xl={8}>
                              {authState && (< LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='95%' />)}
                              <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='hs' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='hs' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                          </>
                        )}
                        {(ww > 991 || switch_flow_liquid_group === 'L') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={6} xl={6}>
                              <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='hs' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='hs' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        {(ww > 991 || switch_flow_liquid_group === 'F') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={8} xl={8}>
                              {authState && (
                                < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='95%' />
                              )}
                              <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='cap' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='cap' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                          </>
                        )}
                        {(ww > 991 || switch_flow_liquid_group === 'L') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={6} xl={6}>
                              <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='cap' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='cap' height={ww > 991 ? '200px' : '150px'} type='group' />
                            </Col>
                          </>
                        )}
                      </Row>
                    </>
                  )}
                  {switch_group === 'M' && (
                    <>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_5p_df} ww={ww} fontSize={pixel(0.017, 16)}
                            group='hs' height={ww > 991 ? '250px' : '150px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NhomHsRanking data={group_score_ranking_df} ww={ww} fontSize={pixel(0.017, 16)}
                            height={ww > 991 ? '250px' : '160px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_5p_df} ww={ww} fontSize={pixel(0.017, 16)}
                            group='cap' height={ww > 991 ? '250px' : '150px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NhomVhRanking data={group_score_ranking_df} ww={ww} fontSize={pixel(0.017, 16)}
                            height={ww > 991 ? '250px' : '160px'} type='group' />
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
              {switch_itd_eod === 'itd' && (
                <>
                  {ww < 767 && (
                    <Radio.Group
                      className="custom-radio-group"
                      defaultValue={switch_flow_liquid_group}
                      buttonStyle="solid" size='small'
                      onChange={onChangeFlowLiquidGroup}
                      style={{ display: 'flex', width: '100%', marginTop: '20px' }}
                    >
                      <Radio.Button value="F" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Dòng tiền
                      </Radio.Button>
                      <Radio.Button value="L" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Thanh khoản
                      </Radio.Button>
                    </Radio.Group>
                  )}
                  <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                    <LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                    {(ww > 767 || switch_flow_liquid_group === 'F') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NhomHsScoreItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                    {(ww > 767 || switch_flow_liquid_group === 'L') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NhomHsLiquidItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                    < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                    {(ww > 767 || switch_flow_liquid_group === 'F') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NhomVhScoreItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                    {(ww > 767 || switch_flow_liquid_group === 'L') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NhomVhLiquidItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                  </Row>
                </>
              )}
              <Row gutter={25} style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền và thanh khoản nhóm ngành
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{market_update_time?.[0]?.date}</p>
                </Col>
                {switch_itd_eod === 'eod' && (
                  <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                    {ww > 991 && (
                      <Radio.Group
                        className="custom-radio-group"
                        defaultValue={switch_industry}
                        buttonStyle="solid"
                        onChange={onChangeIndustry}
                        style={{ display: 'flex', width: '100%', marginTop: '5px', height: '50px' }}
                      >
                        <Radio.Button value="D" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Trong phiên
                        </Radio.Button>
                        <Radio.Button value="M" className="custom-radio-button"
                          style={{
                            fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                          }}>Trong tuần/tháng
                        </Radio.Button>
                      </Radio.Group>
                    )}
                    {ww <= 991 && (
                      <Menu
                        theme='dark'
                        onClick={onChangeIndustryMobile}
                        className="page2-menu"
                        style={{ width: '100%', background: 'black', fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf', height: '50px' }}
                        defaultOpenKeys={[switch_industry]}
                        selectedKeys={[switch_industry]}
                        mode="vertical"
                        items={switch_industry_items}
                      />
                    )}
                  </Col>
                )}
              </Row>
              {switch_itd_eod === 'eod' && (
                <>
                  {switch_industry === 'D' && (
                    <>
                      {ww < 991 && (
                        <Radio.Group
                          className="custom-radio-group"
                          defaultValue={switch_flow_liquid_industry}
                          buttonStyle="solid" size='small'
                          onChange={onChangeFlowLiquidIndustry}
                          style={{ display: 'flex', width: '100%', marginTop: '20px' }}
                        >
                          <Radio.Button value="F" className="custom-radio-button"
                            style={{
                              fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                            }}>Dòng tiền
                          </Radio.Button>
                          <Radio.Button value="L" className="custom-radio-button"
                            style={{
                              fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                            }}>Thanh khoản
                          </Radio.Button>
                        </Radio.Group>
                      )}
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        {(ww > 991 || switch_flow_liquid_industry === 'F') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={8} xl={8}>
                              {authState && (
                                < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='95%' />
                              )}
                              <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='A' height={ww > 991 ? '300px' : '200px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='A' height={ww > 991 ? '300px' : '200px'} type='industry' />
                            </Col>
                          </>
                        )}
                        {(ww > 991 || switch_flow_liquid_industry === 'L') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={6} xl={6}>

                              <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='A' height={ww > 991 ? '300px' : '200px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='A' height={ww > 991 ? '300px' : '200px'} type='industry' />
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        {(ww > 991 || switch_flow_liquid_industry === 'F') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={8} xl={8}>
                              {authState && (
                                < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='95%' />
                              )}
                              <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='B' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='B' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                          </>
                        )}
                        {(ww > 991 || switch_flow_liquid_industry === 'L') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={6} xl={6}>

                              <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='B' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='B' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        {(ww > 991 || switch_flow_liquid_industry === 'F') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={8} xl={8}>
                              {authState && (
                                < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='95%' />
                              )}
                              <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='C' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='C' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                          </>
                        )}
                        {(ww > 991 || switch_flow_liquid_industry === 'L') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={6} xl={6}>

                              <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='C' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='C' height={ww > 991 ? '250px' : '180px'} type='industry' />
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        <LockSection type='free' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        {(ww > 991 || switch_flow_liquid_industry === 'F') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={8} xl={8}>
                              {authState && (
                                < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='95%' />
                              )}
                              <MoneyFlowValueChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='D' height={ww > 991 ? '200px' : '135px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <MoneyFlowBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='D' height={ww > 991 ? '200px' : '135px'} type='industry' />
                            </Col>
                          </>
                        )}
                        {(ww > 991 || switch_flow_liquid_industry === 'L') && (
                          <>
                            <Col xs={17} sm={16} md={16} lg={6} xl={6}>

                              <MoneyFlowLiquidityChart data={group_eod_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='D' height={ww > 991 ? '200px' : '135px'} type='industry' />
                            </Col>
                            <Col xs={7} sm={8} md={8} lg={5} xl={5}>
                              <LiquidityBreathChart data={group_breath_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                                group='D' height={ww > 991 ? '200px' : '135px'} type='industry' />
                            </Col>
                          </>
                        )}
                      </Row>
                    </>
                  )}
                  {switch_industry === 'M' && (
                    <>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_5p_df} ww={ww} fontSize={pixel(0.017, 16)}
                            group='A' height={ww > 991 ? '370px' : '200px'} type='industry' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsARanking data={group_score_ranking_df} ww={ww} fontSize={pixel(0.017, 16)}
                            height={ww > 991 ? '370px' : '200px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_5p_df} ww={ww} fontSize={pixel(0.017, 16)}
                            group='B' height={ww > 991 ? '320px' : '180px'} type='industry' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsBRanking data={group_score_ranking_df} ww={ww} fontSize={pixel(0.017, 16)}
                            height={ww > 991 ? '320px' : '180px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_5p_df} ww={ww} fontSize={pixel(0.017, 16)}
                            group='C' height={ww > 991 ? '320px' : '180px'} type='industry' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsCRanking data={group_score_ranking_df} ww={ww} fontSize={pixel(0.017, 16)}
                            height={ww > 991 ? '320px' : '180px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                        < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_5p_df} ww={ww} fontSize={pixel(0.017, 16)}
                            group='D' height={ww > 991 ? '250px' : '135px'} type='industry' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsDRanking data={group_score_ranking_df} ww={ww} fontSize={pixel(0.017, 16)}
                            height={ww > 991 ? '250px' : '140px'} type='group' />
                        </Col>
                      </Row>
                      {ww > 991 && (
                        <Row style={{ marginTop: '50px' }}>
                          <TopIndustryChart data={group_industry_ranking_df} ww={ww} fontSize={pixel(0.017, 16)} />
                        </Row>
                      )}
                    </>
                  )}
                </>
              )}
              {switch_itd_eod === 'itd' && (
                <>
                  {ww < 767 && (
                    <Radio.Group
                      className="custom-radio-group"
                      defaultValue={switch_flow_liquid_industry}
                      buttonStyle="solid" size='small'
                      onChange={onChangeFlowLiquidIndustry}
                      style={{ display: 'flex', width: '100%', marginTop: '20px' }}
                    >
                      <Radio.Button value="F" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Dòng tiền
                      </Radio.Button>
                      <Radio.Button value="L" className="custom-radio-button"
                        style={{
                          fontFamily: 'Calibri, sans-serif', fontSize: pixel(0.013, 12), color: '#dfdfdf'
                        }}>Thanh khoản
                      </Radio.Button>
                    </Radio.Group>
                  )}
                  <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                    < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                    {(ww > 767 || switch_flow_liquid_industry === 'F') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsAScoreItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                    {(ww > 767 || switch_flow_liquid_industry === 'L') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsALiquidItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                    < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                    {(ww > 767 || switch_flow_liquid_industry === 'F') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsBScoreItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                    {(ww > 767 || switch_flow_liquid_industry === 'L') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsBLiquidItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                    < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                    {(ww > 767 || switch_flow_liquid_industry === 'F') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsCScoreItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                    {(ww > 767 || switch_flow_liquid_industry === 'L') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsCLiquidItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 991 ? '40px' : '30px', position: 'relative' }}>
                    < LockSection type='paid' ww={ww} authState={authState} accessLevel={accessLevel} height='100%' width='100%' />
                    {(ww > 767 || switch_flow_liquid_industry === 'F') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsDScoreItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                    {(ww > 767 || switch_flow_liquid_industry === 'L') && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <NganhHsDLiquidItd data={group_itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 16)} openState={openState}
                          height={ww > 991 ? '300px' : '200px'} type='group' />
                      </Col>
                    )}
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Col >
      </>
    )
  }
}