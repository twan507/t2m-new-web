'use client'
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import '../../styles.css';

const IndustrySelector = (props: any) => {
  const [placeholder, setPlaceholder] = useState<string | undefined>('All');

  const sortedData = props?.data?.sort((a: any, b: any) => a[props?.sort]?.localeCompare(b[props?.sort]));

  const uniqueOptions = Array.from(new Set(sortedData?.map((obj: any) => obj[props?.name])));
  const options = uniqueOptions?.map((value: any) => ({
    value: value,
    label: value
  }));

  const handleChange = (value: any) => {
    if (value?.length === 0 || value.includes('all')) {
      props?.filter([]);
      setPlaceholder(props.placeholder);
    } else {
      props?.filter(value);
      setPlaceholder(undefined);
    }
  };

  const handleFocus = () => {
    setPlaceholder(undefined);
  };

  const handleBlur = () => {
    if (props?.filter_value?.length === 0) {
      setPlaceholder(props.placeholder);
    }
  };

  useEffect(() => {
    if (props?.filter_value?.length === 0) {
      setPlaceholder(props.placeholder);
    }
  }, [props?.filter_value]);

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
      value={props?.filter_value}
      filterOption={(input, option: any) =>
        option?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
      }
      style={{ width: '99.9%', color: '#dfdfdf', marginBottom: '15px', fontSize: parseInt(props?.fontSize) }}
    >
      <Select.Option value="all">Chọn tất cả</Select.Option>
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default IndustrySelector;
