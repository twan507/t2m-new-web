'use client'
import React, { useState } from 'react';
import { Button, Select, Slider } from 'antd';
import './App.css';
import { Option } from 'antd/es/mentions';
import { CloseOutlined } from '@ant-design/icons';

const onChange = (value: string) => {
    console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
    console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const App: React.FC = () => {

    const [selectedValues, setSelectedValues] = useState<any[]>([]);

    const options = [
        {
            value: 'jack',
            label: 'Jack',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'tom',
            label: 'Tom',
        },
    ];

    const handleChange = (value: any) => {
        if (value.includes('all')) {
            setSelectedValues(options.map((option: any) => option.value));
        } else {
            setSelectedValues(value);
        }
    };

    const handleDeselectAll = () => {
        setSelectedValues([]);
    };


    const [value, setValue] = useState([20, 50]); // Initial slider range
    const onSliderChange = (value: any) => {
        setValue(value);
        // You can also handle other logic here, such as updating data based on slider value
    };

    return (
        <>
            <div style={{ height: '300px', background: 'black' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                        className='custom-select'
                        mode="multiple"
                        showSearch
                        placeholder="All"
                        optionFilterProp="children"
                        onChange={handleChange}
                        value={selectedValues}
                        filterOption={(input, option: any) =>
                            option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '200px', color: 'white' }}
                    >
                        <Option value="all">Tất cả</Option>
                        {options.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                    <Button size='small' className='custom-button' onClick={handleDeselectAll} style={{ marginLeft: '5px' }} icon={<CloseOutlined />} />
                </div>
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
        </>

    )
}


export default App;
