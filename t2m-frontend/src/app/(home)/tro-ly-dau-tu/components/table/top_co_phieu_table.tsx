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

    const data_sets = props?.data
    console.log(props?.subdata)

    function isArrayValid(array: any[]): boolean {
        return array?.some(item => item.stock !== null && item.t0_score !== null);
    }

    const columns = (props: any, ww: any): TableProps<any>['columns'] => {
        const baseColumns = [
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3, paddingLeft: '10px' }}> # </span>,
                width: '8%',
                dataIndex: 'rank',
                render: (value: number) => (
                    <span style={{
                        color: '#ffffff',
                        fontFamily: 'Calibri, sans-serif',
                        fontSize: parseInt(props?.fontSize) - 1,
                        display: 'flex',
                        fontWeight: 'bold',
                        justifyContent: 'flex-start',
                        lineHeight: props?.lineHeight,
                        paddingLeft: '10px'
                    }}>
                        {value}
                    </span>
                ),
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Hiệu suất A </span>,
                dataIndex: 'A',
                // width: '8%',
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Hiệu suất B </span>,
                dataIndex: 'B',
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
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Hiệu suất C </span>,
                dataIndex: 'C',
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
        ];
        return baseColumns;
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <>
                <div style={{ width: '100%', margin: 0, padding: '0px', background: '#161616', borderRadius: '5px' }}>
                    {isArrayValid(data_sets) && (
                        <Table className="custom-table" columns={columns(props, props?.ww)} dataSource={data_sets} pagination={false} rowKey="index" />
                    )}
                    {!isArrayValid(data_sets) && (
                        <div style={{
                            marginTop: '10px', height: '300px', width: '100%',
                            backgroundColor: '#161616', borderRadius: '5px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#dfdfdf'
                        }}>
                            Top cổ phiếu dòng tiền vào trong phiên
                        </div>
                    )}
                </div>
            </>
        )
    }

    return null;
}

export default TopCoPhieuTable;
