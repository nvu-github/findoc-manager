import React, { useEffect, useRef, useState } from 'react'
import { ConfigProvider, Layout, Menu, MenuProps, SiderProps } from 'antd'
import {
  PieChartOutlined,
  DownSquareOutlined,
  FileDoneOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode): MenuItem => {
  return {
    key,
    icon,
    label
  } as MenuItem
}

const items: MenuProps['items'] = [
  getItem(<Link to='/'>Dashboard</Link>, 'dashboard', <PieChartOutlined />),
  getItem(<Link to='/companies'>Company</Link>, 'companies', <SolutionOutlined />),
  getItem(<Link to='/accounts'>Account</Link>, 'accounts', <UsergroupAddOutlined />),
  getItem(<Link to='/billers'>Biller</Link>, 'billers', <FileDoneOutlined />),
  getItem(<Link to='/currencies'>Currency</Link>, 'currencies', <DollarOutlined />),
  getItem(<Link to='/bookings'>Booking</Link>, 'bookings', <DownSquareOutlined />)
]

type SideNavProps = SiderProps

const SideNav = ({ ...others }: SideNavProps) => {
  const nodeRef = useRef(null)
  const { pathname } = useLocation()
  const [current, setCurrent] = useState('')

  useEffect(() => {
    const paths = pathname.split('/')
    setCurrent(paths[1] || 'dashboard')
  }, [pathname])

  const onMenuClick = ({ key }: { key: string }) => {
    setCurrent(key)
  }

  return (
    <Sider ref={nodeRef} breakpoint='lg' collapsedWidth='0' {...others}>
      <div style={{ textAlign: 'center', padding: '1rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'blue' }}>
        LOGO
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: 'none',
              itemSelectedBg: '#e6f7ff',
              itemHoverBg: '#f5f5f5',
              itemSelectedColor: '#1890ff'
            }
          }
        }}
      >
        <Menu mode='inline' items={items} selectedKeys={[current]} onClick={onMenuClick} style={{ border: 'none' }} />
      </ConfigProvider>
    </Sider>
  )
}

export default SideNav
