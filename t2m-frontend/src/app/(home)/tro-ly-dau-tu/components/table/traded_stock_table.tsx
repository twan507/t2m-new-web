'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../../styles.css';

function convertDate(inputDate: any) {
  // Tách chuỗi thành [năm, tháng, ngày]
  const [year, month, day] = inputDate.split("-");

  // Trả về chuỗi theo định dạng dd/mm/yyyy
  return `${day}/${month}/${year}`;
}

const TradedStockTable = (props: any) => {

  const filterData = (data: any) => {
    let filterData: any = data

    if (props?.filter_nhom_nganh?.length === 0) { filterData = filterData }
    else { filterData = filterData.filter((item: any) => props?.filter_nhom_nganh?.includes(item.industry_name)) };

    filterData = filterData
      ?.sort((a: any, b: any) => new Date(b.sell_date).getTime() - new Date(a.sell_date).getTime())
      ?.map((item: any, stt: any) => ({ ...item, stt: stt }));

    return filterData
  };

  const data_sets = filterData(props?.data)
    ?.sort((a: any, b: any) => new Date(b.sell_date).getTime() - new Date(a.sell_date).getTime())
    ?.map((item: any, stt: any) => ({ ...item, stt: stt, key: `${item.stock}-${stt}` }));

  const columns = (props: any, ww: any): TableProps<any>['columns'] => {
    const baseColumns = [
      {
        title:
          <span
            style={{
              display: 'flex', justifyContent: 'left',
              fontSize: parseInt(props?.fontSize) - 3,
            }}>
            #
          </span>,
        width: '2%',
        dataIndex: 'stt',
        sorter: (a: any, b: any) => a.stt - b.stt, // Sắp xếp theo 'stt'
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
        title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 767 ? 'Cổ phiếu' : 'Mã'} </span>,
        dataIndex: 'stock',
        width: '14%',
        sorter: (a: any, b: any) => a.stock.localeCompare(b.stock), // Sắp xếp theo 'stock'
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
      },
      {
        title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 767 ? 'Nhóm ngành' : 'Ngành'} </span>,
        dataIndex: 'industry_name',
        width: '14%',
        sorter: (a: any, b: any) => a.industry_name.localeCompare(b.industry_name), // Sắp xếp theo 'industry_name'
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
      },
      {
        title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Giá mua </span>,
        className: 'left-sort',
        dataIndex: `buy_price`,
        width: '14%',
        sorter: (a: any, b: any) => a.buy_price - b.buy_price, // Sắp xếp theo 'buy_price'
        render: (value: number) => (
          <span style={{
            color: '#ffffff',
            fontFamily: 'Calibri, sans-serif',
            fontSize: props?.fontSize,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{value.toFixed(2)}</span>
        ),
      },
      {
        title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Giá bán </span>,
        className: 'left-sort',
        dataIndex: `sell_price`,
        width: '14%',
        sorter: (a: any, b: any) => a.sell_price - b.sell_price, // Sắp xếp theo 'sell_price'
        render: (value: number) => (
          <span style={{
            color: '#ffffff',
            fontFamily: 'Calibri, sans-serif',
            fontSize: props?.fontSize,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{value.toFixed(2)}</span>
        ),
      },
      {
        title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> % lãi/lỗ </span>,
        className: 'left-sort',
        dataIndex: `profit`,
        width: '14%',
        sorter: (a: any, b: any) => a.profit - b.profit, // Sắp xếp theo 'profit'
        render: (value: number) => (
          <span style={{
            color: value <= -0.0001 ? '#e14040' : (value >= 0.0001 ? '#24B75E' : '#D0be0f'),
            fontFamily: 'Calibri, sans-serif',
            fontSize: props?.fontSize,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{`${(value * 100).toFixed(2)}%`}</span>
        ),
      },
    ];

    if (ww >= 767) {
      baseColumns.splice(3, 0,
        {
          title: <span style={{ display: 'flex', justifyContent: 'center', fontSize: parseInt(props?.fontSize) - 3 }}> Ngày mua </span>,
          dataIndex: 'buy_date',
          width: '14%',
          sorter: (a: any, b: any) => new Date(a.buy_date).getTime() - new Date(b.buy_date).getTime(), // Sắp xếp theo 'buy_date'
          render: (text: string) => (
            <span style={{
              color: '#ffffff',
              fontFamily: 'Calibri, sans-serif',
              fontSize: parseInt(props?.fontSize) - 1,
              display: 'flex',
              justifyContent: 'center',
              lineHeight: props?.lineHeight
            }}>{convertDate(text)}</span>
          ),
        },
        {
          title: <span style={{ display: 'flex', justifyContent: 'center', fontSize: parseInt(props?.fontSize) - 3 }}> Ngày bán </span>,
          dataIndex: 'sell_date',
          width: '14%',
          sorter: (a: any, b: any) => new Date(a.sell_date).getTime() - new Date(b.sell_date).getTime(), // Sắp xếp theo 'sell_date'
          render: (text: string) => (
            <span style={{
              color: '#ffffff',
              fontFamily: 'Calibri, sans-serif',
              fontSize: parseInt(props?.fontSize) - 1,
              display: 'flex',
              justifyContent: 'center',
              lineHeight: props?.lineHeight
            }}>{convertDate(text)}</span>
          ),
        },
      );
    }

    return baseColumns;
  };


  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <div style={{ width: '100%', margin: 0, padding: '0px', borderRadius: '5px' }}>
        <Table
          style={{ padding: '0px 10px 10px 10px' }}
          dataSource={data_sets}
          className="custom-table"
          columns={columns(props, props?.ww)}
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
  }

  return null;
}

export default TradedStockTable;
