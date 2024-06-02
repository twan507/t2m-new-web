'use client'
import React, { useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthSignInModal from '../auth/signin.modal';
import SubScribesModaOpen from './subscribes.model';


const LockSection = (props: any) => {
    const [isSignInModalOpen, setSignInModalOpen] = useState(false)
    const [isSubScribesModaOpen, setSubScribesModaOpen] = useState(false)

    const pixel = (ratio: number, min: number) => {
        return `${Math.max(ratio * props.ww, min)?.toFixed(0)}px`;
    }

    const handleLockSection = () => {
        if (props.authState) {
            setSubScribesModaOpen(true)
        } else {
            setSignInModalOpen(true)
        }
    }

    return (
        <>
            <AuthSignInModal
                isSignInModalOpen={isSignInModalOpen}
                setSignInModalOpen={setSignInModalOpen}
            />
            <SubScribesModaOpen
                isSubScribesModaOpen={isSubScribesModaOpen}
                setSubScribesModaOpen={setSubScribesModaOpen}
            />
            {(props.type === 'paid' ? !props.accessLevel : !props.authState) && (
                <div
                    onClick={handleLockSection}
                    style={{
                        position: 'absolute',
                        width: props.width,
                        height: props.height,
                        marginTop: props.marginTop,
                        borderRadius: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        backgroundColor: 'rgba(22, 22, 22, 0.3)',
                        color: 'white',
                        backdropFilter: 'blur(20px)',
                        cursor: 'pointer',
                        zIndex: 10,
                    }}
                >
                    <LockOutlined style={{ fontSize: pixel(0.03, 20) }} />
                    <span
                        style={{
                            color: 'white',
                            fontSize: pixel(0.015, 10),
                            fontFamily: 'Calibri, sans-serif',
                            marginTop: '10px',
                        }}
                    >
                        {!props.authState ? 'Đăng nhập để trải nghiệm ' : 'Tính năng này dành cho gói BASIC trở lên'}
                    </span>
                    {!props.authState && (
                        <Link
                            href="#"
                            style={{
                                marginTop: '5px',
                                fontSize: pixel(0.013, 9),
                                fontFamily: 'Calibri, sans-serif',
                                fontStyle: 'italic',
                            }}
                        >
                            Đăng nhập ngay
                        </Link>
                    )}
                    {props.authState && (
                        <Link
                            href="#"
                            style={{
                                marginTop: '5px',
                                fontSize: pixel(0.013, 10),
                                fontFamily: 'Calibri, sans-serif',
                                fontStyle: 'italic',
                            }}
                        >
                            Nâng cấp gói
                        </Link>
                    )}
                </div>
            )}
        </>

    );
};

export default LockSection;
