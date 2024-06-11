'use client'
import React, { useState } from 'react';
import { Button, Col, Row, Slider, SliderSingleProps } from 'antd';
import '../styles.css';

const TaSlider = (props: any) => {

  const [value, setValue] = useState([-0.1, 0.1]);
  const onSliderChange = (value: any) => {
    setValue(value);
    props?.set_filter_slider_value(value);
  };

  function getGradientColor(percentage: number) {
    const startColor = [225, 64, 64]; // Red
    const midColor = [208, 190, 15]; // Yellow
    const endColor = [36, 183, 94]; // Green

    let color;

    if (percentage <= 0.5) {
      // Interpolate between startColor and midColor
      const adjustedPercentage = percentage * 2; // Scale percentage to [0, 1] for this range
      color = startColor.map((start, i) => {
        const mid = midColor[i];
        const delta = mid - start;
        return (start + delta * adjustedPercentage).toFixed(0);
      });
    } else {
      // Interpolate between midColor and endColor
      const adjustedPercentage = (percentage - 0.5) * 2; // Scale percentage to [0, 1] for this range
      color = midColor.map((mid, i) => {
        const end = endColor[i];
        const delta = end - mid;
        return (mid + delta * adjustedPercentage).toFixed(0);
      });
    }

    return `rgb(${color.join(',')})`;
  }

  const formatter: any = (value: number) => `${(value * 100).toFixed(2)}%`;

  const marks: SliderSingleProps['marks'] = {
    0: { style: { color: '#D0be0f', fontSize: props?.fontSize }, label: <strong>0%</strong> },
  };

  const start = value[0];
  const end = value[value.length - 1];
  const gradient = `linear-gradient(to right, ${getGradientColor((start + 0.1) / 0.2)} 0%, ${getGradientColor((end + 0.1) / 0.2)} 100%)`;

  const startPercentage = (value[0] + 0.1) / 0.2;
  const endPercentage = (value[1] + 0.1) / 0.2;

  const startColor = getGradientColor(startPercentage);
  const endColor = getGradientColor(endPercentage);

  return (
    <Row gutter={25} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
      <Col xs={6} sm={5} md={4} lg={3} xl={2} style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={{
          fontSize: props?.fontSize,
          fontFamily: 'Calibri, sans-serif',
          color: 'white',
          width: '100%',
          height: '60%',
          fontWeight: 'bold',
          margin: '2px 0px 0px 0px',
          padding: '0px 3px',
          borderRadius: '5px',
          background: startColor,
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
          marks={marks}
          trackStyle={[{ background: gradient }]}
        />
      </Col>
      <Col xs={6} sm={5} md={4} lg={3} xl={2} style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={{
          fontSize: props?.fontSize,
          fontFamily: 'Calibri, sans-serif',
          color: 'white',
          width: '100%',
          height: '60%',
          fontWeight: 'bold',
          margin: '2px 0px 0px 0px',
          padding: '0px 3px',
          borderRadius: '5px',
          background: endColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {(value[1] * 100).toFixed(2)}%
        </p>
      </Col>
    </Row>
  );
}

export default TaSlider;
