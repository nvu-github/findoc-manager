import React from 'react'
import { ConfigProvider } from 'antd'

import DashboardRoutes from './routes/DashboardRoutes'

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider>
        <DashboardRoutes />
      </ConfigProvider>
    </>
  )
}

export default App
