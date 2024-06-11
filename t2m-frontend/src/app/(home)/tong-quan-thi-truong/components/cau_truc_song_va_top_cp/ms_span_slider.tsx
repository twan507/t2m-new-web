'use client'
import React, { useState } from 'react';
import type { InputNumberProps } from 'antd';
import { Col, InputNumber, Row, Slider, Space } from 'antd';

const IntegerStep = (props: any) => {
    const [inputValue, setInputValue] = useState(60);

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        setInputValue(newValue as number)
        props.set_ms_slice(newValue as number)
    };

    const formatter = (value?: number) => (value !== undefined ? `${value} Phiên` : '');
    const parser: any = (value?: string) => (value ? value.replace(' Phiên', '') : '');

    return (
        <Row>
            <Col span={20}>
                <Slider
                    min={20}
                    max={120}
                    onChange={onChange}
                    step={10}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                    tooltip={{ formatter }}
                />
            </Col>
            <Col span={4}>
                <InputNumber
                    min={20}
                    max={120}
                    step={10}
                    style={{ margin: '0 16px', width: '100px' }}
                    value={inputValue}
                    onChange={onChange}
                    formatter={formatter}
                    parser={parser}
                />
            </Col>
        </Row>
    );
};

const MsSpanSlider = (props: any) => (
    <Space style={{ width: '100%', marginTop: '20px' }} direction="vertical">
        <IntegerStep set_ms_slice={props.set_ms_slice} />
    </Space>
);

export default MsSpanSlider;