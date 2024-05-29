'use client'
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import '../styles.css';

const TaSelector = (props: any) => {
  const [placeholder, setPlaceholder] = useState<string | undefined>('Chọn chỉ số kĩ thuật');

  let options: any
  if (props?.name === 'filter_candle') {
    options = [
      { value: 'from_month_open', label: 'M Open' },
      { value: 'from_month_last_high', label: 'M Last High' },
      { value: 'from_month_last_low', label: 'M Last Low' },
      { value: 'from_quarter_open', label: 'Q Open' },
      { value: 'from_quarter_last_high', label: 'Q Last High' },
      { value: 'from_quarter_last_low', label: 'Q Last Low' },
      { value: 'from_year_open', label: 'Y Open' },
      { value: 'from_year_last_high', label: 'Y Last High' },
      { value: 'from_year_last_low', label: 'Y Last Low' },
    ];
  } else if (props?.name === 'filter_ma_pivot') {
    options = [
      { value: 'from_month_ma5', label: 'MA5' },
      { value: 'from_month_ma20', label: 'MA20' },
      { value: 'from_quarter_ma60', label: 'MA60' },
      { value: 'from_quarter_ma120', label: 'MA120' },
      { value: 'from_year_ma240', label: 'MA240' },
      { value: 'from_year_ma480', label: 'MA480' },
      { value: 'from_month_pivot', label: 'M Pivot' },
      { value: 'from_quarter_pivot', label: 'Q Pivot' },
      { value: 'from_year_pivot', label: 'Y Pivot' },
    ];
  } else if (props?.name === 'filter_fibo') {
    options = [
      { value: 'from_month_fibo_382', label: 'M Fibo 0.382' },
      { value: 'from_month_fibo_500', label: 'M Fibo 0.500' },
      { value: 'from_month_fibo_618', label: 'M Fibo 0.618' },
      { value: 'from_quarter_fibo_382', label: 'Q Fibo 0.382' },
      { value: 'from_quarter_fibo_500', label: 'Q Fibo 0.500' },
      { value: 'from_quarter_fibo_618', label: 'Q Fibo 0.618' },
      { value: 'from_year_fibo_382', label: 'Y Fibo 0.382' },
      { value: 'from_year_fibo_500', label: 'Y Fibo 0.500' },
      { value: 'from_year_fibo_618', label: 'Y Fibo 0.618' },
    ];
  }


  const handleChange = (value: any) => {
    if (value.length === 0 || value.includes('all')) {
      props?.filter([]);
      setPlaceholder('Chọn chỉ số kĩ thuật');
    } else {
      props?.filter(value);
      setPlaceholder(undefined);
    }
  };

  const handleFocus = () => {
    setPlaceholder(undefined);
  };

  const handleBlur = () => {
    if (props?.filter_value.length === 0) {
      setPlaceholder('Chọn chỉ số kĩ thuật');
    }
  };

  useEffect(() => {
    if (props?.filter_value?.length === 0) {
      setPlaceholder('Chọn chỉ số kĩ thuật');
    }
  }, [props?.filter_value]);

  return (
    <Select
      className='ta-select'
      mode="multiple"
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={props?.filter_value}
      filterOption={(input, option: any) =>
        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      style={{ width: '100%', color: '#dfdfdf' }}
    >
      <Select.Option value="all">Bỏ chọn tất cả</Select.Option>
      {options.map((option: any) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default TaSelector;
