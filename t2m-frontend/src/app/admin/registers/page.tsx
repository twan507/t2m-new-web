'use client'
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnType, TableProps } from 'antd';
import { Button, Input, Popconfirm, Space, Switch, Table, Tag, notification } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { sendRequest } from '@/utlis/api';

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import UpdateSaleModal from './components/updateSale.modal';


interface DataType {
    name: string;
    email: string;
    phoneNumber: string;
    note: string;
    level: number;
    description: string;
    createdAt: string;
}

type DataIndex = keyof DataType;

const PageRegisters: React.FC = () => {

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [updateSaleRecord, setUpdateSaleRecord] = useState()

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id
    const router = useRouter()

    useEffect(() => {
        if (!authState || authInfo.user.role !== "T2M ADMIN") {
            router.push("/admin");
        }
    }, [authState, router]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<any>(null);

    const [listUsers, setListUsers] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)


    const getData = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sales`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
        })
        try { setListUsers(res.data) } catch (error) { }
    }

    useEffect(() => {
        getData()
    }, [authState])

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                ?.toLowerCase()
                .includes((value as string)?.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: TableProps<any>['columns'] = [
        {
            title: 'Tên khách hàng',
            width: '11%',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Số điện thoại',
            width: '11%',
            dataIndex: 'phoneNumber',
            ...getColumnSearchProps('phoneNumber'),
        },
        {
            title: 'Ghi chú của khách',
            dataIndex: 'note',
            ...getColumnSearchProps('note'),
        },
        {
            title: 'Trạng thái',
            width: '10%',
            dataIndex: 'level',
            sorter: (a, b) => a.level - b.level,
            sortDirections: ['descend', 'ascend'],
            render: (value, record) => {
                const tagColor = value === 0 ? 'grey' : (
                    value === 1 ? 'red' : (
                        value === 2 ? 'green' : (
                            value === 3 ? 'blue' : (
                                value === 4 ? 'purple' : ''
                            ))))
                return (
                    <Tag color={tagColor}>
                        {value === 0 ? 'Chưa liên hệ' : (
                            value === 1 ? 'Không quan tâm' : (
                                value === 2 ? 'Ít quan tâm' : (
                                    value === 3 ? 'Rất quan tâm' : (
                                        value === 4 ? 'Đã mua hàng' : ''
                                    ))))}
                    </Tag>
                )
            }
        },
        {
            title: 'Lịch sử chăm sóc',
            dataIndex: 'description',
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Ngày tạo',
            width: '8%',
            dataIndex: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            sortDirections: ['descend', 'ascend'],
            render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
        },
        {
            title: 'Ngày sửa',
            width: '8%',
            dataIndex: 'updatedAt',
            sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
            sortDirections: ['descend', 'ascend'],
            render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
        },
        {
            title: 'Chỉnh sửa',
            align: 'center',
            width: '7%',
            render: (value, record) => {
                return (
                    <>
                        <Button shape="circle"
                            style={{ marginLeft: "5px" }}
                            icon={<EditOutlined />}
                            type={"primary"}
                            onClick={() => {
                                setIsUpdateModalOpen(true)
                                setUpdateSaleRecord(record)
                            }}
                        />
                    </>

                )
            }
        },
    ];
    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <>
                <style>
                    {`
          .custom-table .ant-table-thead > tr > th,
          .custom-table .ant-table-tbody > tr > td {
            padding: 15px;
          }
        `}
                </style>

                <UpdateSaleModal
                    getData={getData}
                    isUpdateModalOpen={isUpdateModalOpen}
                    setIsUpdateModalOpen={setIsUpdateModalOpen}
                    updateSaleRecord={updateSaleRecord}
                />

                <div>
                    <h1> Danh sách khách hàng</h1>
                </div>

                <Table
                    className="custom-table"
                    columns={columns}
                    dataSource={listUsers}
                    rowKey={"_id"}
                    pagination={{
                        current: current,
                        pageSize: pageSize,
                        total: listUsers?.length,
                        showSizeChanger: true, // Hiển thị bộ chọn số lượng hàng trên mỗi trang
                        pageSizeOptions: ['10', '20', '50', '100'], // Các lựa chọn số lượng hàng trên mỗi trang
                        onChange: (page, size) => {
                            setCurrent(page);
                            setPageSize(size);
                        },
                        onShowSizeChange: (current, size) => {
                            setPageSize(size);
                        },
                    }}
                />
            </>
        )
    }
}

export default PageRegisters;