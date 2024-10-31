'use client'
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import '../../styles.css'; // Import CSS file for custom styles


const TopIndustryTable = (props: any) => {

    const buttonColor = (text: string) => {
        const value = props?.subdata.filter((item: any) => item.industry === text)[0]?.final_portion
        return value ? '#1c9814' : '#981414'
    };

    const data_sets = props?.data

    const columns = (props: any, ww: any): TableProps<any>['columns'] => {
        const baseColumns = [
            {
                title: <span style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Xếp hạng </span>,
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
                    }}>
                        {value}
                    </span>
                ),
            },
            {
                title: <span style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Hiệu suất A </span>,
                dataIndex: 'A',
                // width: '8%',
                render: (text: string) => (
                    <span style={{
                        color: '#ffffff',
                        fontFamily: 'Calibri, sans-serif',
                        fontSize: parseInt(props?.fontSize) - 1,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        lineHeight: props?.lineHeight
                    }}>
                        {text?.length > 0 ? (
                            <button
                                onClick={() => { props.setFunction(text) }}
                                style={{
                                    color: '#dfdfdf',
                                    backgroundColor: buttonColor(text),
                                    fontSize: parseInt(props?.fontSize) - 3,
                                    border: '0px',
                                    padding: '2px 5px 3px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                }}>
                                {text}
                            </button>
                        ) : null}
                    </span>
                ),
            },
            {
                title: <span style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Hiệu suất B </span>,
                dataIndex: 'B',
                // width: '21%',
                render: (text: string) => (
                    <span
                        onClick={() => { props.setFunction(text) }}
                        style={{
                            color: '#ffffff',
                            fontFamily: 'Calibri, sans-serif',
                            fontSize: parseInt(props?.fontSize) - 1,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            lineHeight: props?.lineHeight
                        }}>
                        {text?.length > 0 ? (
                            <button style={{
                                color: '#dfdfdf',
                                backgroundColor: buttonColor(text),
                                fontSize: parseInt(props?.fontSize) - 3,
                                border: '0px',
                                padding: '2px 5px 3px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}>
                                {text}
                            </button>
                        ) : null}
                    </span>
                ),
            },
            {
                title: <span style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> Hiệu suất C </span>,
                dataIndex: 'C',
                // width: '16%',
                render: (text: string) => (
                    <span
                        onClick={() => { props.setFunction(text) }}
                        style={{
                            color: '#ffffff',
                            fontFamily: 'Calibri, sans-serif',
                            fontSize: parseInt(props?.fontSize) - 1,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            lineHeight: props?.lineHeight
                        }}>
                        {text?.length > 0 ? (
                            <button style={{
                                color: '#dfdfdf',
                                backgroundColor: buttonColor(text),
                                fontSize: parseInt(props?.fontSize) - 3,
                                border: '0px',
                                padding: '2px 5px 3px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}>
                                {text}
                            </button>
                        ) : null}
                    </span>
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
                <div style={{ width: '100%', margin: '20px 0px 0px 0px', padding: '0px 5px 5px 10px', background: '#161616', borderRadius: '5px' }}>
                    <Table className="custom-table" columns={columns(props, props?.ww)} dataSource={data_sets} pagination={false} rowKey="index" />
                </div>
            </>
        )
    }

    return null;
}

export default TopIndustryTable;
