import { ReactNode, useRef } from 'react'
import { Layout, Dropdown, MenuProps, FloatButton, message, Flex } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'

import SideNav from './components/SideNav.tsx'
import HeaderNav from './components/HeaderNav.tsx'
import FooterNav from './components/FooterNav.tsx'

const { Content } = Layout

type DashboardLayoutProps = {
  children: ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const floatBtnRef = useRef(null)

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        message.open({
          type: 'loading',
          content: 'Signing you out...'
        })
      }
    }
  ]

  return (
    <>
      <Layout style={styles.layout}>
        <SideNav trigger={null} collapsible style={styles.sideNavBase} />
        <Layout>
          <HeaderNav style={styles.headerNav}>
            <div style={styles.dropdown}>
              <Dropdown menu={{ items }} trigger={['click']}>
                <Flex>
                  <img
                    src='https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg'
                    alt='user profile photo'
                    style={styles.profileImage}
                  />
                </Flex>
              </Dropdown>
            </div>
          </HeaderNav>
          <Content style={styles.content}>
            {children}
            <div ref={floatBtnRef}>
              <FloatButton.BackTop />
            </div>
          </Content>
          <FooterNav style={styles.footerNav} />
        </Layout>
      </Layout>
    </>
  )
}

const styles: { [key: string]: CSSProperties } = {
  layout: {
    minHeight: '100vh'
  },
  sideNavBase: {
    overflow: 'auto',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    background: 'none',
    border: 'none',
    transition: 'all .2s'
  },
  headerNav: {
    marginLeft: '200px',
    padding: '0 2rem 0 0',
    background: 'none',
    backdropFilter: 'none',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    gap: 8,
    transition: 'all .25s'
  },
  content: {
    margin: `0 0 0 200px`,
    background: '#ebedf0',
    transition: 'all .25s',
    padding: '24px 32px',
    minHeight: 360
  },
  footerNav: {
    textAlign: 'center',
    marginLeft: '200px',
    background: 'none'
  },
  dropdown: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    cursor: 'pointer'
  },
  profileImage: {
    objectFit: 'cover',
    height: '36px',
    width: '36px'
  }
}

export default DashboardLayout
