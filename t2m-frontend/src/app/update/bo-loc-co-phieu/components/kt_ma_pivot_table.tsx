'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../styles.css';

const getColorLiquidity = (value: number) => {
  if (value < 50) return '#00cccc';
  if (value < 80) return '#e14040';
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

const KtMaPivotTable = (props: any) => {

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

    filterData = filterData
      ?.sort((a: any, b: any) => a.stock.localeCompare(b.stock))
      ?.map((item: any, stt: any) => ({ ...item, stt: stt }));

    return filterData
  };

  const data_sets = filterData(props?.data)
    ?.sort((a: any, b: any) => a.stock.localeCompare(b.stock))
    ?.map((item: any, stt: any) => ({ ...item, stt: stt }));

  const ma_pivot_columns = [
    {
      title:
        <span
          style={{
            display: 'flex', justifyContent: 'center',
            fontSize: parseInt(props?.fontSize) - 3,
          }}>
          #&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>,
      width: '3%',
      dataIndex: 'stt',
      render: (text: number, record: any, stt: any) => (
        <span style={{
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          fontSize: parseInt(props?.fontSize) - 1,
          display: 'flex',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{(props.currentPage - 1) * props.pageSize + stt + 1}</span>
      ),
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

  return (
    <div style={{ width: '100%', margin: 0, padding: '0px', borderRadius: '5px' }}>
      <Table
        style={{ padding: '0px 10px 10px 10px' }}
        dataSource={data_sets}
        className="custom-table"
        columns={ma_pivot_columns}
        pagination={{
          current: props.currentPage,
          pageSize: props.pageSize,
          total: data_sets?.length,
          showSizeChanger: true, // Hiển thị bộ chọn số lượng hàng trên mỗi trang
          pageSizeOptions: ['10', '20', '50', '100'], // Các lựa chọn số lượng hàng trên mỗi trang
          onChange: (page, size) => {
            props.setCurrentPage(page);
            props.setPageSize(size);
          },
          onShowSizeChange: (current, size) => {
            props.setPageSize(size);
          },
        }}
        rowKey="key"
      />
    </div>
  );
};

export default KtMaPivotTable;
