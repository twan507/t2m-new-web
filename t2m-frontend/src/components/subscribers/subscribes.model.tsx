'use client'
import React, { useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { Image as AntdImage } from 'antd';

interface IProps {
    isSubScribesModaOpen: boolean
    setSubScribesModaOpen: (v: boolean) => void
}

const SubScribesModaOpen = (props: IProps) => {

    const { isSubScribesModaOpen, setSubScribesModaOpen } = props

    const handleClose = () => {
        setSubScribesModaOpen(false)
    }

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
        `}
            </style>
            <Modal
                className="custom-modal"
                title=""
                open={isSubScribesModaOpen}
                onOk={handleClose}
                onCancel={handleClose}
                footer={null}
                closeIcon={null}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '80%' }}
            >
                <Row>
                    <div style={{ width: '100%', backgroundColor: '#161616', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '5px' }}>
                        <Col span={24} style={{ maxWidth: '900px' }}>
                            <a href="https://zalo.me/0338662238" target="_blank" rel="noopener noreferrer">
                                <AntdImage
                                    preview={false}
                                    style={{ width: '100%' }}
                                    src="photo/bang_gia_t2m.png"
                                    alt="Bảng giá T2M"
                                />
                            </a>
                        </Col>
                    </div>
                </Row>
            </Modal>
        </>
    );
};

export default SubScribesModaOpen;
