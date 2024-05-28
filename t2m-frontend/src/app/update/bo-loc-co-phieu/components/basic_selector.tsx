'use client'
import React, { useState } from 'react';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import '../styles.css';

const BasicSelector = (props: any) => {
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const [placeholder, setPlaceholder] = useState<string | undefined>('All');

  let sortedData: any
  if (props?.sort === 'marketcap_group') {
    sortedData = props?.data?.sort((a: any, b: any) =>
      ['LARGECAP', 'MIDCAP', 'SMALLCAP', 'PENNY'].indexOf(a[props?.sort]) -
      ['LARGECAP', 'MIDCAP', 'SMALLCAP', 'PENNY'].indexOf(b[props?.sort])
    )
  } else {
    sortedData = props?.data?.sort((a: any, b: any) => a[props?.sort].localeCompare(b[props?.sort]));
  }

  const uniqueOptions = Array.from(new Set(sortedData?.map((obj: any) => obj[props?.name])));
  const options = uniqueOptions?.map((value: any) => ({
    value: value,
    label: value
  }));

  const handleChange = (value: any) => {
    if (value.length === 0 || value.includes('all')) {
      setSelectedValues([]);
      props?.filter([]);
      setPlaceholder('All');
    } else {
      setSelectedValues(value);
      props?.filter(value);
      setPlaceholder(undefined);
    }
  };

  const handleFocus = () => {
    setPlaceholder(undefined);
  };

  const handleBlur = () => {
    if (selectedValues.length === 0) {
      setPlaceholder('All');
    }
  };

  return (
    <Select
      className='custom-select'
      mode="multiple"
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={selectedValues}
      filterOption={(input, option: any) =>
        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      style={{ width: '100%', color: '#dfdfdf', fontSize: parseInt(props?.fontSize) - 4 }}
    >
      <Option value="all">Chọn tất cả</Option>
      {options.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  )
}

export default BasicSelector;
