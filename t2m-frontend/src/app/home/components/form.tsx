'use client'
import React, { useState } from 'react';
import { Button, Form, Input, Divider, Modal, notification } from 'antd';
import { signIn } from '@/utlis/signIn';
import { useAppDispatch } from '@/redux/store';
import { setAuthState } from '@/redux/authSlice';

const HomeForm = (props: any) => {

    const dispatch = useAppDispatch();

    const [form] = Form.useForm()

    const { isSignInModalOpen, setSignInModalOpen } = props
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
    const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false)

    const handleClose = () => {
        form.resetFields()
        setSignInModalOpen(false)
    }

    const onFinish = async () => {
        const loginData = await signIn(form)
        if (loginData) {
            dispatch(setAuthState(loginData))
            handleClose()
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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
                transition: background-color 5000s ease-in-out 0s;
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
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item style={{ display: 'flex', justifyContent: 'center', margin: '0px' }}>
                    <h1
                        style={{ fontSize: props.pixel(0.02, 20), color: '#dfdfdf' }}
                    >
                        Đăng ký nhận tư vấn
                    </h1>
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: props.pixel(0.014, 12), fontWeight: 'bold', color: '#dfdfdf' }}>Họ và tên</span>}
                    name="name"
                    rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
                    style={{ marginBottom: '20px', height: props.ww > 575 ? '75px' : 'auto' }}
                >
                    <Input size={props.ww > 767 ? 'large' : 'middle'} placeholder="Tôi có thể gọi bạn là...." />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: props.pixel(0.014, 12), fontWeight: 'bold', color: '#dfdfdf' }}>Email</span>}
                    name="name"
                    rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
                    style={{ marginBottom: '20px', height: props.ww > 575 ? '75px' : 'auto' }}
                >
                    <Input size={props.ww > 767 ? 'large' : 'middle'} placeholder="Email bạn thường dùng...." />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: props.pixel(0.014, 12), fontWeight: 'bold', color: '#dfdfdf' }}>Số điện thoại</span>}
                    name="name"
                    rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
                    style={{ marginBottom: '40px', height: props.ww > 575 ? '75px' : 'auto' }}
                >
                    <Input size={props.ww > 767 ? 'large' : 'middle'} placeholder="Số điện thoại bạn thường dùng...." />
                </Form.Item>

                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        size='large'
                        style={{
                            width: '200px',
                            height: '50px',
                            marginTop: '5px',
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
                    >
                        Đăng ký ngay
                    </Button>
                </Form.Item>


            </Form>
        </>
    )
}

export default HomeForm