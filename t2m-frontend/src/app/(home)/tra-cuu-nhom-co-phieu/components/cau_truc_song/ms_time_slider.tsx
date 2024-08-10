'use client'
import React, { useEffect, useState } from 'react';
import type { InputNumberProps } from 'antd';
import { Col, InputNumber, Row, Slider, Space } from 'antd';

const IntegerStep = (props: any) => {
    const [inputValue, setInputValue] = useState(960);

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        setInputValue(newValue as number);
        props.set_ms_time_index(newValue as number);
    };

    useEffect(() => {
        if (inputValue < props?.slice) {
            setInputValue(props?.slice);
            props.set_ms_time_index(props?.slice);
        }
    }, [props?.slice])



    const data_sets = props?.data?.filter((item: any) => item.name === 'Thị trường')
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        ?.slice(props?.time_index - props?.slice, props?.time_index);

    const dateList: string[] = data_sets?.map((item: any) => {
        const date = new Date(item.date);
        const month = ('0' + (date.getMonth() + 1))?.slice(-2); // Lấy tháng và thêm số 0 nếu cần
        const day = ('0' + date.getDate())?.slice(-2); // Lấy ngày và thêm số 0 nếu cần
        const year = date.getFullYear(); // Lấy năm
        return `${day}/${month}/${year}`; // Trả về định dạng ngày-tháng-năm
    });

    const formatter = (value?: number) => `Ngày ${dateList[0]} - ${dateList[dateList.length - 1]}`;

    return (
        <Slider
            min={props?.slice}
            max={960}
            onChange={onChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
            tooltip={{ formatter }}
        />
    );
};

const MsTimeSlider = (props: any) => (
    <Space style={{ width: '100%' }} direction="vertical" >
        <IntegerStep set_ms_time_index={props.set_ms_time_index} slice={props?.slice} data={props?.data} time_index={props.time_index} />
    </Space>
);

export default MsTimeSlider;