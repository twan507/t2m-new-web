'use client'
import React, { useEffect, useState } from 'react';
import type { InputNumberProps } from 'antd';
import { Col, InputNumber, Row, Slider, Space } from 'antd';

const IntegerStep = (props: any) => {
    const [inputValue, setInputValue] = useState(props.ww > 767 ? 60 : (props.ww > 500 ? 40 : 20));

    useEffect(() => {
        setInputValue(props.ww > 767 ? 60 : (props.ww > 500 ? 40 : 20))
    }, [])

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        setInputValue(newValue as number)
        props.set_ms_slice(newValue as number)
    };

    const formatter = (value?: number) => (value !== undefined ? `${value} Phiên` : '');
    const parser: any = (value?: string) => (value ? value.replace(' Phiên', '') : '');
    // .centered-input-number .ant-input-number-input {
    //     text-align: center;
    // }
    return (
        <>
            <style>
                {`
    .centered-input-number .ant-input-number-input {
        text-align: center;
    }

    `}
            </style>
            <Row>
                {props?.ww < 767 && (
                    <Col span={props?.ww > 767 ? 0 : 1}></Col>
                )}
                <Col xs={17} sm={18} md={17} lg={18} xl={19}>
                    <Slider
                        min={20}
                        max={120}
                        onChange={onChange}
                        step={10}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        tooltip={{ formatter }}
                    />
                </Col>
                <Col xs={6} sm={5} md={7} lg={6} xl={5} style={{ padding: props?.ww > 767 ? '0px 10px' : '0px 0px 0px 10px' }}>
                    <InputNumber
                        min={20}
                        max={120}
                        step={10}
                        className="centered-input-number"
                        style={{ margin: 0, width: '100%' }}
                        value={inputValue}
                        onChange={onChange}
                        formatter={formatter}
                        parser={parser}
                        disabled={props?.ww > 767 ? false : true}
                    />
                </Col>
            </Row >
        </>

    );
};

const MsSpanSlider = (props: any) => (
    <Space style={{ width: '100%', marginTop: '20px' }} direction="vertical">
        <IntegerStep set_ms_slice={props.set_ms_slice} ww={props.ww} />
    </Space>
);

export default MsSpanSlider;