'use client'
import React, { useState } from 'react';
import { Button, Col, Row, Select, Slider, Statistic } from 'antd';
import '../styles.css';

const TaSlider = (props: any) => {

    const [value, setValue] = useState([-0.1, 0.1]);
    const [disable, setDisable] = useState(true);
    const onSliderChange = (value: any) => {
        setValue(value);
    };

    const formatter: any = (value: number) => `${(value * 100).toFixed(2)}%`;

    return (
        <Row gutter={25} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <Col xs={6} sm={5} md={4} lg={3} xl={2} style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{
                    fontSize: props?.fontSize,
                    fontFamily: 'Calibri, sans-serif',
                    color: 'white',
                    width: '100%',
                    fontWeight: 'bold',
                    margin: '0px',
                    padding: '0px 3px',
                    borderRadius: '5px',
                    background: value[0] > 0.0001 ? '#24B75E' :
                        (value[0] >= -0.0001 &&
                            value[0] <= 0.0001 ? '#D0be0f' : '#e14040'),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {(value[0] * 100).toFixed(2)}%
                </p>
            </Col>
            <Col xs={12} sm={14} md={16} lg={18} xl={20} style={{ display: 'flex', justifyContent: 'center' }}>
                <Slider
                    range
                    value={value}
                    onChange={onSliderChange}
                    min={-0.1}
                    max={0.1}
                    step={0.001}
                    tipFormatter={formatter}
                    style={{ width: '100%' }}
                />
            </Col>
            <Col xs={6} sm={5} md={4} lg={3} xl={2} style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{
                    fontSize: props?.fontSize,
                    fontFamily: 'Calibri, sans-serif',
                    color: 'white',
                    width: '100%',
                    fontWeight: 'bold',
                    margin: '0px',
                    padding: '0px 3px',
                    borderRadius: '5px',
                    background: value[1] > 0.0001 ? '#24B75E' :
                        (value[1] >= -0.0001 &&
                            value[1] <= 0.0001 ? '#D0be0f' : '#e14040'),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {(value[1] * 100).toFixed(2)}%
                </p>
            </Col>
        </Row>
    )
}

export default TaSlider;
