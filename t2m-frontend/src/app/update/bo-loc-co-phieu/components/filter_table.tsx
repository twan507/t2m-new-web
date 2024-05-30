'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../styles.css';

const getColorLiquidity = (value: number) => {
  if (value < 60) return '#00cccc';
  if (value < 90) return '#e14040';
  if (value < 120) return '#D0be0f';
  if (value < 150) return '#24B75E';
  return '#C031C7';
};

const getColorTopRankCount = (value: number) => {
  if (value < 1) return '#00cccc';
  if (value < 3) return '#e14040';
  if (value < 5) return '#D0be0f';
  if (value < 10) return '#24B75E';
  return '#C031C7';
};

const getColorTrend = (value: string) => {
  if (value === 'Tăng mạnh') return '#C031C7';
  if (value === 'Tăng') return '#24B75E';
  if (value === 'Trung lập') return '#D0be0f';
  if (value === 'Giảm') return '#e14040';
  if (value === 'Giảm mạnh') return '#00cccc';
};

const orderTrend = ['Tăng mạnh', 'Tăng', 'Trung lập', 'Giảm', 'Giảm mạnh'];

const FilterStockTable = (props: any) => {

  const filter_ta_value = props?.filter_slider_value
  const filter_ta_columns = props?.ta_filter_candle.concat(props?.ta_filter_ma_pivot).concat(props?.ta_filter_fibo)

  const filterData = (data: any) => {
    let filterData: any = data

    if (props?.filter_nhom_nganh?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_nhom_nganh?.includes(item.industry_name)) };

    if (props?.filter_hieu_suat?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_hieu_suat?.includes(item.industry_perform)) };

    if (props?.filter_von_hoa?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_von_hoa?.includes(item.marketcap_group)) };

    if (props?.filter_t0?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_t0?.includes(item.filter_t0)) };

    if (props?.filter_t5?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_t5?.includes(item.filter_t5)) };

    if (props?.filter_liquid?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_liquid?.includes(item.filter_liquid)) };

    if (props?.filter_rank?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_rank?.includes(item.filter_rank)) };

    if (props?.filter_month_trend?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_month_trend?.includes(item.month_trend)) };

    if (props?.filter_quarter_trend?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_quarter_trend?.includes(item.quarter_trend)) };

    if (props?.filter_year_trend?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_year_trend?.includes(item.year_trend)) };

    if (filter_ta_columns.length === 0) { filterData = filterData }
    else {
      filterData = filterData.filter((item: any) => {
        return filter_ta_columns.every((column: any) => {
          const value = item[column];
          return value >= filter_ta_value[0] && value <= filter_ta_value[1];
        });
      });
    };

    return filterData
  };

  const data_sets = filterData(props?.data)
    ?.sort((a: any, b: any) => a.stock.localeCompare(b.stock))
    ?.map((item: any, stt: any) => ({ ...item, stt: stt + 1 }));

  const dt_columns = (props: any, ww: any): TableProps<any>['columns'] => {
    const baseColumns = [
      {
        title:
          <span
            style={{
              display: 'flex', justifyContent: 'center',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            #
          </span>,
        width: '3%',
        dataIndex: 'stt',
        render: (text: number) => (
          <span style={{
            color: '#ffffff',
            fontFamily: 'Calibri, sans-serif',
            fontSize: parseInt(props?.fontSize) - 1,
            display: 'flex',
            justifyContent: 'flex-start',
            lineHeight: props?.lineHeight
          }}>{text}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = parseFloat(a.stt);
          const bValue = parseFloat(b.stt);
          return bValue - aValue;
        }
      },
      {
        title:
          <span
            style={{
              display: 'flex', justifyContent: 'flex-start',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 767 ? (<>Cổ<br />phiếu</>) : (<>Mã</>)}
          </span>,
        dataIndex: 'stock',
        // width: '9%',
        render: (text: string) => (
          <span style={{
            color: '#ffffff',
            fontFamily: 'Calibri, sans-serif',
            fontSize: parseInt(props?.fontSize) - 1,
            display: 'flex',
            fontWeight: 'bold',
            justifyContent: 'flex-start',
            lineHeight: props?.lineHeight
          }}>{text}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = a.stock.toLowerCase();
          const bValue = b.stock.toLowerCase();
          if (aValue < bValue) {
            return -1;
          }
          if (aValue > bValue) {
            return 1;
          }
          return 0;
        }
      },
      {
        title:
          <span
            style={{
              display: 'flex', justifyContent: 'flex-start',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 767 ? (<>Nhóm<br />ngành</>) : (<>Ngành</>)}
          </span>,
        dataIndex: 'industry_name',
        // width: '21%',
        render: (text: string) => (
          <span style={{
            color: '#ffffff',
            fontFamily: 'Calibri, sans-serif',
            fontSize: parseInt(props?.fontSize) - 1,
            display: 'flex',
            justifyContent: 'flex-start',
            lineHeight: props?.lineHeight
          }}>{text}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = a.industry_name.toLowerCase();
          const bValue = b.industry_name.toLowerCase();
          if (aValue < bValue) {
            return -1;
          }
          if (aValue > bValue) {
            return 1;
          }
          return 0;
        }
      },
      {
        title:
          <span
            style={{
              display: 'flex', justifyContent: ww > 1210 ? 'flex-start' : 'center',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 1210 ? (<>HS<br />cổ phiếu</>) : (ww > 767 ? (<>HS<br />CP</>) : (<>HS</>))}
          </span>,
        dataIndex: 'stock_perform',
        width: '6%',
        render: (text: string) => (
          <span style={{
            color: '#ffffff',
            fontFamily: 'Calibri, sans-serif',
            fontSize: parseInt(props?.fontSize) - 1,
            display: 'flex',
            justifyContent: ww > 1210 ? 'flex-start' : 'center',
            lineHeight: props?.lineHeight
          }}>{text}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = a.stock_perform.toLowerCase();
          const bValue = b.stock_perform.toLowerCase();
          if (aValue < bValue) {
            return -1;
          }
          if (aValue > bValue) {
            return 1;
          }
          return 0;
        }
      },
      {
        title:
          <span
            className='span-right'
            style={{
              display: 'flex', justifyContent: 'flex-end',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 767 ? (<>Giá<br />hiện tại</>) : (<>Giá</>)}
          </span>,
        dataIndex: 'close',
        className: 'left-sort',
        // width: '9%',
        render: (value: number) => (
          <span style={{
            color: '#ffffff',
            fontFamily: 'Calibri, sans-serif',
            fontSize: parseInt(props?.fontSize) - 1,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{props?.ww > 767 ? value.toFixed(2) : value.toFixed(1)}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = parseFloat(a.close);
          const bValue = parseFloat(b.close);
          return bValue - aValue;
        }
      },
      {
        title:
          <span
            className='span-right'
            style={{
              display: 'flex', justifyContent: 'flex-start',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 767 ? (<>%<br />thay đổi</>) : (<>%</>)}
          </span>,
        dataIndex: `price_change`,
        className: 'left-sort',
        // width: '6%',
        render: (value: number) => (
          <span style={{
            color: value < 0 ? '#e14040' : '#24B75E',
            fontFamily: 'Calibri, sans-serif',
            fontSize: props?.fontSize,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{props?.ww > 767 ? `${(value * 100).toFixed(2)}%` : `${(value * 100).toFixed(1)}%`}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = parseFloat(a.price_change);
          const bValue = parseFloat(b.price_change);
          return bValue - aValue;
        }
      },
      {
        title:
          <span
            className='span-right'
            style={{
              display: 'flex', justifyContent: 'flex-end',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 767 ? (<>Dòng tiền<br />trong phiên</>) : (<>DT T0</>)}
          </span>,
        dataIndex: `t0_score`,
        className: 'left-sort',
        // width: '11%',
        render: (value: number) => (
          <span style={{
            color: value < 0 ? '#e14040' : '#24B75E',
            fontFamily: 'Calibri, sans-serif',
            fontSize: props?.fontSize,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{value?.toFixed(2)}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = parseFloat(a.t0_score);
          const bValue = parseFloat(b.t0_score);
          return bValue - aValue;
        }
      },
      {
        title:
          <span
            className='span-right'
            style={{
              display: 'flex', justifyContent: 'flex-end',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 767 ? (<>Dòng tiền<br />trong tuần</>) : (<>DT T5</>)}
          </span>,
        dataIndex: 't5_score',
        className: 'left-sort',
        // width: '9%',
        render: (value: number) => (
          <span style={{
            color: value < 0 ? '#e14040' : '#24B75E',
            fontFamily: 'Calibri, sans-serif',
            fontSize: parseInt(props?.fontSize) - 1,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{value.toFixed(2)}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = parseFloat(a.t5_score);
          const bValue = parseFloat(b.t5_score);
          return bValue - aValue;
        }
      },
      {
        title:
          <span
            className='span-right'
            style={{
              display: 'flex', justifyContent: 'flex-end',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            {ww > 767 ? (<>Chỉ só<br />thanh khoản</>) : (<>CSTK</>)}
          </span>,
        dataIndex: `liquid_ratio`,
        className: 'left-sort',
        // width: '16%',
        render: (value: number) => (
          <span style={{
            color: getColorLiquidity(value * 100),
            fontFamily: 'Calibri, sans-serif',
            fontSize: props?.fontSize,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{ww > 767 ? `${(value * 100).toFixed(2)}%` : `${(value * 100).toFixed(0)}%`}</span>
        ),
        sorter: (a: any, b: any) => {
          const aValue = parseFloat(a.liquid_ratio);
          const bValue = parseFloat(b.liquid_ratio);
          return bValue - aValue;
        }
      },
    ];

    if (ww >= 1100) {
      baseColumns.splice(3, 0,
        {
          title:
            <span
              style={{
                display: 'flex', justifyContent: 'flex-start',
                fontSize: parseInt(props?.fontSize) - 3,
              }}>
              {ww > 767 ? (<>Nhóm<br />hiệu suất</>) : (<>Hiệu<br />suất</>)}
            </span>,
          dataIndex: 'industry_perform',
          width: '7%',
          render: (text: string) => (
            <span style={{
              color: '#ffffff',
              fontFamily: 'Calibri, sans-serif',
              fontSize: parseInt(props?.fontSize) - 1,
              display: 'flex',
              justifyContent: 'flex-start',
              lineHeight: props?.lineHeight
            }}>{text}</span>
          ),
          sorter: (a: any, b: any) => {
            const aValue = a.industry_perform.toLowerCase();
            const bValue = b.industry_perform.toLowerCase();
            if (aValue < bValue) {
              return -1;
            }
            if (aValue > bValue) {
              return 1;
            }
            return 0;
          }
        },
        {
          title:
            <span
              style={{
                display: 'flex', justifyContent: 'flex-start',
                fontSize: parseInt(props?.fontSize) - 3,
              }}>
              {ww > 767 ? (<>Nhóm<br />vốn hoá</>) : (<>Vốn<br />hoá</>)}
            </span>,
          dataIndex: 'marketcap_group',
          // width: '11%',
          render: (text: string) => (
            <span style={{
              color: '#ffffff',
              fontFamily: 'Calibri, sans-serif',
              fontSize: parseInt(props?.fontSize) - 1,
              display: 'flex',
              justifyContent: 'flex-start',
              lineHeight: props?.lineHeight
            }}>{text}</span>
          ),
          sorter: (a: any, b: any) => {
            const aValue = a.marketcap_group.toLowerCase();
            const bValue = b.marketcap_group.toLowerCase();
            if (aValue < bValue) {
              return -1;
            }
            if (aValue > bValue) {
              return 1;
            }
            return 0;
          }
        },
      );
    }

    if (ww > 767) {
      baseColumns.splice(11, 0,
        {
          title:
            <span
              className='span-right'
              style={{
                display: 'flex', justifyContent: 'flex-end',
                fontSize: parseInt(props?.fontSize) - 3,
              }}>
              {ww > 767 ? (<>Xếp hạng<br />hiện tại</>) : (<>XH</>)}
            </span>,
          dataIndex: 'rank',
          className: 'left-sort',
          // width: '9%',
          render: (value: number) => (
            <span style={{
              color: (() => {
                if (value < 10) return '#C031C7';
                if (value < 50) return '#24B75E';
                if (value < 150) return '#D0be0f';
                if (value < 250) return '#e14040';
                return '#00cccc';
              })(),
              fontFamily: 'Calibri, sans-serif',
              fontSize: parseInt(props?.fontSize) - 1,
              display: 'flex',
              justifyContent: 'flex-end',
              lineHeight: props?.lineHeight
            }}>{value}</span>
          ),
          sorter: (a: any, b: any) => {
            const aValue = parseFloat(a.rank);
            const bValue = parseFloat(b.rank);
            return aValue - bValue;
          }
        },
        {
          title:
            <span
              className='span-right'
              style={{
                display: 'flex', justifyContent: 'flex-end',
                fontSize: parseInt(props?.fontSize) - 3,
              }}>
              {ww > 767 ? (<>Lọt top<br />10%</>) : (<>Lọt top<br />10%</>)}
            </span>,
          dataIndex: `top_count`,
          className: 'left-sort',
          // width: '16%',
          render: (value: number) => (
            <span style={{
              color: getColorTopRankCount(value),
              fontFamily: 'Calibri, sans-serif',
              fontSize: props?.fontSize,
              display: 'flex',
              justifyContent: 'flex-end',
              lineHeight: props?.lineHeight
            }}>{value}</span>
          ),
          sorter: (a: any, b: any) => {
            const aValue = parseFloat(a.top_count);
            const bValue = parseFloat(b.top_count);
            return bValue - aValue;
          }
        },
        {
          title:
            <span
              className='span-right'
              style={{
                display: 'flex', justifyContent: 'flex-end',
                fontSize: parseInt(props?.fontSize) - 3,
              }}>
              {ww > 767 ? (<>T2M<br />Select</>) : (<>S</>)}
            </span>,
          dataIndex: `t2m_select`,
          className: 'left-sort',
          // width: '16%',
          render: (value: number) => (
            <span style={{
              color: '#C031C7',
              fontFamily: 'Calibri, sans-serif',
              fontSize: props?.fontSize,
              display: 'flex',
              justifyContent: 'flex-end',
              lineHeight: props?.lineHeight
            }}>{value}</span>
          ),
          sorter: (a: any, b: any) => {
            const aValue = a.t2m_select.toLowerCase();
            const bValue = b.t2m_select.toLowerCase();
            if (bValue < aValue) {
              return -1;
            }
            if (bValue > aValue) {
              return 1;
            }
            return 0;
          }
        },
      );
    }
    return baseColumns;
  };

  const candle_columns = [
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'center',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          #
        </span>,
      width: '3%',
      dataIndex: 'stt',
      render: (text: number) => (
        <span style={{
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.stt);
        const bValue = parseFloat(b.stt);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Cổ<br />phiếu</>) : (<>Mã</>)}
        </span>,
      dataIndex: 'stock',
      width: '2.5%',
      render: (text: string) => (
        <span style={{
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.stock.toLowerCase();
        const bValue = b.stock.toLowerCase();
        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
        return 0;
      }
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Tháng</>) : (<>Tháng</>)}
        </span>,
      dataIndex: 'month_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.month_trend;
        const bValue = b.month_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Quý</>) : (<>Quý</>)}
        </span>,
      dataIndex: 'quarter_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.quarter_trend;
        const bValue = b.quarter_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Năm</>) : (<>Năm</>)}
        </span>,
      dataIndex: 'year_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.year_trend;
        const bValue = b.year_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Month<br />Open</>}
        </span>,
      dataIndex: `from_month_open`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_open);
        const bValue = parseFloat(b.from_month_open);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Month <br /> Last High</>) : (<>M Last<br />High</>)}
        </span>,
      dataIndex: `from_month_last_high`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_last_high);
        const bValue = parseFloat(b.from_month_last_high);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Month <br /> Last Low</>) : (<>M Last<br />Low</>)}
        </span>,
      dataIndex: `from_month_last_low`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_last_low);
        const bValue = parseFloat(b.from_month_last_low);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Quater<br />Open</>}
        </span>,
      dataIndex: `from_quarter_open`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_open);
        const bValue = parseFloat(b.from_quarter_open);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Quarter <br /> Last High</>) : (<>Q Last<br />High</>)}
        </span>,
      dataIndex: `from_quarter_last_high`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_last_high);
        const bValue = parseFloat(b.from_quarter_last_high);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Quarter <br /> Last Low</>) : (<>Q Last<br />Low</>)}
        </span>,
      dataIndex: `from_quarter_last_low`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_last_low);
        const bValue = parseFloat(b.from_quarter_last_low);
        return bValue - aValue;
      }
    },
    {
      title: <span
        className='span-right'
        style={{
          display: 'flex', justifyContent: 'flex-start',
          fontSize: parseInt(props?.fontSize) - 3,
        }}>
        {<>Year<br />Open</>}
      </span>,
      dataIndex: `from_year_open`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_open);
        const bValue = parseFloat(b.from_year_open);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Year <br /> Last High</>) : (<>Y Last<br />High</>)}
        </span>,
      dataIndex: `from_year_last_high`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_last_high);
        const bValue = parseFloat(b.from_year_last_high);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Year <br /> Last Low</>) : (<>Y Last<br />Low</>)}
        </span>,
      dataIndex: `from_year_last_low`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_last_low);
        const bValue = parseFloat(b.from_year_last_low);
        return bValue - aValue;
      }
    },
  ];

  const ma_pivot_columns = [
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'center',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          #
        </span>,
      width: '3%',
      dataIndex: 'stt',
      render: (text: number) => (
        <span style={{
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.stt);
        const bValue = parseFloat(b.stt);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Cổ<br />phiếu</>) : (<>Mã</>)}
        </span>,
      dataIndex: 'stock',
      width: '2.5%',
      render: (text: string) => (
        <span style={{
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.stock.toLowerCase();
        const bValue = b.stock.toLowerCase();
        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
        return 0;
      }
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Tháng</>) : (<>Tháng</>)}
        </span>,
      dataIndex: 'month_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.month_trend;
        const bValue = b.month_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Quý</>) : (<>Quý</>)}
        </span>,
      dataIndex: 'quarter_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.quarter_trend;
        const bValue = b.quarter_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Năm</>) : (<>Năm</>)}
        </span>,
      dataIndex: 'year_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.year_trend;
        const bValue = b.year_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          MA5
        </span>,
      dataIndex: `from_month_ma5`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_ma5);
        const bValue = parseFloat(b.from_month_ma5);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          MA20
        </span>,
      dataIndex: `from_month_ma20`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_ma20);
        const bValue = parseFloat(b.from_month_ma20);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          MA60
        </span>,
      dataIndex: `from_quarter_ma60`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_ma60);
        const bValue = parseFloat(b.from_quarter_ma60);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          MA120
        </span>,
      dataIndex: `from_quarter_ma120`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_ma120);
        const bValue = parseFloat(b.from_quarter_ma120);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          MA240
        </span>,
      dataIndex: `from_year_ma240`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_ma240);
        const bValue = parseFloat(b.from_year_ma240);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          MA480
        </span>,
      dataIndex: `from_year_ma480`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_ma480);
        const bValue = parseFloat(b.from_year_ma480);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Month <br /> Pivot</>}
        </span>,
      dataIndex: `from_month_pivot`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_pivot);
        const bValue = parseFloat(b.from_month_pivot);
        return bValue - aValue;
      }
    },
    {
      title: <span
        className='span-right'
        style={{
          display: 'flex', justifyContent: 'flex-start',
          fontSize: parseInt(props?.fontSize) - 3,
        }}>
        {<>Quarter <br /> Pivot</>}
      </span>,
      dataIndex: `from_quarter_pivot`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_pivot);
        const bValue = parseFloat(b.from_quarter_pivot);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Year <br /> Pivot</>}
        </span>,
      dataIndex: `from_year_pivot`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_pivot);
        const bValue = parseFloat(b.from_year_pivot);
        return bValue - aValue;
      }
    },
  ];

  const fibo_columns = [
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'center',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          #
        </span>,
      width: '3%',
      dataIndex: 'stt',
      render: (text: number) => (
        <span style={{
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.stt);
        const bValue = parseFloat(b.stt);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Cổ<br />phiếu</>) : (<>Mã</>)}
        </span>,
      dataIndex: 'stock',
      width: '2.5%',
      render: (text: string) => (
        <span style={{
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.stock.toLowerCase();
        const bValue = b.stock.toLowerCase();
        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
        return 0;
      }
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Tháng</>) : (<>Tháng</>)}
        </span>,
      dataIndex: 'month_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.month_trend;
        const bValue = b.month_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Quý</>) : (<>Quý</>)}
        </span>,
      dataIndex: 'quarter_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.quarter_trend;
        const bValue = b.quarter_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {props?.ww > 950 ? (<>Xu hướng<br />Năm</>) : (<>Năm</>)}
        </span>,
      dataIndex: 'year_trend',
      width: '9%',
      render: (text: string) => (
        <span style={{
          color: getColorTrend(text),
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = a.year_trend;
        const bValue = b.year_trend;
  
        const aIndex = orderTrend.indexOf(aValue);
        const bIndex = orderTrend.indexOf(bValue);
  
        return aIndex - bIndex;
      },
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Month<br />0.382</>}
        </span>,
      dataIndex: `from_month_fibo_382`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_fibo_382);
        const bValue = parseFloat(b.from_month_fibo_382);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Month<br />0.500</>}
        </span>,
      dataIndex: `from_month_fibo_500`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_fibo_500);
        const bValue = parseFloat(b.from_month_fibo_500);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Month<br />0.618</>}
        </span>,
      dataIndex: `from_month_fibo_618`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_month_fibo_618);
        const bValue = parseFloat(b.from_month_fibo_618);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Quater<br />0.382</>}
        </span>,
      dataIndex: `from_quarter_fibo_382`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_fibo_382);
        const bValue = parseFloat(b.from_quarter_fibo_382);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Quater<br />0.500</>}
        </span>,
      dataIndex: `from_quarter_fibo_500`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_fibo_500);
        const bValue = parseFloat(b.from_quarter_fibo_500);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Quater<br />0.618</>}
        </span>,
      dataIndex: `from_quarter_fibo_618`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_quarter_fibo_618);
        const bValue = parseFloat(b.from_quarter_fibo_618);
        return bValue - aValue;
      }
    },
    {
      title: <span
        className='span-right'
        style={{
          display: 'flex', justifyContent: 'flex-start',
          fontSize: parseInt(props?.fontSize) - 3,
        }}>
        {<>Year<br />0.382</>}
      </span>,
      dataIndex: `from_year_fibo_382`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_fibo_382);
        const bValue = parseFloat(b.from_year_fibo_382);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Year<br />0.500</>}
        </span>,
      dataIndex: `from_year_fibo_500`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_fibo_500);
        const bValue = parseFloat(b.from_year_fibo_500);
        return bValue - aValue;
      }
    },
    {
      title:
        <span
          className='span-right'
          style={{
            display: 'flex', justifyContent: 'flex-start',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          {<>Year<br />0.618</>}
        </span>,
      dataIndex: `from_year_fibo_618`,
      className: 'left-sort',
      width: '7.5%',
      render: (value: number) => (
        <span style={{
          color: value > 0.0001 ? '#24B75E' : (value >= -0.0001 && value <= 0.0001 ? '#D0be0f' : '#e14040'),
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
      sorter: (a: any, b: any) => {
        const aValue = parseFloat(a.from_year_fibo_618);
        const bValue = parseFloat(b.from_year_fibo_618);
        return bValue - aValue;
      }
    },
  ];



  const [columns, setColumns] = useState<any>(dt_columns(props, props?.ww));
  useEffect(() => {
    if (props?.table_type === 'dt') {
      setColumns(dt_columns(props, props?.ww))
    } else if (props?.table_type === 'kt' && props?.switch_ta_table === 'candle') {
      setColumns(candle_columns)
    } else if (props?.table_type === 'kt' && props?.switch_ta_table === 'ma_pivot') {
      setColumns(ma_pivot_columns)
    } else if (props?.table_type === 'kt' && props?.switch_ta_table === 'fibo') {
      setColumns(fibo_columns)
    }
  }, [props?.table_type, props?.switch_ta_table]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <div style={{ width: '100%', margin: 0, padding: '0px', borderRadius: '5px' }}>
          <Table
            style={{ padding: '0px 10px 10px 10px' }}
            className="custom-table"
            columns={columns}
            dataSource={data_sets}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: data_sets?.length,
              showSizeChanger: true, // Hiển thị bộ chọn số lượng hàng trên mỗi trang
              pageSizeOptions: ['10', '20', '50', '100'], // Các lựa chọn số lượng hàng trên mỗi trang
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              onShowSizeChange: (current, size) => {
                setPageSize(size);
              },
            }}
            rowKey="index"
          />
        </div>
      </>
    )
  }

  return null;
}

export default FilterStockTable;
