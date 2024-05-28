'use client'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import '../styles.css';

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

const getColorTrend = (value: string) => {
    if (value === 'Tăng mạnh') return '#C031C7';
    if (value === 'Tăng') return '#24B75E';
    if (value === 'Trung lập') return '#D0be0f';
    if (value === 'Giảm') return '#e14040';
    if (value === 'Giảm mạnh') return '#00cccc';
};

const FilterStockTable = (props: any) => {

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

        return filterData
    };

    const data_sets = filterData(props?.data)
        ?.sort((a: any, b: any) => a.stock.localeCompare(b.stock))
        ?.map((item: any, stt: any) => ({ ...item, stt: stt + 1 }));

    const dt_columns = (props: any, ww: any): TableProps<any>['columns'] => {
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
                title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {ww > 768 ? 'Nhóm ngành' : 'Ngành'} </span>,
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

    const candle_columns = [
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
            title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {props?.ww > 768 ? 'Cổ phiếu' : 'Mã'} </span>,
            dataIndex: 'stock',
            width: '5%',
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
            title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {props?.ww > 768 ? 'Xu hướng Tháng' : 'Mã'} </span>,
            dataIndex: 'month_trend',
            width: '8%',
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
            title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {props?.ww > 768 ? 'Xu hướng Quý' : 'Mã'} </span>,
            dataIndex: 'quarter_trend',
            width: '8%',
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
            title: <span style={{ display: 'flex', justifyContent: 'flex-start', fontSize: parseInt(props?.fontSize) - 3 }}> {props?.ww > 768 ? 'Xu hướng Năm' : 'Mã'} </span>,
            dataIndex: 'year_trend',
            width: '8%',
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
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {'Month\nOpen'} </span>,
            dataIndex: `from_month_open`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_month_open);
                const bValue = parseFloat(b.from_month_open);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> {'Month\nLast High'} </span>,
            dataIndex: `from_month_last_high`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_month_last_high);
                const bValue = parseFloat(b.from_month_last_high);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Month Last Low </span>,
            dataIndex: `from_month_last_low`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_month_last_low);
                const bValue = parseFloat(b.from_month_last_low);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Quarter Open </span>,
            dataIndex: `from_quarter_open`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_quarter_open);
                const bValue = parseFloat(b.from_quarter_open);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Quarter Last High </span>,
            dataIndex: `from_quarter_last_high`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_quarter_last_high);
                const bValue = parseFloat(b.from_quarter_last_high);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Quarter Last Low </span>,
            dataIndex: `from_quarter_last_low`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_quarter_last_low);
                const bValue = parseFloat(b.from_quarter_last_low);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Year Open </span>,
            dataIndex: `from_year_open`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_year_open);
                const bValue = parseFloat(b.from_year_open);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Year Last High </span>,
            dataIndex: `from_year_last_high`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_year_last_high);
                const bValue = parseFloat(b.from_year_last_high);
                return bValue - aValue;
            }
        },
        {
            title: <span style={{ display: 'flex', justifyContent: 'flex-end', fontSize: parseInt(props?.fontSize) - 3 }}> Year Last Low </span>,
            dataIndex: `from_year_last_low`,
            className: 'left-sort',
            // width: '12%',
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
                const aValue = parseFloat(a.from_year_last_low);
                const bValue = parseFloat(b.from_year_last_low);
                return bValue - aValue;
            }
        },
    ];

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
                    <Table
                        style={{ padding: '0px 10px 10px 10px' }}
                        className="custom-table"
                        // columns={dt_columns(props, props?.ww)}
                        columns={candle_columns}
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
