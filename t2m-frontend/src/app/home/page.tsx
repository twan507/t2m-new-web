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
          position: 'sticky', background: '#F8F8F8', borderBottom: '2px solid #F1F1F1',
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
        <Content style={{ display: 'flex'}}>
          <Col span={24} style={{ position: 'relative' }}>
            <Row>
              <Col span={10} style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                borderTopLeftRadius: '20px',
                zIndex: 1,
              }}>
              </Col>
              <Col span={18} style={{ zIndex: 2 }}>
                <Image src="photo/anh_bia_t2m_home.png" preview={false} style={{ borderTopRightRadius: '20px', marginTop: '30px' }} />
              </Col>
            </Row>
          </Col>
        </Content>
      </>
    )
  }
}

export default SalePage;
