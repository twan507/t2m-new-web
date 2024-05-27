'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../../styles.css'; // Import CSS file for custom styles

const TopCoPhieuTable = (props: any) => {

    const getColorLiquidity = (value: number) => {
        if (value < 60) return '#00cccc';
        if (value < 90) return '#e14040';
        if (value < 120) return '#D0be0f';
        if (value < 150) return '#24B75E';
        return '#C031C7';
    };

    const data_sets = props?.data?.filter((item: any) => props?.type === 'top' ? item.t0_score > 0 : item.t0_score <= 0)
        .sort((a: any, b: any) => props?.type === 'bottom' ? (a.t0_score - b.t0_score) : (b.t0_score - a.t0_score))

    const columns = (props: any, ww: any): TableProps<any>['columns'] => {
        const baseColumns = [
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Mã </span>,
                dataIndex: 'stock',
                width: '7%',
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Ngành </span>,
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
                // ellipsis: true,

            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Hiệu suất </span>,
                dataIndex: 'industry_perform',
                // width: '16%',
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Vốn hoá </span>,
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
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> % thay đổi </span>,
                dataIndex: `price_change`,
                // width: '12%',
                render: (value: number) => (
                    <span style={{
                        color: value < 0 ? '#e14040' : '#24B75E',
                        fontFamily: 'Calibri, sans-serif',
                        fontSize: props?.fontSize,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        lineHeight: props?.lineHeight
                    }}>{`${(value * 100).toFixed(2)}%`}</span>
                ),
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Dòng tiền </span>,
                dataIndex: `t0_score`,
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
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Thanh khoản </span>,
                dataIndex: `liquid_ratio`,
                // width: '16%',
                render: (value: number) => (
                    <span style={{
                        color: getColorLiquidity(value * 100),
                        fontFamily: 'Calibri, sans-serif',
                        fontSize: props?.fontSize,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        lineHeight: props?.lineHeight
                    }}>{`${(value * 100).toFixed(2)}%`}</span>
                ),
            },
        ];

        if (ww >= 500) {
            baseColumns.splice(4, 0, {
                title: <span style={{ display: 'flex', justifyContent: 'center', fontSize: parseInt(props?.fontSize) - 3 }}> Giá </span>,
                dataIndex: 'close',
                // width: '8%',
                render: (value: number) => (
                    <span style={{
                        color: '#ffffff',
                        fontFamily: 'Calibri, sans-serif',
                        fontSize: parseInt(props?.fontSize) - 1,
                        display: 'flex',
                        justifyContent: 'center',
                        lineHeight: props?.lineHeight
                    }}>{value.toFixed(2)}</span>
                ),
            });
        }

        return baseColumns;
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <>
                <div style={{ width: props?.width, margin: 0, padding: '0px', height: props?.height, background: '#161616', borderRadius: '5px' }}>
                    <Table className="custom-table" columns={columns(props, props?.ww)} dataSource={data_sets} pagination={false} rowKey="index" />
                </div>
            </>
        )
    }

    return null;
}

export default TopCoPhieuTable;
