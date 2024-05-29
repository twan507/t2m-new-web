'use client'
import React, { useState } from 'react';
import { Button, Select, Slider } from 'antd';
import './App.css';

const App: React.FC = () => {

  const [value, setValue] = useState([20, 50]); // Initial slider range
  const onSliderChange = (value: any) => {
    setValue(value);
    // You can also handle other logic here, such as updating data based on slider value
  };

  return (
    <div style={{ height: '300px', background: 'black' }}>
      <div style={{ width: 300, margin: '0 auto', padding: '50px 0', color: 'white' }}>
        <Slider
          range
          defaultValue={value}
          onChange={onSliderChange}
          min={0}
          max={100}
        />
        <div>
          Selected range: {value[0]} - {value[1]}
        </div>
      </div>
    </div>
  )
}


export default App;
