'use client'
import React, { useState } from 'react';
import { Button, Form, Input, Divider, Modal, notification } from 'antd';
import { signIn } from '@/utlis/signIn';
import { useAppDispatch } from '@/redux/store';
import { setAuthState } from '@/redux/authSlice';
import { sendRequest } from '@/utlis/api';
import { RuleObject } from 'antd/es/form';

const HomeForm = (props: any) => {

    const [form] = Form.useForm()

    const validateEmail = async (_: RuleObject, value: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (value && !emailRegex.test(value)) {
            throw new Error('Email không đúng định dạng.');
        }
    };

    //Hàm kiểm tra số điện thoại
    const validatePhoneNumber = async (_: RuleObject, value: string): Promise<void> => {
        const phoneRegex = /^0\d{9}$/;
        if (!value || phoneRegex.test(value)) {
            return;
        }
        throw new Error('Số điện thoại không đúng.');
    };

    const onFinish = async (values: any) => {
        const { name, email, phoneNumber, note } = values
        const data = { name, email, phoneNumber, note }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sales`,
            method: "POST",
            body: data
        })

        if (res.data) {
            notification.destroy();
            notification.success({
                message: `Đăng ký thông tin thành công`
            })
            form.resetFields()
        } else {
            notification.destroy();
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    const [submitLoadings, setSubmitLoadings] = useState<boolean[]>([]);

    const enterSubmitLoading = (index: number) => {
        setSubmitLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setSubmitLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 5000);
    };

    return (
        <>
            <style>
                {`

            .ant-input:-webkit-autofill,
            .ant-input:-webkit-autofill:hover, 
            .ant-input:-webkit-autofill:focus, 
            .ant-input:-webkit-autofill:active{
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: #dfdfdf !important;
                -webkit-box-shadow: 0 0 0 30px #333333 inset !important;
                transition: background-color 60000s ease-in-out 0s;
            }

          .custom-form .ant-modal-content {
            background-color: transparent !important;
            box-shadow: none !important;
          }
          .custom-form .ant-modal-header,
          .custom-form .ant-modal-body,
          .custom-form .ant-modal-footer {
            background-color: transparent !important;
          }
          .custom-form .ant-modal-wrap {
            background-color: transparent !important;
          }

          .custom-form .ant-input-password input {
            background-color: #333333;
            color: #dfdfdf
          }

          .custom-form .ant-input-password {
            background-color: #333333;
            border: 0px;
          }
          
          .custom-form .ant-input::placeholder {
            color: #666666;
          }

          .custom-form .ant-input-password input::placeholder {
            color: #666666;
          }

          .custom-form .ant-input-password-icon {
            color: #999999 !important;
          }          

          .custom-form .ant-input-password-icon:hover {
            color: #dfdfdf !important;
          }

        `}
            </style>
            <Form
                form={form}
                className='custom-form'
                layout='vertical'
                style={{
                    width: '100%', height: '430px',
                    padding: '10px 30px 10px 30px',
                    boxSizing: 'border-box',
                }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item style={{ display: 'flex', justifyContent: 'center', margin: props.ww > 767 ? '-20px 0px 0px 0px' : '0px' }}>
                    <h1
                        style={{ fontSize: props.pixel(0.02, 20), color: '#dfdfdf' }}
                    >
                        Đăng ký nhận tư vấn
                    </h1>
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: props.pixel(0.012, 13), fontWeight: 'bold', color: '#dfdfdf' }}>Họ và tên</span>}
                    name="name"
                    rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
                    style={{ marginBottom: '20px', marginTop: props.ww > 767 ? '-10px' : '0px' }}
                >
                    <Input placeholder="Tôi có thể gọi bạn là...." />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: props.pixel(0.012, 13), fontWeight: 'bold', color: '#dfdfdf' }}>Email</span>}
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được để trống!' },
                        { validator: validateEmail }
                    ]}
                    style={{ marginBottom: '20px' }}
                >
                    <Input placeholder="Email bạn thường dùng...." />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: props.pixel(0.012, 13), fontWeight: 'bold', color: '#dfdfdf' }}>Số điện thoại</span>}
                    name="phoneNumber"
                    rules={[
                        { required: true, message: 'Số điện thoại không được để trống!' },
                        { validator: validatePhoneNumber }
                    ]}
                    style={{ marginBottom: '20px' }}
                >
                    <Input placeholder="Số điện thoại bạn thường dùng...." />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: props.pixel(0.012, 13), fontWeight: 'bold', color: '#dfdfdf' }}>Ghi chú</span>}
                    name="note"
                    style={{ marginBottom: props.ww > 767 ? '30px' : '30px' }}
                >
                    <Input.TextArea

                        style={{ height: '55px' }}
                        placeholder={"Nhập ghi chú của bạn nếu có:\n(thời gian tư vấn, câu hỏi cụ thể v.v.)"}
                    />
                </Form.Item>

                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        size='large'
                        style={{
                            width: '200px',
                            height: '40px',
                            background: 'linear-gradient(45deg, #C031C7, #9C1AB1)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: props.pixel(0.015, 15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s ease, box-shadow 0.3s ease',
                            boxShadow: '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(45deg, #9C1AB1, #C031C7)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(192, 49, 199, 0.8), 0 0 40px rgba(192, 49, 199, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(45deg, #C031C7, #9C1AB1)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)';
                        }}
                        onClick={() => {
                            form.submit()
                            enterSubmitLoading(0)
                        }}
                        loading={submitLoadings[0]}
                    >
                        Đăng ký ngay
                    </Button>
                </Form.Item>


            </Form>
        </>
    )
}

export default HomeForm