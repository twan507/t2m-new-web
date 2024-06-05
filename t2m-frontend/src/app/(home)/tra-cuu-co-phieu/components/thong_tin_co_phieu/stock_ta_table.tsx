'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../../styles.css'; // Import CSS file for custom styles

const StockTaTable = (props: any) => {

  const data_sets = props?.data?.filter((item: any) =>
    item.stock === props?.select_stock &&
    item.id === props?.id &&
    props?.ta_name?.includes(item.ta_name)
  )
    .sort((a: any, b: any) => a.order - b.order)

  const columns: TableProps<any>['columns'] = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text: string) => (
        <span style={{
          color: 'white',
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-start',
          lineHeight: props?.lineHeight
        }}>{text}</span>
      ),
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '30%',
      render: (value: number, record: any) => {
        const fromValue = record.from; // Lấy giá trị từ dataIndex "from"
        return (
          <span style={{
            color: fromValue < 0 ? '#e14040' : '#24B75E',
            fontFamily: 'Calibri, sans-serif',
            fontSize: props?.fontSize,
            display: 'flex',
            justifyContent: 'flex-end',
            lineHeight: props?.lineHeight
          }}>{value}</span>
        );
      }
    },
    {
      title: '',
      dataIndex: 'from',
      key: 'from',
      width: '30%',
      render: (value: number) => (
        <span style={{
          color: value < 0 ? '#e14040' : '#24B75E',
          fontFamily: 'Calibri, sans-serif',
          fontSize: props?.fontSize,
          display: 'flex',
          justifyContent: 'flex-end',
          lineHeight: props?.lineHeight // Sử dụng biến lineHeight từ props
        }}>{`${(value * 100).toFixed(2)}%`}</span>
      ),
    },
  ];

  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <div style={{ width: props?.width, margin: 0, padding: 0, height: props?.height, marginTop: props?.marginTop }}>
          <Table className="taindex-table" columns={columns} dataSource={data_sets} pagination={false} showHeader={false} rowKey="index" />
        </div>
      </>
    )
  }

  return null;
}

export default StockTaTable;
