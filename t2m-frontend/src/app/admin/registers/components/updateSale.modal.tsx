'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button, InputNumber } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';
const { Option } = Select;

interface IProps {
    getData: any
    isUpdateModalOpen: boolean
    setIsUpdateModalOpen: (v: boolean) => void
    updateSaleRecord: any
}

const UpdateSaleModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { getData, isUpdateModalOpen, setIsUpdateModalOpen, updateSaleRecord } = props

    const onFinish = async (values: any) => {
        const { level, description } = values
        const data = { level, description }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sales/${updateSaleRecord._id}`,
            method: "PATCH",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: data
        })

        if (res.data) {
            await getData()
            notification.destroy();
            notification.success({
                message: "Cập nhật thông tin thành công"
            })
            handleClose()
        } else {
            notification.destroy();
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    };

    const [form] = Form.useForm()

    useEffect(() => {
        if (updateSaleRecord) {
            form.setFieldsValue({
                level: updateSaleRecord.level,
                description: updateSaleRecord.description,
            })
        }
    }, [isUpdateModalOpen])

    const handleClose = () => {
        form.resetFields()
        setIsUpdateModalOpen(false)
    }

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <Modal
                title="Chỉnh sản phẩm"
                open={isUpdateModalOpen}
                onOk={() => form.submit()}
                onCancel={handleClose}
                maskClosable={false}>

                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    {/* Dummy fields */}
                    <div style={{ display: 'none' }}>
                        <Input name="username" type="text" autoComplete="username" />
                        <Input name="password" type="password" autoComplete="current-password" />
                    </div>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Mức độ quan tâm"
                        name="level"
                        rules={[{ required: true, message: 'Access Level không được để trống!' }]}>
                        <Select
                            placeholder="Chọn mức độ quan tâm của khách hàng"
                        >
                            <Option value={0}>Chưa liên hệ</Option>
                            <Option value={1}>Không quan tâm</Option>
                            <Option value={2}>Ít quan tâm</Option>
                            <Option value={3}>Rất quan tâm</Option>
                            <Option value={4}>Đã mua hàng</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Lịch sử chăm sóc"
                        name="description"
                    >
                        <Input placeholder="Nhập lịch sử chăm sóc khách hàng" />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default UpdateSaleModal