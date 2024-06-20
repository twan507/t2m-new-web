'use client'
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  UserOutlined,
  FundViewOutlined,
  SearchOutlined,
  LineChartOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  ReloadOutlined,
  PieChartOutlined,
  FileSearchOutlined,
  ExportOutlined,
  CaretUpOutlined,
  UpCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, notification, Image, Col } from 'antd';
import { useRouter } from 'next/navigation';
import AuthSignInModal from '@/components/auth/signin.modal';
import AuthSignUpModal from '@/components/auth/signup.modal';
import UserInfoModal from '@/components/auth/userinfo.modal';
import FooterComponent from '@/components/footer/footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { signOut } from '@/utlis/signOut';
import { resetAuthState } from '@/redux/authSlice';
import { sessionLimit } from '@/utlis/sessionLimit';
import './styles.css'
import SubScribesModaOpen from '@/components/subscribers/subscribes.model';
import TrialModal from '@/components/subscribers/trial.modal';

const { Header, Footer, Content } = Layout;

function getAvatarName(name: string) {
  const words = name?.split(' ').filter(Boolean);
  if (words) {
    if (words?.length === 0) return '';

    if (words?.length === 1) {
      return words[0][0].toUpperCase();
    }

    const firstInitial = words[0][0];
    const lastInitial = words[words?.length - 1][0];
    return (firstInitial + lastInitial).toUpperCase();
  }
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getUserName(name: string) {
  const words = name?.split(' ').filter(Boolean).map(capitalizeFirstLetter);

  if (words) {
    if (words?.length === 0) return '';
    if (words?.length === 1) return words[0];
    if (words?.length > 4) {
      // Bỏ từ thứ hai và lấy 3 từ còn lại
      return `${words[0]} ${words[2]} ${words[3]}`;
    }
    // Trường hợp còn lại, trả về tên đầy đủ
    return words.join(' ');
  }

}

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

const Homelayout = ({ children }: React.PropsWithChildren) => {

  const ww = useWindowWidth();

  //@ts-ignore
  const [path, setPath] = useState(children.props.childProp.segment === "__PAGE__" ? "tong-quan-thi-truong" : children.props.childProp.segment)

  const { Sider } = Layout;

  const router = useRouter()

  const [collapsed, setCollapsed] = useState(true);

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

  const showLogout = authState ? true : false

  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
  const [isUserInfoModal, setUserInfoModalOpen] = useState(false)
  const [isSubScribesModaOpen, setSubScribesModaOpen] = useState(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [mobileLayout, setmMobileLayout] = useState(false);

  const toggleMobileLayout = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth > 800) {
      setmMobileLayout(false)
    } else {
      setmMobileLayout(true)
    }
  };

  useEffect(() => {
    window.addEventListener('resize', toggleMobileLayout);
    toggleMobileLayout();

    return () => {
      window.removeEventListener('resize', toggleMobileLayout);
    };
  }, [path]);

  const handleSelect = ({ key }: { key: string }) => {
    if (key !== '#') {
      router.push(`/${key}`)
      setPath(key)
    }
  }

  const sider_menu = [
    {
      label: (
        <Link href="/tong-quan-thi-truong" onClick={(e) => {
          e.preventDefault()
          setCollapsed(true)
        }}>
          Tổng quan thị trường
        </Link>
      ),
      key: 'tong-quan-thi-truong',
      icon: <PieChartOutlined style={{ fontSize: '20px', marginLeft: '-01px', marginTop: collapsed ? '11px' : '0px' }} />
    },
    {
      label: (
        <Link href="/dong-tien-thi-truong" onClick={(e) => {
          e.preventDefault()
          setCollapsed(true)
        }}>
          Dòng tiền thị trường
        </Link>
      ),
      key: 'dong-tien-thi-truong',
      icon: <BarChartOutlined style={{ fontSize: '18px', marginLeft: '0px', marginTop: collapsed ? '11px' : '0px' }} />,
    },
    {
      label: (
        <Link href="/tra-cuu-nhom-co-phieu" onClick={(e) => {
          e.preventDefault()
          setCollapsed(true)
        }}>
          Tra cứu nhóm CP
        </Link>
      ),
      key: 'tra-cuu-nhom-co-phieu',
      icon: <FileSearchOutlined style={{ fontSize: '18px', marginLeft: '0px', marginTop: collapsed ? '11.5px' : '0px' }} />,
    },
    {
      label: (
        <Link href="/tra-cuu-co-phieu" onClick={(e) => {
          e.preventDefault()
          setCollapsed(true)
        }}>
          Tra cứu cổ phiếu
        </Link>
      ),
      key: 'tra-cuu-co-phieu',
      icon: <SearchOutlined style={{ fontSize: '18px', marginLeft: '-1px', marginTop: collapsed ? '11px' : '0px' }} />,
    },
    {
      label: (
        <Link href="/bo-loc-co-phieu" onClick={(e) => {
          e.preventDefault()
          setCollapsed(true)
        }}>
          Bộ lọc cổ phiếu
        </Link>
      ),
      key: 'bo-loc-co-phieu',
      icon: <FundViewOutlined style={{ fontSize: '18px', marginLeft: '0px', marginTop: '12px' }} />,
    }
  ]

  const bottom_sider_menu = [
    ...((authInfo?.user?.role === "T2M ADMIN") ? [
      {
        label: (
          <Link href="/report" onClick={(e) => {
            e.preventDefault()
            setCollapsed(true)
          }}>
            Xuất báo cáo
          </Link>
        ),
        key: 'report',
        icon: <ExportOutlined />,
      }] : []),
    {
      label: (
        <Link href="#" onClick={async (e) => {
          e.preventDefault()
          dispatch(resetAuthState())
          signOut(authInfo.access_token)
        }}>
          Đăng xuất
        </Link>
      ),
      key: '#',
      icon: <LogoutOutlined />,
    }
  ]

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
        <UserInfoModal
          isUserInfoModal={isUserInfoModal}
          setUserInfoModalOpen={setUserInfoModalOpen}
        />
        <SubScribesModaOpen
          isSubScribesModaOpen={isSubScribesModaOpen}
          setSubScribesModaOpen={setSubScribesModaOpen}
        />
        <TrialModal
          isTrialModalOpen={isTrialModalOpen}
          setIsTrialModalOpen={setIsTrialModalOpen}
        />
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}
            collapsedWidth={mobileLayout ? '0px' : '55px'}
            width='215px'
            style={{
              background: '#000000',
              borderRight: '2px solid #303030',
              height: '100vh',
              position: 'sticky',
              top: 0,
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
            <div>
              <Button
                type="text"
                onClick={() => {
                  authState ? setUserInfoModalOpen(true) : setSignInModalOpen(true)
                }}
                block={true}
                style={{
                  marginTop: '10px',
                  height: "50px",
                  color: '#dfdfdf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'middle'
                }}
              >
                <Avatar
                  icon={authState ? null : <UserOutlined />}
                  style={{ backgroundColor: authState ? '#7265e6' : '#404040', marginLeft: '-8px', marginRight: '10px', marginBottom: '5px', minWidth: '36px', height: '36px', paddingTop: '2px' }}
                >
                  {authState ? getAvatarName(authInfo.user.name) : ''}
                </Avatar>
                {!collapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: authState ? '-4px' : '3px', marginLeft: authState ? '0px' : '12px' }}>
                    <div style={{ fontSize: 15, marginTop: -5 }}>{collapsed ? '' : (authState ? getUserName(authInfo.user.name) : 'Đăng nhập')}</div>
                    {authState && (
                      <div style={{ display: 'flex', marginTop: -3 }} >
                        <div style={{
                          fontSize: 12, marginTop: 4, padding: '0px 5px 0px 5px',
                          background:
                            authInfo.user.role === "T2M ADMIN" ? '#98217c' : (
                              !authInfo.user.licenseInfo?.accessLevel ? '#404040' : (
                                authInfo.user.licenseInfo?.accessLevel === 1 ? '#1777ff' : (
                                  authInfo.user.licenseInfo?.accessLevel === 2 ? '#1E7607' : (
                                    authInfo.user.licenseInfo?.accessLevel === 3 ? '#D0be0f' : '#98217c'
                                  )))),
                          borderRadius: 5, width: 'fit-content'
                        }}
                        >
                          {collapsed ? null : authInfo.user.role === "T2M ADMIN" ? "ADMIN" : authInfo.user.licenseInfo?.product ?? 'FREE'}
                        </div>
                        {(authInfo.user.licenseInfo?.daysLeft && authInfo.user.licenseInfo?.daysLeft < 370) && (
                          //@ts-ignore
                          <div style={{ fontSize: 12, marginTop: 4, marginLeft: '5px', padding: '0px 5px 0px 5px', background: '#A20D0D', borderRadius: 5, width: 'fit-content' }}>
                            {collapsed ? null : `${authInfo.user.licenseInfo?.daysLeft} days`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Button>
              <Button
                type="text"
                icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                block={true}
                style={{
                  fontSize: '16px',
                  height: "50px",
                  color: '#dfdfdf',
                }}
              />
              <Menu
                style={{ background: '#000000' }}
                theme="dark"
                mode="inline"
                selectedKeys={[path]}
                onClick={handleSelect}
                items={sider_menu}
              />
            </div>
            {showLogout && (
              <Menu
                style={{
                  // 110 là chiều cao 2 nút trên cùng, 46 là chiều cao mỗi nút đổi trang, 50 hoặc 100 là chiều cao bản thân nút này
                  marginTop: authInfo.user.role === "T2M ADMIN" ? `calc(100vh - 110px - ${5 * 46}px - 100px` : `calc(100vh - 110px - ${5 * 46}px - 50px`,
                  background: '#000000'
                }}
                theme="dark"
                mode="inline"
                selectedKeys={[]}
                onClick={handleSelect}
                items={bottom_sider_menu}
              />
            )}
          </Sider>
          <Layout style={{ background: '#000000' }}>
            <Header style={{
              margin: '0px', padding: '0px', height: '60px',
              position: 'sticky', background: '#000000', borderBottom: '2px solid #303030',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              top: 0,
              zIndex: 101
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: ww }}>
                {ww > 767 && (
                  <Image
                    preview={false}
                    style={{ width: 'auto', height: '45px', cursor: 'pointer' }}
                    src="/photo/header-logo.png"
                    alt="Home Icon"
                    onClick={() => { window.location.href = '/' }}
                  />
                )}
                {ww <= 767 && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button ghost
                      icon={collapsed ?
                        <MenuUnfoldOutlined style={{ fontSize: '20px', padding: '0px', margin: '0px', marginTop: '3px' }} /> :
                        <MenuFoldOutlined style={{ fontSize: '20px', padding: '0px', margin: '0px', marginTop: '3px' }} />}
                      onClick={() => setCollapsed(!collapsed)}
                      style={{ border: '0px', padding: '0px', margin: '0px' }}
                    />
                    {collapsed && (
                      <Image
                        preview={false}
                        style={{ width: 'auto', height: '30px', marginLeft: '10px', cursor: 'pointer' }}
                        src="/photo/text-logo.png"
                        alt="Home Icon"
                        onClick={() => { window.location.href = '/' }}
                      />
                    )}
                  </div>
                )}
                {((collapsed && ww <= 767) || ww > 767) && (
                  <>
                    {!authState && (
                      <div>
                        <Button ghost type='primary' onClick={() => setSignInModalOpen(true)}
                          icon={ww < 767 ? <UserOutlined /> : null}
                          style={{
                            width: ww < 767 ? '40px' : '120px',
                            fontWeight: 'bold',
                            fontFamily: 'Helvetica Neue, sans-serif'
                          }}>
                          {ww < 767 ? "" : "Đăng nhập"}
                        </Button>
                        <Button type='primary' onClick={() => setSignUpModalOpen(true)}
                          icon={ww < 767 ? <UsergroupAddOutlined /> : null}
                          style={{
                            width: ww < 767 ? '40px' : '120px',
                            marginLeft: '10px',
                            marginRight: '5px',
                            fontWeight: 'bold',
                            fontFamily: 'Helvetica Neue, sans-serif'
                          }}>
                          {ww < 767 ? "" : "Đăng ký"}
                        </Button>,
                      </div>
                    )}
                    {authInfo?.user?.role !== "T2M ADMIN" && (
                      <>
                        {authState && (
                          <div>
                            {!authInfo.user.trialCheck && (
                              <Button ghost type='primary' onClick={() => setIsTrialModalOpen(true)}
                                icon={ww < 767 ? <PlusOutlined style={{ fontSize: '18px', marginTop: '2px' }} /> : null}
                                style={{
                                  width: ww < 767 ? '40px' : '150px',
                                  fontWeight: 'bold',
                                  fontFamily: 'Helvetica Neue, sans-serif'
                                }}>
                                {ww < 767 ? "" : "Đăng kí dùng thử"}
                              </Button>
                            )}
                            <Button type='primary' onClick={() => setSubScribesModaOpen(true)}
                              icon={ww < 767 ? <UpCircleOutlined style={{ fontSize: '18px', marginTop: '2px' }} /> : null}
                              style={{
                                width: ww < 767 ? '40px' : '150px',
                                marginLeft: '10px',
                                marginRight: '5px',
                                fontWeight: 'bold',
                                fontFamily: 'Helvetica Neue, sans-serif'
                              }}>
                              {ww < 767 ? "" : ((Object.keys(authInfo.user.licenseInfo).length === 0 || authInfo.user.licenseInfo.product === 'TRIAL') ? "Nâng cấp gói" : "Gia hạn gói")}
                            </Button>,
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </Header>
            {((collapsed && ww <= 600) || ww > 600) && (
              <>
                <Content>
                  {children}
                </Content>
                <FooterComponent />
              </>
            )}
          </Layout>
        </Layout >
      </>
    )
  }
}

export default Homelayout;