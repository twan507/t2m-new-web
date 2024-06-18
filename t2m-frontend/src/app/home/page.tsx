'use client'
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Image } from 'antd';
import './styles.css'
import { Header, Content } from 'antd/es/layout/layout';
import { LogoutOutlined, PlusOutlined, UpCircleOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { sessionLimit } from '@/utlis/sessionLimit';
import { resetAuthState } from '@/redux/authSlice';
import AuthSignInModal from '@/components/auth/signin.modal';
import AuthSignUpModal from '@/components/auth/signup.modal';
import SubScribesModaOpen from '@/components/subscribers/subscribes.model';
import TrialModal from '@/components/subscribers/trial.modal';
import { signOut } from '@/utlis/signOut';

const useWindowWidth = (): any => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    // Add keyframe animation to the global styles
    const styles = document.createElement('style');
    styles.innerHTML = `
      @keyframes move {
        0% { transform: translate(0, 0); }
        25% { transform: translate(5px, -5px); }
        50% { transform: translate(-5px, 5px); }
        75% { transform: translate(-5px, -5px); }
        100% { transform: translate(5px, 5px); }
      }
    `;
    document.head.appendChild(styles);

    // Clean up the styles on component unmount
    return () => {
      document.head.removeChild(styles);
    };
  }, []);

  useEffect(() => {
    // Check if the window object is available
    if (typeof window !== 'undefined') {
      setWindowWidth(Math.min(window.innerWidth, 1250));

      const handleResize = () => {
        setWindowWidth(Math.min(window.innerWidth, 1250));
      };

      window.addEventListener('resize', handleResize);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return windowWidth;
};

const SalePage = () => {

  const [limitState, setLimitState] = useState(false);
  const dispatch = useAppDispatch();
  const authInfo = useAppSelector((state) => state.auth)
  useEffect(() => {
    (async () => {
      const limitState = await sessionLimit(authInfo?.user?.email, authInfo?.access_token);
      if (!limitState) { dispatch(resetAuthState()) }
      setLimitState(limitState);
    })()
  }, [authInfo?.user?.email, authInfo?.access_token]);
  const authState = !!authInfo?.user?._id && limitState

  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
  const [isSubScribesModaOpen, setSubScribesModaOpen] = useState(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)

  const ww = useWindowWidth();
  const pixel = (ratio: number, min: number) => {
    return `${Math.max(ratio * ww, min)?.toFixed(0)}px`;
  }
  const [checkAuth, setCheckAuth] = useState(true);

  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <AuthSignInModal
          isSignInModalOpen={isSignInModalOpen}
          setSignInModalOpen={setSignInModalOpen}
        />
        <AuthSignUpModal
          isSignUpModalOpen={isSignUpModalOpen}
          setSignUpModalOpen={setSignUpModalOpen}
        />
        <SubScribesModaOpen
          isSubScribesModaOpen={isSubScribesModaOpen}
          setSubScribesModaOpen={setSubScribesModaOpen}
        />
        <TrialModal
          isTrialModalOpen={isTrialModalOpen}
          setIsTrialModalOpen={setIsTrialModalOpen}
        />
        <Header style={{
          margin: '0px', padding: '0px', height: '60px',
          position: 'sticky', background: '#000', borderBottom: '2px solid #161616',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          top: 0,
          zIndex: 101
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: ww }}>
            <Image
              preview={false}
              style={{ width: 'auto', height: ww > 767 ? '45px' : '30px', marginLeft: '10px', cursor: 'pointer' }}
              src={ww > 767 ? "/photo/header-logo.png" : "/photo/text-logo.png"}
              alt="Home Icon"
              onClick={() => { window.location.href = '/home' }}
            />
            {!authState && (
              <div>
                <Button ghost type='primary' onClick={() => setSignInModalOpen(true)}
                  icon={ww < 767 ? <UserOutlined /> : null}
                  style={{
                    width: ww < 767 ? '40px' : '150px',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica Neue, sans-serif'
                  }}>
                  {ww < 767 ? "" : "Đăng nhập"}
                </Button>
                <Button type='primary' onClick={() => setSignUpModalOpen(true)}
                  icon={ww < 767 ? <UsergroupAddOutlined /> : null}
                  style={{
                    width: ww < 767 ? '40px' : '150px',
                    marginLeft: '10px',
                    marginRight: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica Neue, sans-serif'
                  }}>
                  {ww < 767 ? "" : "Đăng ký"}
                </Button>
              </div>
            )}
            {authState && (
              <div>
                {!authInfo.user.trialCheck && (
                  <Button type='primary' onClick={() => setIsTrialModalOpen(true)}
                    icon={ww < 767 ? <PlusOutlined style={{ fontSize: '18px', marginTop: '2px' }} /> : null}
                    style={{
                      width: ww < 767 ? '40px' : '150px',
                      fontWeight: 'bold',
                      fontFamily: 'Helvetica Neue, sans-serif'
                    }}>
                    {ww < 767 ? "" : "Đăng kí dùng thử"}
                  </Button>
                )}
                <Button ghost type='primary' onClick={() => {
                  dispatch(resetAuthState())
                  signOut(authInfo.access_token)
                }}
                  icon={ww < 767 ? <LogoutOutlined style={{ fontSize: '18px', marginTop: '2px' }} /> : null}
                  style={{
                    width: ww < 767 ? '40px' : '150px',
                    marginLeft: '10px',
                    marginRight: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica Neue, sans-serif'
                  }}>
                  {ww < 767 ? "" : "Đăng xuất"}
                </Button>
              </div>
            )}
          </div>
        </Header>
        <Content style={{ display: 'flex', justifyContent: 'center', background: '#000' }}>
          <Row style={{ position: 'relative', background: 'black', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <video
              autoPlay loop muted style={{
                position: 'absolute', top: 0, left: 0,
                opacity: 0.5,
                width: '100%',
                height: '450px',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 0
              }}
            >
              <source src="/home-content/home_video.mp4" type="video/mp4" />
            </video>
            <Col style={{ width: ww }}>
              <Row>
                <Col xs={24} sm={24} md={15} lg={15} xl={15}>
                  <div>
                    <Image
                      src="/photo/header-logo.png"
                      preview={false}
                      style={{
                        width: ww > 767 ? '35%' : '50%',
                        height: 'auto',
                        marginTop: 0.08 * ww,
                        marginLeft: ww > 767 ? '20px' : pixel(0.1, 30),
                        animation: 'move 5s infinite alternate'
                      }}
                    />
                    <p style={{
                      fontSize: pixel(0.018, 13), color: '#f2f2f2',
                      marginLeft: ww > 767 ? '30px' : pixel(0.11, 40),
                      marginTop: ww > 767 ? '30px' : '10px',
                      fontFamily: 'Montserrat, sans-serif',
                      animation: 'move 5s infinite alternate'
                    }}>
                      Hệ thống định vị dòng tiền thị trường chứng khoán
                    </p>
                    <p style={{
                      fontSize: pixel(0.04, 24), color: '#f2f2f2',
                      marginLeft: ww > 767 ? '30px' : pixel(0.11, 40),
                      marginTop: '-5px', marginBottom: '0px',
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold',
                      animation: 'move 5s infinite alternate'
                    }}>
                      DUY NHẤT TẠI VIỆT NAM
                    </p>
                    <Button
                      size='large'
                      style={{
                        marginLeft: ww > 767 ? '30px' : pixel(0.11, 40),
                        marginTop: '20px',
                        animation: 'move 5s infinite alternate',
                        background: 'linear-gradient(45deg, #C031C7, #9C1AB1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)', // Outer glow effect
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #9C1AB1, #C031C7)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(192, 49, 199, 0.8), 0 0 40px rgba(192, 49, 199, 0.6)'; // Enhanced glow effect on hover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #C031C7, #9C1AB1)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)'; // Original glow effect
                      }}
                    >
                      TRUY CẬP NGAY
                    </Button>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={9} lg={9} xl={9} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    src="/home-content/laptop_t2m_transparent.png"
                    preview={false}
                    style={{
                      width: ww > 767 ? '130%' : '100%',
                      height: 'auto',
                      marginTop: ww > 767 ? '70px' : '30px',
                      marginLeft: ww > 767 ? '-80px' : '0px',
                      animation: 'move 5s infinite alternate'
                    }}
                  />
                </Col>

              </Row>
            </Col>
          </Row>
          <Row>
            <div style={{ height: "1000px" }}>
              abc
            </div>
          </Row>
        </Content>
      </>
    )
  }
}

export default SalePage;
