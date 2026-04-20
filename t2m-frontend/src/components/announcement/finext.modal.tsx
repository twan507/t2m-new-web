'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Modal, Image } from 'antd';
import {
    ArrowRightOutlined,
    CloseOutlined,
    CalendarOutlined,
    CrownOutlined,
} from '@ant-design/icons';

const FINEXT_URL = 'https://finext.vn';
const CONTACT_ADMIN_URL = 'https://zalo.me/0988888156';
const TRIGGER_PATH = '/tong-quan-thi-truong';
const SHOW_DELAY_MS = 1500;

const glassCardDark = {
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: [
        '0 8px 32px rgba(0, 0, 0, 0.3)',
        'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'inset 0 -1px 0 rgba(255, 255, 255, 0.05)',
    ].join(', '),
};

const calloutBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 14px',
    borderRadius: 10,
};

const FinextAnnouncementModal = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== TRIGGER_PATH) {
            setOpen(false);
            return;
        }

        const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
        return () => clearTimeout(timer);
    }, [pathname]);

    const dismiss = () => {
        setOpen(false);
    };

    const handleCTA = () => {
        window.open(FINEXT_URL, '_blank', 'noopener,noreferrer');
        dismiss();
    };

    const handleSecondaryCTA = () => {
        window.open(CONTACT_ADMIN_URL, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <style>
                {`
          .finext-announcement-modal .ant-modal-content {
            background-color: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .finext-announcement-modal .ant-modal-body {
            padding: 0 !important;
          }
          .finext-secondary-link {
            background: transparent !important;
            border: none !important;
            color: #a0a0a0 !important;
            font-size: 13px !important;
            text-decoration: underline;
            text-underline-offset: 3px;
            padding: 0 !important;
            height: auto !important;
          }
          .finext-secondary-link:hover {
            color: #dfdfdf !important;
          }
        `}
            </style>
            <Modal
                className="finext-announcement-modal"
                open={open}
                onCancel={dismiss}
                footer={null}
                closeIcon={null}
                centered
                width={520}
                maskClosable={true}
            >
                <div
                    style={{
                        position: 'relative',
                        ...glassCardDark,
                        borderRadius: 16,
                        padding: '32px 32px 24px 32px',
                        color: '#e5e5e5',
                        boxSizing: 'border-box',
                    }}
                >
                    <Button
                        type="text"
                        onClick={dismiss}
                        icon={<CloseOutlined style={{ color: '#a0a0a0', fontSize: 16 }} />}
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                        }}
                        aria-label="Đóng"
                    />

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 18,
                            marginBottom: 22,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Image
                            src="/photo/header-logo.png"
                            alt="T2M Invest"
                            preview={false}
                            height={38}
                            style={{ objectFit: 'contain' }}
                        />
                        <ArrowRightOutlined style={{ color: '#888', fontSize: 20 }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                                style={{
                                    display: 'inline-block',
                                    transform: 'translateY(-1px)',
                                    lineHeight: 0,
                                }}
                            >
                                <Image
                                    src="/finext/finext-icon-trans.png"
                                    alt="Finext"
                                    preview={false}
                                    height={38}
                                    style={{
                                        display: 'block',
                                        height: 38,
                                        width: 'auto',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    letterSpacing: 0.5,
                                }}
                            >
                                Finext
                            </span>
                        </div>
                    </div>

                    <h2
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#ffffff',
                            textAlign: 'center',
                            margin: '0 0 12px 0',
                            lineHeight: 1.35,
                        }}
                    >
                        <span style={{ display: 'block' }}>
                            <span
                                style={{
                                    color: '#c084fc',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: 4,
                                    textDecorationThickness: 2,
                                }}
                            >
                                Finext
                            </span>
                            {' '}đã sẵn sàng
                        </span>
                        <span style={{ display: 'block' }}>
                            T2M Invest khép lại hành trình
                        </span>
                    </h2>

                    <p
                        style={{
                            fontSize: 14,
                            lineHeight: 1.65,
                            color: '#cfcfcf',
                            textAlign: 'center',
                            margin: '0 0 20px 0',
                        }}
                    >
                        Finext là thế hệ nền tảng đầu tư kế nhiệm do cùng đội ngũ phát triển,
                        với kiến trúc mới, tính năng mở rộng và trải nghiệm toàn diện hơn.
                    </p>

                    <div
                        style={{
                            ...calloutBase,
                            background: 'rgba(255, 77, 79, 0.1)',
                            border: '1px solid rgba(255, 77, 79, 0.3)',
                            marginBottom: 10,
                        }}
                    >
                        <CalendarOutlined style={{ color: '#ff7875', fontSize: 16, marginTop: 3 }} />
                        <span style={{ fontSize: 13.5, lineHeight: 1.55, color: '#e8e8e8' }}>
                            T2M Invest sẽ{' '}
                            <strong style={{ color: '#ff9c96', fontWeight: 700 }}>
                                ngừng hoạt động từ 30/06/2026
                            </strong>
                            . Sau thời điểm này, mọi tính năng trên T2M Invest sẽ
                            không còn truy cập được.
                        </span>
                    </div>

                    <div
                        style={{
                            ...calloutBase,
                            background: 'rgba(192, 132, 252, 0.1)',
                            border: '1px solid rgba(192, 132, 252, 0.3)',
                            marginBottom: 22,
                        }}
                    >
                        <CrownOutlined style={{ color: '#c084fc', fontSize: 16, marginTop: 3 }} />
                        <span style={{ fontSize: 13.5, lineHeight: 1.55, color: '#e8e8e8' }}>
                            Khách hàng <strong style={{ color: '#c084fc', fontWeight: 700 }}>Premium</strong> vui lòng
                            liên hệ Admin để được hỗ trợ chuyển đổi
                            quyền lợi sang <strong style={{ color: '#c084fc', fontWeight: 700 }}>Finext</strong>, <strong style={{ color: '#14c73b', fontWeight: 700 }}>KHÔNG PHÁT SINH CHI PHÍ</strong>.
                        </span>
                    </div>

                    <Button
                        type="primary"
                        block
                        onClick={handleCTA}
                        style={{
                            height: 44,
                            fontSize: 16,
                            fontWeight: 600,
                            borderRadius: 10,
                        }}
                    >
                        Chuyển sang Finext ngay <ArrowRightOutlined />
                    </Button>

                    <div style={{ textAlign: 'center', marginTop: 12 }}>
                        <Button
                            type="text"
                            className="finext-secondary-link"
                            onClick={handleSecondaryCTA}
                        >
                            Liên hệ Admin
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FinextAnnouncementModal;
