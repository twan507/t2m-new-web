'use client'
import { sendRequest } from "@/utlis/api"
import { Button, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import './styles.css'
import MoneyFlowValueChart from "./trong_phien_eod/gia_tri_dong_tien";
import MoneyFlowBreathChart from "./trong_phien_eod/do_rong_dong_tien";
import MoneyFlowLiquidityChart from "./trong_phien_eod/chi_so_thanh_khoan_eod";
import TopIndustryChart from "./trong_phien_eod/xep_hang_nganh";
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

export default function Page2() {
  const getData = async (tableName: string) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
    })
    if (tableName === 'update_time') {
      await set_update_time(res.data)
    } else if (tableName === 'itd_score_liquidity_last') {
      await set_itd_score_liquidity_last(res.data)
    } else if (tableName === 'market_breath_df') {
      await set_market_breath_df(res.data)
    } else if (tableName === 'full_industry_ranking') {
      await set_full_industry_ranking(res.data)
    } else if (tableName === 'group_score_df_5p') {
      await set_group_score_df_5p(res.data)
    } else if (tableName === 'group_score_ranking') {
      await set_group_score_ranking(res.data)
    } else if (tableName === 'itd_score_liquidity_df') {
      await set_itd_score_liquidity_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time');
      getData('itd_score_liquidity_last');
      getData('market_breath_df');
      getData('full_industry_ranking');
      getData('group_score_df_5p');
      getData('group_score_ranking');
      getData('itd_score_liquidity_df');
    };
    fetchData();

    const interval = setInterval(fetchData, 5 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [itd_score_liquidity_last, set_itd_score_liquidity_last] = useState<any[]>([]);
  const [market_breath_df, set_market_breath_df] = useState<any[]>([]);
  const [full_industry_ranking, set_full_industry_ranking] = useState<any[]>([]);
  const [group_score_df_5p, set_group_score_df_5p] = useState<any[]>([]);
  const [group_score_ranking, set_group_score_ranking] = useState<any[]>([]);
  const [itd_score_liquidity_df, set_itd_score_liquidity_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [switch_itd_eod, set_switch_itd_eod] = useState('eod');
  const [switch_group, set_switch_group] = useState('D');
  const [switch_industry, set_switch_industry] = useState('D');


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
                  <Button className="custom-button" block={true} size={ww > 768 ? 'large' : 'middle'}
                    style={{ fontSize: pixel(0.013, 12) }} onClick={onChangeSwitchItdEod}
                  >
                    {switch_itd_eod === 'eod' ? (ww > 768 ? 'Xem diễn biến trong phiên' : 'Diễn biến trong phiên')
                      : (ww > 768 ? 'Quay lại' : 'Quay lại')}
                  </Button>
                </Col>
              </Row>
              <Row gutter={25} style={{ marginTop: '0px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền và thanh khoản nhóm cổ phiếu
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                {switch_itd_eod === 'eod' && (
                  <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                    {ww > 768 && (
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
                    {ww <= 768 && (
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
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='hs' height={ww > 768 ? '200px' : '150px'} type='group' />
                        </Col>
                        <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                          <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.017, 17)}
                            group='hs' height={ww > 768 ? '200px' : '150px'} type='group' />
                        </Col>
                        <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                          <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='hs' height={ww > 768 ? '200px' : '150px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='cap' height={ww > 768 ? '200px' : '150px'} type='group' />
                        </Col>
                        <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                          <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.017, 17)}
                            group='cap' height={ww > 768 ? '200px' : '150px'} type='group' />
                        </Col>
                        <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                          <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='cap' height={ww > 768 ? '200px' : '150px'} type='group' />
                        </Col>
                      </Row>
                    </>
                  )}
                  {switch_group === 'M' && (
                    <>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_df_5p} ww={ww} fontSize={pixel(0.017, 17)}
                            group='hs' height={ww > 768 ? '250px' : '150px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NhomHsRanking data={group_score_ranking} ww={ww} fontSize={pixel(0.017, 17)}
                            height={ww > 768 ? '250px' : '150px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_df_5p} ww={ww} fontSize={pixel(0.017, 17)}
                            group='cap' height={ww > 768 ? '250px' : '150px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NhomVhRanking data={group_score_ranking} ww={ww} fontSize={pixel(0.017, 17)}
                            height={ww > 768 ? '250px' : '150px'} type='group' />
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
              {switch_itd_eod === 'itd' && (
                <>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NhomHsScoreItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NhomHsLiquidItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NhomVhScoreItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NhomVhLiquidItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                  </Row>
                </>
              )}
              <Row gutter={25} style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    Dòng tiền và thanh khoản nhóm ngành
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
                {switch_itd_eod === 'eod' && (
                  <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                    {ww > 768 && (
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
                    {ww <= 768 && (
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
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='A' height={ww > 768 ? '300px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                          <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.017, 17)}
                            group='A' height={ww > 768 ? '300px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                          <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='A' height={ww > 768 ? '300px' : '150px'} type='industry' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='B' height={ww > 768 ? '250px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                          <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.017, 17)}
                            group='B' height={ww > 768 ? '250px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                          <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='B' height={ww > 768 ? '250px' : '150px'} type='industry' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='C' height={ww > 768 ? '250px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                          <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.017, 17)}
                            group='C' height={ww > 768 ? '250px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                          <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='C' height={ww > 768 ? '250px' : '150px'} type='industry' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowValueChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='D' height={ww > 768 ? '200px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={5} sm={5} md={6} lg={6} xl={6}>
                          <MoneyFlowBreathChart data={market_breath_df} ww={ww} fontSize={pixel(0.017, 17)}
                            group='D' height={ww > 768 ? '200px' : '150px'} type='industry' />
                        </Col>
                        <Col xs={7} sm={7} md={8} lg={8} xl={8}>
                          <MoneyFlowLiquidityChart data={itd_score_liquidity_last} ww={ww} fontSize={pixel(0.017, 17)}
                            group='D' height={ww > 768 ? '200px' : '150px'} type='industry' />
                        </Col>
                      </Row>
                    </>
                  )}
                  {switch_industry === 'M' && (
                    <>
                      <Row style={{ marginTop: '30px' }}>
                        <TopIndustryChart data={full_industry_ranking} ww={ww} fontSize={pixel(0.017, 17)} />
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_df_5p} ww={ww} fontSize={pixel(0.017, 17)}
                            group='A' height={ww > 768 ? '370px' : '200px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsARanking data={group_score_ranking} ww={ww} fontSize={pixel(0.017, 17)}
                            height={ww > 768 ? '370px' : '200px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_df_5p} ww={ww} fontSize={pixel(0.017, 17)}
                            group='B' height={ww > 768 ? '320px' : '150px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsBRanking data={group_score_ranking} ww={ww} fontSize={pixel(0.017, 17)}
                            height={ww > 768 ? '320px' : '150px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_df_5p} ww={ww} fontSize={pixel(0.017, 17)}
                            group='C' height={ww > 768 ? '320px' : '150px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsCRanking data={group_score_ranking} ww={ww} fontSize={pixel(0.017, 17)}
                            height={ww > 768 ? '320px' : '150px'} type='group' />
                        </Col>
                      </Row>
                      <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                          <MoneyFlowT5Chart data={group_score_df_5p} ww={ww} fontSize={pixel(0.017, 17)}
                            group='D' height={ww > 768 ? '250px' : '150px'} type='group' />
                        </Col>
                        <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                          <NganhHsDRanking data={group_score_ranking} ww={ww} fontSize={pixel(0.017, 17)}
                            height={ww > 768 ? '250px' : '150px'} type='group' />
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
              {switch_itd_eod === 'itd' && (
                <>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsAScoreItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsALiquidItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsBScoreItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsBLiquidItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsCScoreItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsCLiquidItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                  </Row>
                  <Row gutter={20} style={{ marginTop: ww > 768 ? '40px' : '30px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsDScoreItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <NganhHsDLiquidItd data={itd_score_liquidity_df} ww={ww} fontSize={pixel(0.017, 17)}
                        height={ww > 768 ? '300px' : '200px'} type='group' />
                    </Col>
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