'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../../styles.css'; // Import CSS file for custom styles

const TopCoPhieuTable = (props: any) => {

    const getColorLiquidity = (value: number) => {
        if (value < 50) return '#00cccc';
        if (value < 80) return '#e14040';
        if (value < 120) return '#D0be0f';
        if (value < 150) return '#24B75E';
        return '#C031C7';
    };

    const data_sets = props?.data?.filter((item: any) => props?.type === 'top' ? item.type === 'top' : item.type === 'bottom')
        .sort((a: any, b: any) => props?.type === 'bottom' ? (a.t0_score - b.t0_score) : (b.t0_score - a.t0_score))

    function isArrayValid(array: any[]): boolean {
        return array?.some(item => item.stock !== null && item.t0_score !== null);
    }

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
                    {isArrayValid(data_sets) && (
                        <div style={{ background: '#161616', padding: '10px 10px 0px 10px', borderRadius: '5px', margin: 0 }}>
                            <p style={{
                                fontFamily: 'Calibri, sans-serif', fontWeight: 'bold', fontSize: props?.fontSize, color: 'white',
                                marginTop: '1px', margin: 0, height: props?.ww > 767 ? '32px' : '22px'
                            }}>Top cổ phiếu dòng tiền vào mạnh</p>
                            <Table className="custom-table" columns={columns(props, props?.ww)} dataSource={data_sets} pagination={false} rowKey="index" />
                        </div>
                    )}
                    {!isArrayValid(data_sets) && (
                        <div style={{
                            marginTop: '10px', height: '100%', width: '100%',
                            backgroundColor: '#161616', borderRadius: '5px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#dfdfdf'
                        }}>
                            {props?.type === 'top' ? 'Top cổ phiếu dòng tiền vào trong phiên' : 'Top cổ phiếu dòng tiền ra trong phiên'}
                        </div>
                    )}
                </div>
            </>
        )
    }

    return null;
}

export default TopCoPhieuTable;
