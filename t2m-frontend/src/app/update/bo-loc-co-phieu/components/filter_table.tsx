'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../styles.css'; // Import CSS file for custom styles

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

const getColorIndustryPerform = (value: string) => {
    if (value === 'Hiệu suất A') return '#24B75E';
    if (value === 'Hiệu suất B') return '#025bc4';
    if (value === 'Hiệu suất C') return '#D0be0f';
    if (value === 'Hiệu suất D') return '#e14040';
};

const getColorMarketCap = (value: string) => {
    if (value === 'LARGECAP') return '#24B75E';
    if (value === 'MIDCAP') return '#025bc4';
    if (value === 'SMALLCAP') return '#D0be0f';
    if (value === 'PENNY') return '#e14040';
};

const FilterStockTable = (props: any) => {



    const data_sets = props?.data?.sort((a: any, b: any) => a.stock.localeCompare(b.stock)).map((item: any, stt: number) => ({ ...item, stt: stt + 1 }));

    const columns = (props: any, ww: any): TableProps<any>['columns'] => {
        const baseColumns = [
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> # </span>,
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3, whiteSpace: 'pre-line' }}>{ww > 768 ? 'Nhóm\nhiệu suất' : 'Hiệu suất'} </span>,
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
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Hiệu suất cổ phiếu' : 'HS CP'} </span>,
                dataIndex: 'stock_perform',
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> % thay đổi </span>,
                dataIndex: `price_change`,
                className: 'left-sort',
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
                sorter: (a: any, b: any) => {
                    const aValue = parseFloat(a.price_change);
                    const bValue = parseFloat(b.price_change);
                    return bValue - aValue;
                }
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Dòng tiền trong phiên' : 'Dòng tiền'} </span>,
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Chỉ số thanh khoản' : 'Thanh khoản'} </span>,
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
                    }}>{`${(value * 100).toFixed(2)}%`}</span>
                ),
                sorter: (a: any, b: any) => {
                    const aValue = parseFloat(a.liquid_ratio);
                    const bValue = parseFloat(b.liquid_ratio);
                    return bValue - aValue;
                }
            },
            {
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Lọt top 10%' : 'Thanh khoản'} </span>,
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'T2M Select' : 'T2M Select'} </span>,
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
        ];

        if (ww >= 768) {
            baseColumns.splice(6, 0,
                {
                    title: <span style={{ display: 'flex', justifyContent: 'center', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Giá \n hiện tại' : 'Giá'} </span>,
                    dataIndex: 'close',
                    className: 'left-sort',
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
                    sorter: (a: any, b: any) => {
                        const aValue = parseFloat(a.close);
                        const bValue = parseFloat(b.close);
                        return bValue - aValue;
                    }
                }
            );
            baseColumns.splice(7, 0,
                {
                    title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Dòng tiền trong tuần </span>,
                    dataIndex: 't5_score',
                    className: 'left-sort',
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
                    sorter: (a: any, b: any) => {
                        const aValue = parseFloat(a.t5_score);
                        const bValue = parseFloat(b.t5_score);
                        return bValue - aValue;
                    }
                }
            );
            baseColumns.splice(9, 0,
                {
                    title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}>Xếp hạng hiện tại</span>,
                    dataIndex: 'rank',
                    className: 'left-sort',
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
                    sorter: (a: any, b: any) => {
                        const aValue = parseFloat(a.rank);
                        const bValue = parseFloat(b.rank);
                        return aValue - bValue;
                    }
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
