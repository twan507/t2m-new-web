'use client'
import React, { useRef, useState } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './styles.css'

interface OptionType {
    value: string;
}

const SearchComponent = () => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<any>(null);

    const allOptions: OptionType[] = [
        { value: 'AAPL' },
        { value: 'GOOGL' },
        { value: 'MSFT' },
        { value: 'AMZN' },
        { value: 'TSLA' },
    ];

    const onSearch = (searchText: string) => {
        setOptions(
            allOptions.filter((item) => item.value.toLowerCase().startsWith(searchText.toLowerCase()))
        );

        setInputValue(searchText);
        console.log(searchText);
    };

    const onPressEnter = () => {
        if (options.length > 0) {
            setInputValue(options[0].value);
            console.log('Selected:', options[0].value);
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
            onSelect={(value) => setInputValue(value)}
        >
            <Input
                placeholder="Nhập mã cổ phiếu"
                allowClear
                size="large"
                prefix={<SearchOutlined className="custom-search-icon" style={{marginRight: '7px' }} />}
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
