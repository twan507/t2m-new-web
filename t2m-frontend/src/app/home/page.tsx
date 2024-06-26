'use client'
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Image, Carousel, notification } from 'antd';
import './styles.css'
import { Header, Content } from 'antd/es/layout/layout';
import { CheckSquareOutlined, LogoutOutlined, PlusOutlined, UpCircleOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { sessionLimit } from '@/utlis/sessionLimit';
import { resetAuthState } from '@/redux/authSlice';
import AuthSignInModal from '@/components/auth/signin.modal';
import AuthSignUpModal from '@/components/auth/signup.modal';
import SubScribesModaOpen from '@/components/subscribers/subscribes.model';
import TrialModal from '@/components/subscribers/trial.modal';
import { signOut } from '@/utlis/signOut';
import FooterComponent from '@/components/footer/footer';
import HomeForm from './components/form';

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

  const scrollToBottom = () => {
    window.scrollTo({
      top: ww > 575 ? document.documentElement.scrollHeight - 990 : document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

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
        <Content style={{ display: 'flex', justifyContent: 'center', background: '#000', paddingBottom: '50px' }}>
          <Col style={{ width: '100%' }}>
            <Row style={{ position: 'relative', background: 'black', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <video
                autoPlay loop muted style={{
                  position: 'absolute', top: 0, left: 0,
                  opacity: 0.5,
                  width: '100%',
                  height: ww > 575 ? pixel(0.4, 300) : pixel(1, 400),
                  objectFit: 'cover',
                  objectPosition: 'center',
                  zIndex: 0
                }}
              >
                <source src="/videos/home_video.mp4" type="video/mp4" />
              </video>
              <Col style={{ width: ww }}>
                <Row>
                  <Col xs={24} sm={15} md={15} lg={15} xl={15}>
                    <div>
                      <Image
                        src="/photo/header-logo.png"
                        preview={false}
                        style={{
                          width: ww > 767 ? '35%' : '50%',
                          height: 'auto',
                          marginTop: ww > 575 ? 0.08 * ww : '20px',
                          marginLeft: ww > 575 ? '20px' : pixel(0.1, 30),
                          animation: 'move 5s infinite alternate'
                        }}
                      />
                      <p style={{
                        fontSize: pixel(0.018, 13), color: '#f2f2f2',
                        marginLeft: ww > 575 ? '30px' : pixel(0.11, 40),
                        marginTop: ww > 767 ? '30px' : '10px',
                        fontFamily: 'Montserrat, sans-serif',
                        animation: 'move 5s infinite alternate'
                      }}>
                        Hệ thống định vị dòng tiền thị trường chứng khoán
                      </p>
                      <p style={{
                        fontSize: pixel(0.04, 24), color: '#f2f2f2',
                        marginLeft: ww > 575 ? '30px' : pixel(0.11, 40),
                        marginTop: '-5px', marginBottom: '0px',
                        fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold',
                        animation: 'move 5s infinite alternate'
                      }}>
                        DUY NHẤT TẠI VIỆT NAM
                      </p>
                      {ww > 575 && (
                        <div style={{ display: 'flex' }}>
                          <div
                            style={{
                              animation: 'move 5s infinite alternate',
                              width: ww > 767 ? '150px' : '120px',
                              height: ww > 767 ? '40px' : '30px',
                              marginLeft: '30px',
                              marginTop: '20px',
                              background: 'linear-gradient(45deg, #C031C7, #9C1AB1)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: pixel(0.013, 12),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.3s ease, box-shadow 0.3s ease',
                              boxShadow: '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)',
                              cursor: 'pointer',
                              textAlign: 'justify'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(45deg, #9C1AB1, #C031C7)';
                              e.currentTarget.style.boxShadow = '0 0 20px rgba(192, 49, 199, 0.8), 0 0 40px rgba(192, 49, 199, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(45deg, #C031C7, #9C1AB1)';
                              e.currentTarget.style.boxShadow = '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)';
                            }}
                            onClick={() => { window.location.href = '/tong-quan-thi-truong' }}
                          >
                            TRUY CẬP NGAY
                          </div>
                          <div
                            style={{
                              animation: 'move 5s infinite alternate',
                              width: ww > 767 ? '150px' : '120px',
                              height: ww > 767 ? '40px' : '30px',
                              marginLeft: ww > 767 ? '30px' : '20px',
                              marginTop: '20px',
                              background: 'linear-gradient(45deg, #24B75E, #1E9D4F)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: pixel(0.013, 12),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.3s ease, box-shadow 0.3s ease',
                              boxShadow: '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)',
                              cursor: 'pointer',
                              textAlign: 'justify'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(45deg, #1E9D4F, #24B75E)';
                              e.currentTarget.style.boxShadow = '0 0 20px rgba(36, 183, 94, 0.8), 0 0 40px rgba(36, 183, 94, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(45deg, #24B75E, #1E9D4F)';
                              e.currentTarget.style.boxShadow = '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)';
                            }}
                            onClick={scrollToBottom}
                          >
                            NHẬN TƯ VẤN
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={9} md={9} lg={9} xl={9} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Image
                      src="/photo/laptop_t2m_transparent.png"
                      preview={false}
                      style={{
                        width: ww > 575 ? '130%' : '80%',
                        height: 'auto',
                        marginTop: ww > 575 ? '70px' : '30px',
                        marginLeft: ww > 900 ? '-120px' : (ww > 700 ? '-90px' : (ww > 575 ? '-65px' : '10px')),
                        animation: 'move 5s infinite alternate'
                      }}
                    />
                    {ww <= 575 && (
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            animation: 'move 5s infinite alternate',
                            width: '120px',
                            height: '30px',
                            marginLeft: '45px',
                            marginTop: '0px',
                            background: 'linear-gradient(45deg, #C031C7, #9C1AB1)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: pixel(0.013, 12),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s ease, box-shadow 0.3s ease',
                            boxShadow: '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)',
                            cursor: 'pointer',
                            textAlign: 'justify'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(45deg, #9C1AB1, #C031C7)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(192, 49, 199, 0.8), 0 0 40px rgba(192, 49, 199, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(45deg, #C031C7, #9C1AB1)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)';
                          }}
                          onClick={() => { window.location.href = '/tong-quan-thi-truong' }}
                        >
                          TRUY CẬP NGAY
                        </div>
                        <div
                          style={{
                            animation: 'move 5s infinite alternate',
                            width: '120px',
                            height: '30px',
                            marginLeft: '20px',
                            marginTop: '0px',
                            background: 'linear-gradient(45deg, #24B75E, #1E9D4F)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: pixel(0.013, 12),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s ease, box-shadow 0.3s ease',
                            boxShadow: '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)',
                            cursor: 'pointer',
                            textAlign: 'justify'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(45deg, #1E9D4F, #24B75E)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(36, 183, 94, 0.8), 0 0 40px rgba(36, 183, 94, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(45deg, #24B75E, #1E9D4F)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)';
                          }}
                          onClick={scrollToBottom}
                        >
                          NHẬN TƯ VẤN
                        </div>
                      </div>
                    )}
                  </Col>

                </Row>
              </Col>
            </Row>
            <Row style={{ background: 'black', width: '100%', display: 'flex', justifyContent: 'center', marginTop: pixel(0.08, ww > 767 ? 80 : 100) }}>
              <Col style={{ width: ww }}>
                <Row style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ fontSize: pixel(0.035, 26), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0 }}>
                    Tính năng
                  </h1>
                  <hr style={{ border: 0, height: '1px', backgroundColor: '#C031C7', width: pixel(0.2, 150) }} />
                  <p style={{ fontSize: pixel(0.013, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf' }}>
                    Đây là những bí mật bạn sẽ được khám phá khi tham gia cùng với T2M Invest
                  </p>
                </Row>
                <Row gutter={0} style={{ padding: 10 }}>
                  <Col xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: '0px 5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: ww > 767 ? '230px' : '200px',
                        marginTop: '5px',
                        background: 'linear-gradient(45deg, #C031C7, #9C1AB1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: pixel(0.013, 12),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'justify'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #9C1AB1, #C031C7)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(192, 49, 199, 0.8), 0 0 40px rgba(192, 49, 199, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #C031C7, #9C1AB1)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(192, 49, 199, 0.6), 0 0 30px rgba(192, 49, 199, 0.4)';
                      }}
                      onClick={scrollToBottom}
                    >
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: ww > 767 ? '100px' : '50px', margin: '20px 0px 0px 0px' }}
                        src="/icons/icon_1.png"
                      />
                      <span style={{ padding: 10 }}>03 chỉ báo độc quyền để đánh giá trạng thái của thị trường chứng khoán chỉ trong 10 giây.</span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: '0px 5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: ww > 767 ? '230px' : '200px',
                        marginTop: '5px',
                        background: 'linear-gradient(45deg, #24B75E, #1E9D4F)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: pixel(0.013, 12),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'justify'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #1E9D4F, #24B75E)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(36, 183, 94, 0.8), 0 0 40px rgba(36, 183, 94, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #24B75E, #1E9D4F)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)';
                      }}
                      onClick={scrollToBottom}
                    >
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: ww > 767 ? '100px' : '50px', margin: '20px 0px 0px 0px' }}
                        src="/icons/icon_2.png"
                      />
                      <span style={{ padding: 10 }}>04 tiêu chí chỉ có tại T2M để định vị và xác định các giai đoạn luân chuyển của dòng tiền trong thị trường giữa các nhóm ngành và nhóm cổ phiếu</span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: '0px 5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: ww > 767 ? '230px' : '200px',
                        marginTop: '5px',
                        background: 'linear-gradient(45deg, #D0BE0F, #C8B60E)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: pixel(0.013, 12),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(208, 190, 15, 0.6), 0 0 30px rgba(208, 190, 15, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'justify'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #C8B60E, #D0BE0F)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(208, 190, 15, 0.8), 0 0 40px rgba(208, 190, 15, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #D0BE0F, #C8B60E)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(208, 190, 15, 0.6), 0 0 30px rgba(208, 190, 15, 0.4)';
                      }}
                      onClick={scrollToBottom}
                    >
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: ww > 767 ? '100px' : '50px', margin: '20px 0px 0px 0px' }}
                        src="/icons/icon_3.png"
                      />
                      <span style={{ padding: 10 }}>05 thành tố trọng yếu của một cổ phiếu để xác nhận các điểm mua đạt hiệu quả lợi nhuận vượt trội.</span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: '0px 5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: ww > 767 ? '230px' : '200px',
                        marginTop: '5px',
                        background: 'linear-gradient(45deg, #E14040, #D63636)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: pixel(0.013, 12),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(225, 64, 64, 0.6), 0 0 30px rgba(225, 64, 64, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'justify'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #D63636, #E14040)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(225, 64, 64, 0.8), 0 0 40px rgba(225, 64, 64, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #E14040, #D63636)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(225, 64, 64, 0.6), 0 0 30px rgba(225, 64, 64, 0.4)';
                      }}
                      onClick={scrollToBottom}
                    >
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: ww > 767 ? '100px' : '50px', margin: '20px 0px 0px 0px' }}
                        src="/icons/icon_4.png"
                      />
                      <span style={{ padding: 10 }}>{"Triết lý đầu tư mạnh mẽ áp dụng các nguyên lý của dòng tiền luân chuyển trên thị trường để đạt lợi nhuận >100% sau 12 tháng đầu tiên áp dụng."}</span>
                    </div>
                  </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: pixel(0.04, ww > 767 ? 50 : 70) }}>
                  <h1 style={{ fontSize: pixel(0.035, 26), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0 }}>
                    Sản phẩm
                  </h1>
                  <hr style={{ border: 0, height: '1px', backgroundColor: '#C031C7', width: pixel(0.2, 150) }} />
                  <p style={{ fontSize: pixel(0.013, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf' }}>
                    T2M Invest tự hào khi sở hữu bộ sản phẩm dựa trên nghiên cứu độc quyền
                  </p>
                </Row>
                {ww > 767 && (
                  <Row>
                    <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                    <Col xs={10} sm={10} md={10} lg={10} xl={10} style={{ padding: '0px 0px 0px 5px' }}>
                      <Row style={{ height: '150px', marginTop: '20px', background: '#161616', borderRadius: '12px' }}>
                        <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                            src="/icons/icon_10.png"
                          />
                        </Col>
                        <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                          <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Hệ thống định vị dòng tiền T2M Stock
                          </p>
                          <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Website duy nhất trên thị trường cung cấp khả năng xác định nhanh chóng và chính xác về sự luân chuyển của dòng tiền và trạng thái của thị trường chứng khoán.
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ height: '140px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                        <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                            src="/icons/icon_9.png"
                          />
                        </Col>
                        <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                          <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Tín hiệu cổ phiếu và phái sinh T2M AI
                          </p>
                          <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Trí tuệ nhân tạo mạnh mẽ giúp đưa ra các tín hiệu mua/bán cổ phiếu mang lại hiệu quả vượt trội
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ height: '140px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                        <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                            src="/icons/icon_5.png"
                          />
                        </Col>
                        <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                          <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Đào tạo T2M Leaning
                          </p>
                          <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Mỗi tuần sẽ có một buổi đào tạo và chia sẻ của chuyên gia về phương pháp đầu tư theo dòng tiền T2M
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ height: '140px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                        <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                            src="/icons/icon_7.png"
                          />
                        </Col>
                        <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                          <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Cộng đồng T2m Invest
                          </p>
                          <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                            Cộng đồng Nhà Đầu Tư đông đảo dày dặn kinh nghiệm cùng nhau áp dụng  phương pháp đầu tư theo dòng tiền T2M.
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                    <Col xs={14} sm={14} md={10} lg={10} xl={10}>
                      <Carousel autoplay style={{ height: '620px', marginTop: '20px' }}>
                        <div className='gallery'>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: '600px' }}
                            src="/gallery/page1.png"
                          />
                        </div>
                        <div className='gallery'>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: '600px' }}
                            src="/gallery/page2.png"
                          />
                        </div>
                        <div className='gallery'>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: '600px' }}
                            src="/gallery/page3.png"
                          />
                        </div>
                        <div className='gallery'>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: '600px' }}
                            src="/gallery/page4.png"
                          />
                        </div>
                        <div className='gallery'>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: '600px' }}
                            src="/gallery/page5.png"
                          />
                        </div>
                        <div className='gallery'>
                          <Image
                            preview={false}
                            style={{ width: 'auto', height: '600px' }}
                            src="/gallery/page6.png"
                          />
                        </div>
                      </Carousel>
                    </Col>
                  </Row>
                )}
                {ww <= 767 && (
                  <>
                    <Row>
                      <Col xs={0} sm={1} md={2} lg={2} xl={2}></Col>
                      <Col xs={10} sm={9} md={10} lg={10} xl={10} style={{ padding: '0px 0px 0px 10px' }}>
                        <Row style={{ height: '150px', marginTop: '20px', background: '#161616', borderRadius: '12px' }}>
                          <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                              src="/icons/icon_10.png"
                            />
                          </Col>
                          <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Hệ thống định vị dòng tiền T2M Stock
                            </p>
                            <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Website duy nhất trên thị trường cung cấp khả năng xác định nhanh chóng và chính xác về sự luân chuyển của dòng tiền và trạng thái của thị trường chứng khoán.
                            </p>
                          </Col>
                        </Row>
                        <Row style={{ height: '140px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                          <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                              src="/icons/icon_9.png"
                            />
                          </Col>
                          <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Tín hiệu cổ phiếu và phái sinh T2M AI
                            </p>
                            <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Trí tuệ nhân tạo mạnh mẽ giúp đưa ra các tín hiệu mua/bán cổ phiếu mang lại hiệu quả vượt trội
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                      <Col xs={14} sm={13} md={10} lg={10} xl={10}>
                        <Carousel autoplay style={{ height: '320px', marginTop: '20px' }}>
                          <div className='gallery'>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: '300px' }}
                              src="/gallery/page1.png"
                            />
                          </div>
                          <div className='gallery'>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: '300px' }}
                              src="/gallery/page2.png"
                            />
                          </div>
                          <div className='gallery'>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: '300px' }}
                              src="/gallery/page3.png"
                            />
                          </div>
                        </Carousel>
                      </Col>
                      <Col xs={0} sm={1} md={0} lg={0} xl={0}></Col>
                    </Row>
                    <Row>
                      <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                      <Col xs={14} sm={13} md={10} lg={10} xl={10}>
                        <Carousel autoplay style={{ height: '320px', marginTop: '0px' }}>
                          <div className='gallery'>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: '300px' }}
                              src="/gallery/page4.png"
                            />
                          </div>
                          <div className='gallery'>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: '300px' }}
                              src="/gallery/page5.png"
                            />
                          </div>
                          <div className='gallery'>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: '300px' }}
                              src="/gallery/page6.png"
                            />
                          </div>
                        </Carousel>
                      </Col>
                      <Col xs={0} sm={1} md={2} lg={2} xl={2}></Col>
                      <Col xs={10} sm={9} md={10} lg={10} xl={10} style={{ padding: '0px 10px 0px 0px' }}>
                        <Row style={{ height: '140px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                          <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                              src="/icons/icon_5.png"
                            />
                          </Col>
                          <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Đào tạo T2M Leaning
                            </p>
                            <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Mỗi tuần sẽ có một buổi đào tạo và chia sẻ của chuyên gia về phương pháp đầu tư theo dòng tiền T2M
                            </p>
                          </Col>
                        </Row>
                        <Row style={{ height: '140px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                          <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                              preview={false}
                              style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                              src="/icons/icon_7.png"
                            />
                          </Col>
                          <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <p style={{ fontSize: pixel(0.015, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: '0px 0px 5px 0px', fontWeight: 'bold', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Cộng đồng T2m Invest
                            </p>
                            <p style={{ fontSize: pixel(0.013, 9), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                              Cộng đồng Nhà Đầu Tư đông đảo dày dặn kinh nghiệm cùng nhau áp dụng  phương pháp đầu tư theo dòng tiền T2M.
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={0} sm={1} md={0} lg={0} xl={0}></Col>
                    </Row>
                  </>
                )}
                <Row style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: pixel(0.04, ww > 767 ? 50 : 70) }}>
                  <h1 style={{ fontSize: pixel(0.035, 26), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0 }}>
                    Thành tựu
                  </h1>
                  <hr style={{ border: 0, height: '1px', backgroundColor: '#C031C7', width: pixel(0.2, 150) }} />
                  <p style={{ fontSize: pixel(0.013, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf' }}>
                    Đây là những lý do mà nhà đầu tư nên lựa chọn sử dụng T2M Invest
                  </p>
                </Row>
                <Row gutter={0} style={{ padding: 10 }}>
                  <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ padding: '0px 5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: ww > 767 ? '230px' : '200px',
                        marginTop: '5px',
                        background: 'linear-gradient(45deg, #025bc4, #4690e5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: pixel(0.013, 12),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(2, 91, 196, 0.6), 0 0 30px rgba(2, 91, 196, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #4690e5, #025bc4)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(2, 91, 196, 0.8), 0 0 40px rgba(2, 91, 196, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #025bc4, #4690e5)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(2, 91, 196, 0.6), 0 0 30px rgba(2, 91, 196, 0.4)';
                      }}
                    >
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: ww > 767 ? '100px' : '50px', margin: '20px 0px 0px 0px' }}
                        src="/icons/icon_6.png"
                      />
                      <span style={{ padding: '0px 10px', margin: '20px 0px 5px 0px', fontSize: pixel(0.02, 15), fontWeight: 'bold' }}> 5+ </span>
                      <span style={{ padding: '0px 10px', margin: 0 }}>Năm kinh nghiệm đầu tư trên thị trường</span>
                    </div>
                  </Col>
                  <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ padding: '0px 5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: ww > 767 ? '230px' : '200px',
                        marginTop: '5px',
                        background: 'linear-gradient(45deg, #EC8000, #FFA64D)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: pixel(0.013, 12),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(236, 128, 0, 0.6), 0 0 30px rgba(236, 128, 0, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #FFA64D, #EC8000)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(236, 128, 0, 0.8), 0 0 40px rgba(236, 128, 0, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #EC8000, #FFA64D)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(236, 128, 0, 0.6), 0 0 30px rgba(236, 128, 0, 0.4)';
                      }}
                    >
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: ww > 767 ? '100px' : '50px', margin: '20px 0px 0px 0px' }}
                        src="/icons/icon_8.png"
                      />
                      <span style={{ padding: '0px 10px', margin: '20px 0px 5px 0px', fontSize: pixel(0.02, 15), fontWeight: 'bold' }}> 1000+ </span>
                      <span style={{ padding: '0px 10px', margin: 0 }}>Thành viên đã tham gia cùng T2M Invest</span>
                    </div>
                  </Col>
                  <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ padding: '0px 5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: ww > 767 ? '230px' : '200px',
                        marginTop: '5px',
                        background: 'linear-gradient(45deg, #24B75E, #1E9D4F)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: pixel(0.013, 12),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #1E9D4F, #24B75E)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(36, 183, 94, 0.8), 0 0 40px rgba(36, 183, 94, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #24B75E, #1E9D4F)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(36, 183, 94, 0.6), 0 0 30px rgba(36, 183, 94, 0.4)';
                      }}
                    >
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: ww > 767 ? '100px' : '50px', margin: '20px 0px 0px 0px' }}
                        src="/icons/icon_11.png"
                      />
                      <span style={{ padding: '0px 10px', margin: '20px 0px 5px 0px', fontSize: pixel(0.02, 15), fontWeight: 'bold' }}> 20%+ </span>
                      <span style={{ padding: '0px 10px', margin: 0 }}>Tỉ suất lợi nhuận trung bình hàng năm</span>
                    </div>
                  </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: pixel(0.04, ww > 767 ? 50 : 70) }}>
                  <h1 style={{ fontSize: pixel(0.035, 26), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0 }}>
                    Đăng ký
                  </h1>
                  <hr style={{ border: 0, height: '1px', backgroundColor: '#C031C7', width: pixel(0.2, 150) }} />
                  <p style={{ fontSize: pixel(0.013, 10), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf' }}>
                    Ai là những người nên sử dụng dịch vụ của T2M Invest?
                  </p>
                </Row>
                <Row>
                  <Col xs={24} sm={10} md={10} lg={10} xl={10} style={{ padding: ww > 767 ? '0px 10px 0px 5px' : '0px 10px' }}>
                    <Row style={{ height: '100px', marginTop: '20px', background: '#161616', borderRadius: '12px' }}>
                      <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                          preview={false}
                          style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                          src="/icons/icon_12.png"
                        />
                      </Col>
                      <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <p style={{ fontSize: pixel(0.013, 11), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                          Người chưa từng đầu tư chứng khoán và muốn học đầu tư bài bản
                        </p>
                      </Col>
                    </Row>
                    <Row style={{ height: '100px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                      <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                          preview={false}
                          style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                          src="/icons/icon_14.png"
                        />
                      </Col>
                      <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <p style={{ fontSize: pixel(0.013, 11), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                          Nhà đầu tư đã đầu tư vào thị trường chứng khoán nhưng chưa đạt được lợi nhuận như mong đợi
                        </p>
                      </Col>
                    </Row>
                    <Row style={{ height: '100px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                      <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                          preview={false}
                          style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                          src="/icons/icon_13.png"
                        />
                      </Col>
                      <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <p style={{ fontSize: pixel(0.013, 11), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                          Nhà đầu tư đã đầu tư các lĩnh vực khác và muốn chuyển sang thị trường chứng khoán
                        </p>
                      </Col>
                    </Row>
                    <Row style={{ height: '100px', marginTop: '10px', background: '#161616', borderRadius: '12px' }}>
                      <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                          preview={false}
                          style={{ width: 'auto', height: ww > 767 ? '70px' : '30px' }}
                          src="/icons/icon_15.png"
                        />
                      </Col>
                      <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <p style={{ fontSize: pixel(0.013, 11), fontFamily: 'Montserrat, sans-serif', color: '#dfdfdf', margin: 0, textAlign: 'justify', paddingRight: ww > 767 ? '20px' : '10px' }}>
                          Nhà tư vấn đầu tư chứng khoán cần một công cụ để tiết kiệm thời gian phân tích thị trường
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={0} sm={0} md={2} lg={2} xl={2} />
                  <Col xs={24} sm={14} md={12} lg={12} xl={12} style={{ padding: ww > 767 ? '0px 10px 0px 5px' : '0px 10px', marginBottom: ww > 767 ? 0 : 50 }}>
                    <HomeForm pixel={pixel} ww={ww} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col >
        </Content >
        <FooterComponent />
      </>
    )
  }
}

export default SalePage;
