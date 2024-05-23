'use client'
import { sendRequest } from "@/utlis/api"
import { Input, Col, Menu, MenuProps, Radio, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import './styles.css'
import IndexGroupPriceChart from "./components/index_chart/index_price_chart";
import DtVaTkTrongPhien from "./components/dien_bien_dong_tien/dt_va_tk_trong_phien";
import GroupWeekScoreChart from "./components/dien_bien_dong_tien/score_week";
import GroupMonthScoreChart from "./components/dien_bien_dong_tien/score_month";
import GroupRankingChart from "./components/suc_manh_dong_tien/group_ranking";
import GroupLiquidityLineChart20p from "./components/suc_manh_dong_tien/thanh_khoan_20p";
import GroupMarketStructureChart from "./components/cau_truc_song/cau_truc_song_chart";
import GroupTopCoPhieuTable from "./components/bang_top_co_phieu/top_co_phieu_table";
import { SearchOutlined } from "@ant-design/icons";
import SearchComponent from "./components/search_bar";

const { Search } = Input;

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
  const [select_stock, set_select_stock] = useState('AAA');

  const getData = async (tableName: string, columnName: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stockdata/${tableName}`,
      method: "GET",
      // queryParams: { columnName: columnName, columnValue: select_stock },
    })
    if (tableName === 'update_time') {
      await set_update_time(res.data)
    } else if (tableName === 'stock_price_chart_df') {
      await set_stock_price_chart_df(res.data)
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
    } else if (tableName === 'eod_score_df') {
      await set_eod_score_df(res.data)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      getData('update_time', null);
      getData('stock_price_chart_df', 'group_name');
      getData('itd_score_liquidity_melted', 'group_name');
      getData('group_score_week', 'group_name');
      getData('group_score_month', 'group_name');
      getData('group_score_month', 'group_name');
      getData('group_score_ranking_melted', 'group_name');
      getData('eod_score_liquidity_melted', 'group_name');
      getData('market_ms', 'name');
      getData('group_stock_top_10_df', 'name');
      getData('eod_score_df', 'stock');
    };
    fetchData();

    const interval = setInterval(fetchData, 10 * 1000); // Gọi lại mỗi x giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [select_stock]);

  //State lưu trữ dữ liệu cổ phiếu
  const [update_time, set_update_time] = useState<any[]>([]);
  const [eod_score_df, set_eod_score_df] = useState<any[]>([]);
  const [stock_price_chart_df, set_stock_price_chart_df] = useState<any[]>([]);

  const [itd_score_liquidity_melted, set_itd_score_liquidity_melted] = useState<any[]>([]);
  const [group_score_week, set_group_score_week] = useState<any[]>([]);
  const [group_score_month, set_group_score_month] = useState<any[]>([]);
  const [group_score_ranking_melted, set_group_score_ranking_melted] = useState<any[]>([]);
  const [eod_score_liquidity_melted, set_eod_score_liquidity_melted] = useState<any[]>([]);
  const [market_ms, set_market_ms] = useState<any[]>([]);
  const [group_stock_top_10_df, set_group_stock_top_10_df] = useState<any[]>([]);

  //State lưu giữ trạng thái hiển thị của các nút bấm
  const [switch_group_industry, set_switch_group_industry] = useState('group');
  const [switch_hs_cap, set_switch_hs_cap] = useState('hs');
  const [switch_nhom_nganh_hs, set_switch_nhom_nganh_hs] = useState('A');
  const [time_span, set_time_span] = useState('1M');

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }

  const onChangeSelectGroup = (e: any) => {
    const value = e.target.value;
    set_select_stock(value)
  };

  const onChangeIndexPriceChartTimeSpan = (e: any) => {
    const value = e.target.value;
    set_time_span(value)
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
                <Col xs={0} sm={15} md={16} lg={16} xl={16}><div style={{ width: '100%'}}></div></Col>
                <Col xs={24} sm={9} md={8} lg={8} xl={8}>
                  <SearchComponent data={eod_score_df} set_select_stock={set_select_stock} />
                </Col>
              </Row>
              <Row>
                <Col xs={8} sm={6} md={5} lg={5} xl={4}>


                </Col>
                <Col xs={16} sm={18} md={19} lg={19} xl={20}>
                  <Row gutter={25} style={{ marginTop: '30px', marginBottom: '10px' }}>
                    <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                      <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                        {`Index nhóm ${select_stock}`}
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
                    <IndexGroupPriceChart data={stock_price_chart_df} select_stock={select_stock} time_span={time_span} width='100%' height={ww > 768 ? '270px' : '215px'} />
                  </Row>
                </Col>
              </Row>



              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Diễn biến dòng tiền nhóm ${select_stock}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: '30px' }}>
                <DtVaTkTrongPhien data={itd_score_liquidity_melted} select_stock={select_stock} ww={ww} fontSize={pixel(0.017, 17)} />
              </Row>
              <Row gutter={10} style={{ marginTop: '20px' }}>
                <Col xs={12} sm={10} md={8} lg={8} xl={8}>
                  <GroupWeekScoreChart data={group_score_week} ww={ww} select_stock={select_stock} fontSize={pixel(0.015, 17)} />
                </Col>
                <Col xs={12} sm={14} md={16} lg={16} xl={16}>
                  <GroupMonthScoreChart data={group_score_month} ww={ww} select_stock={select_stock} fontSize={pixel(0.015, 17)} />
                </Col>
              </Row>
              <Row style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Sức mạnh dòng tiền nhóm ${select_stock}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row style={{ marginTop: ww > 768 ? '30px' : '20px' }}>
                <GroupRankingChart data={group_score_ranking_melted} ww={ww} select_stock={select_stock}
                  switch_group_industry={switch_group_industry} fontSize={pixel(0.017, 17)} />
              </Row>
              <Row style={{ marginTop: ww > 768 ? '20px' : '10px' }}>
                <GroupLiquidityLineChart20p data={eod_score_liquidity_melted} select_stock={select_stock} fontSize={pixel(0.017, 17)} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Cấu trúc sóng nhóm ${select_stock}`}
                  </p>
                  <p style={{ color: 'white', fontSize: pixel(0.011, 10), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0 }}>{update_time?.[0]?.date}</p>
                </Col>
              </Row>
              <Row>
                <GroupMarketStructureChart data={market_ms} ww={ww} fontSize={pixel(0.015, 17)} select_stock={select_stock} />
              </Row>
              <Row style={{ marginTop: '50px', marginBottom: '10px' }}>
                <Col>
                  <p style={{ color: 'white', fontSize: pixel(0.025, 18), fontFamily: 'Calibri, sans-serif', margin: 0, padding: 0, fontWeight: 'bold' }}>
                    {`Top cổ phiếu nhóm ${select_stock}`}
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

            </Col >
          </Row >
        </Col >
      </>
    )
  }
}