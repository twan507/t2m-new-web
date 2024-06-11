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

    return (
        <Row>
            <Col span={props?.ww > 767 ? 0 : 1}></Col>
            <Col span={props?.ww > 767 ? 20 : 17}>
                <Slider
                    min={20}
                    max={120}
                    onChange={onChange}
                    step={10}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                    tooltip={{ formatter }}
                />
            </Col>
            <Col span={props?.ww > 767 ? 4 : 5} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <InputNumber
                    min={20}
                    max={120}
                    step={10}
                    style={{ margin: props?.ww > 767 ? '0 18px' : '0px -17px 0px 0px', width: props?.ww > 767 ? '100px' : '78px' }}
                    value={inputValue}
                    onChange={onChange}
                    formatter={formatter}
                    parser={parser}
                    disabled={true}
                />
            </Col>
        </Row>
    );
};

const MsSpanSlider = (props: any) => (
    <Space style={{ width: '100%', marginTop: '20px' }} direction="vertical">
        <IntegerStep set_ms_slice={props.set_ms_slice} ww={props.ww} />
    </Space>
);

export default MsSpanSlider;