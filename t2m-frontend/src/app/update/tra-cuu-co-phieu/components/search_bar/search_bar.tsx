'use client'
import React, { useRef, useState } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchComponent = (props: any) => {
    const [options, setOptions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<any>(null);


    const allOptions = props?.data
        .map((obj: any) => ({ 
            value: obj.stock, 
            industry_name: obj.industry_name,
            industry_perform: obj.industry_perform,
            marketcap_group: obj.marketcap_group,
        }))
        .sort((a: any, b: any) => a.value.localeCompare(b.value));

    const onSearch = (searchText: string) => {
        setOptions(
            allOptions.filter((item: any) => item.value.toLowerCase().startsWith(searchText.toLowerCase()))
        );
        setInputValue(searchText);
    };

    const onPressEnter = () => {
        if (options.length > 0) {
            setInputValue(options[0].value);
            props.set_select_stock(options[0].value)
            props.set_select_industry(options[0].industry_name)
            props.set_select_perform(options[0].industry_perform)
            props.set_select_cap(options[0].marketcap_group)
            inputRef.current.blur();
        }
    };

    const onSelect = (value: string) => {
        setInputValue(value);
        props.set_select_stock(value)
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const onFocus = () => {
        setInputValue('');
        setOptions(allOptions); // Hiển thị tất cả gợi ý
    };

    return (
        <AutoComplete
            className="custom-search"
            options={options}
            onSearch={onSearch}
            style={{ width: '100%' }}
            value={inputValue}
            onSelect={onSelect}
        >
            <Input
                placeholder="Nhập mã cổ phiếu"
                allowClear
                size="large"
                prefix={<SearchOutlined className="custom-search-icon" style={{ marginRight: '7px' }} />}
                ref={inputRef}
                onPressEnter={onPressEnter}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={onFocus}
            />
        </AutoComplete>
    );
};

export default SearchComponent;
