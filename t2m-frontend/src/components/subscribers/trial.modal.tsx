'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Button } from 'antd';
import { FormInstance, RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';

interface IProps {
    isTrialModalOpen: boolean
    setIsTrialModalOpen: (v: boolean) => void
}

const TrialModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id
    const [form] = Form.useForm()

    const { isTrialModalOpen, setIsTrialModalOpen } = props

    useEffect(() => {
        if (authState) {
            form.setFieldsValue({
                email: authInfo.user.email,
            })
        }
    }, [authState])

    //Hàm kiểm tra email
    const validateEmail = async (_: RuleObject, value: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (value && !emailRegex.test(value)) {
            throw new Error('Email không đúng định dạng.');
        }
    };

    useEffect(() => {
        if (authState) {
            form.setFieldsValue({
                email: authInfo?.user?.email,
            })
        }
    }, [isTrialModalOpen, authState])


    const handleClose = () => {
        form.resetFields()
        setIsTrialModalOpen(false)
    }

    const onFinish = async (values: any) => {
        const { email, token } = values
        const data = { email, token }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/get-trial`,
            method: "POST",
            body: data
        })

        if (res.statusCode === 201) {
            const data = { userEmail: email, product: "TRIAL", discountPercent: 0, finalPrice: 0 }
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses`,
                method: "POST",
                headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
                body: data
            })

            if (res.data) {
                notification.success({
                    message: `Đăng ký dùng thử thành công`,
                    description: 'Đăng xuất khỏi tài khoản sau đó đăng nhập lại để sử dụng đầy đủ các tính năng'
                })
                handleClose()
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message
                })
            }
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    const onSendToken = async () => {
        if (!form.getFieldValue('email')) {
            return notification.error({
                message: "Có lỗi xảy ra",
                description: `Email không tồn tại`
            })
        }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/send-trial-token`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: { email: form.getFieldValue('email') }
        })

        if (res.data) {
            notification.success({
                message: `Gửi mã thành công`
            })
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    const [submitLoadings, setSubmitLoadings] = useState<boolean[]>([]);
    const [sendLoadings, setSendLoadings] = useState<boolean[]>([]);

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
        }, 3000);
    };

    const enterSendLoading = (index: number) => {
        setSendLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setSendLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 3000);
    };

    return (
        <>
            <style>
                {`
      .custom-modal .ant-modal-content {
        background-color: transparent !important;
        box-shadow: none !important;
      }
      .custom-modal .ant-modal-header,
      .custom-modal .ant-modal-body,
      .custom-modal .ant-modal-footer {
        background-color: transparent !important;
      }
      .custom-modal .ant-modal-wrap {
        background-color: transparent !important;
      }

      .custom-modal .ant-input {
        background-color: #333333;
        border: 0px;
        color: #dfdfdf;
      }

      .custom-modal .ant-input-password input {
        background-color: #333333;
        color: #dfdfdf
      }

      .custom-modal .ant-input-password {
        background-color: #333333;
        border: 0px;
      }

      .custom-modal .ant-input::placeholder {
        color: #666666;
      }

      .custom-modal .ant-input-password input::placeholder {
        color: #666666;
      }
      .custom-modal .ant-input-password-icon {
        color: #999999 !important;
      }          

      .custom-modal .ant-input-password-icon:hover {
        color: #dfdfdf !important;
      }

    `}
            </style>
            <Modal
                className="custom-modal"
                open={isTrialModalOpen}
                onOk={() => form.submit()}
                onCancel={handleClose}
                footer={null}
                closeIcon={null}
            >
                <Form
                    form={form}
                    layout='vertical'
                    style={{
                        maxWidth: '500px',
                        width: '100%',
                        padding: '10px 30px 10px 30px',
                        boxSizing: 'border-box', // Đảm bảo padding và border không làm tăng kích thước tổng thể của Form
                        backgroundColor: '#191919',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px 0 black' /* Đổ bóng với độ sâu 2px và màu đen có độ trong suốt 10% */
                    }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"

                >
                    {/* Dummy fields */}
                    <div style={{ display: 'none' }}>
                        <Input name="username" type="text" autoComplete="username" />
                        <Input name="pass" type="password" autoComplete="current-password" />
                    </div>

                    <Form.Item style={{ display: 'flex', justifyContent: 'left', marginBottom: '10px' }}>
                        <h1
                            style={{ fontSize: 20, color: '#dfdfdf' }}
                        >
                            Đăng ký dùng thử T2M Invest
                        </h1>
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "20px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { validator: validateEmail }
                        ]}
                    >
                        <Input placeholder="Nhập Email của bạn" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "20px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Mã xác thực</span>}
                        name="token"
                        rules={[
                            { required: true, message: 'Mã xác thực không được để trống!' },
                        ]}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Input placeholder="Mã xác thực được gửi qua Email" style={{ width: '70%' }} />
                            <Button
                                type='dashed' ghost
                                style={{ fontSize: 16, marginRight: '5px' }}
                                loading={sendLoadings[0]}
                                onClick={() => {
                                    onSendToken()
                                    enterSendLoading(0)
                                }}
                            >
                                Gửi mã
                            </Button>
                        </div>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '0px', marginTop: '30px' }}>
                        <Button type="primary"
                            onClick={() => {
                                form.submit()
                                enterSubmitLoading(0)
                            }}
                            block loading={submitLoadings[0]}
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 16,
                                marginBottom: '20px'
                            }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Modal >
        </>
    )
}

export default TrialModal