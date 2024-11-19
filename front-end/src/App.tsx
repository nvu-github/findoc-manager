import React from 'react'
import { ConfigProvider, App as AntdApp } from 'antd'

import DashboardRoutes from './routes/DashboardRoutes'

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider>
        <AntdApp>
          <DashboardRoutes />
        </AntdApp>
      </ConfigProvider>
    </>
  )
}

export default App
