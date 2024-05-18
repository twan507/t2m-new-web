'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../../styles.css'; // Import CSS file for custom styles

const NnTdBuySellTable = (props: any) => {

    const data_sets = props?.data?.filter((item: any) => item.id === props?.id)

    const columns: TableProps<any>['columns'] = [
        {
            title: ' ',
            dataIndex: 'type',
            width: '30%',
            render: (text: string) => (
                <span style={{
                    color: '#B3B3B3',
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
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 1 }}> KLGD (Cổ) </span>,
            dataIndex: `KLGD_${props?.switch_kntd}`,
            width: '35%',
            render: (value: number) => (
                <span style={{
                    color: value < 0 ? '#e14040' : '#24B75E',
                    fontFamily: 'Calibri, sans-serif',
                    fontSize: props?.fontSize,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    lineHeight: props?.lineHeight
                }}>{Math.round(value).toLocaleString('en-US')}</span>
            ),
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 1 }}> GTGD (Tỷ) </span>,
            dataIndex: `GTGD_${props?.switch_kntd}`,
            width: '35%',
            render: (value: number) => (
                <span style={{
                    color: value < 0 ? '#e14040' : '#24B75E',
                    fontFamily: 'Calibri, sans-serif',
                    fontSize: props?.fontSize,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    lineHeight: props?.lineHeight // Sử dụng biến lineHeight từ props
                }}>{Number(value?.toFixed(2)).toLocaleString('en-US')}</span>
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
                <div style={{ width: props?.width, margin: 0, padding: '0px 10px 10px 10px', height: props?.height, background: '#161616', borderRadius: '5px', marginTop: props?.marginTop }}>
                    <Table className="custom-table" columns={columns} dataSource={data_sets} pagination={false} rowKey="index" />
                </div>
            </>
        )
    }

    return null;
}

export default NnTdBuySellTable;
