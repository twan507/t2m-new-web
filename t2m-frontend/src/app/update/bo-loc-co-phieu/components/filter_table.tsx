'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../styles.css'; // Import CSS file for custom styles

const FilterStockTable = (props: any) => {

    const getColorLiquidity = (value: number) => {
        if (value < 60) return '#00cccc';
        if (value < 90) return '#e14040';
        if (value < 120) return '#D0be0f';
        if (value < 150) return '#24B75E';
        return '#C031C7';
    };

    const data_sets = props?.data?.sort((a: any, b: any) => a.stock.localeCompare(b.stock)).map((item: any, stt: number) => ({ ...item, stt: stt + 1 }));

    const columns = (props: any, ww: any): TableProps<any>['columns'] => {
        const baseColumns = [
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> # </span>,
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
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Cổ phiếu' : 'Mã'} </span>,
                dataIndex: 'stock',
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Tên ngành' : 'Ngành'} </span>,
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
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}>{ww > 768 ? 'Nhóm hiệu suất' : 'Hiệu suất'} </span>,
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Nhóm vốn hoá' : 'Vốn hoá'} </span>,
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Dòng tiền trong phiên' : 'Dòng tiền'} </span>,
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Chỉ số thanh khoản' : 'Thanh khoản'} </span>,
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

        if (ww >= 768) {
            baseColumns.splice(4, 0,
                {
                    title: <span style={{ display: 'flex', justifyContent: 'center', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Giá hiện tại' : 'Giá'} </span>,
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
                }
            );
            baseColumns.splice(7, 0,
                {
                    title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Dòng tiền trong tuần </span>,
                    dataIndex: 't5_score',
                    // width: '8%',
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
                }
            );
            baseColumns.splice(9, 0,
                {
                    title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}>Xếp hạng hiện tại</span>,
                    dataIndex: 'rank',
                    // width: '8%',
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
                }
            );
        }
        return baseColumns;
    };

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
                    {/* <Table className="custom-table" columns={columns(props, props?.ww)} dataSource={data_sets} pagination={false} rowKey="index" /> */}
                    <Table
                        className="custom-table"
                        columns={columns(props, props?.ww)}
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
