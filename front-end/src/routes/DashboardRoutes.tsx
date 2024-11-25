import React, { CSSProperties } from 'react'
import { Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Button, Result } from 'antd'

import DashboardLayout from '../layouts/Dashboard'
import DashboardPage from '../pages/DashboardPage'
import BookingsPage from '../pages/BookingsPage'
import BillersPage from '../pages/BillersPage'
import CompaniesPage from '../pages/CompaniesPage'
import AccountsPage from '../pages/Accounts'
import ProjectsPage from '../pages/ProjectsPage'

const NotFoundPage: React.FC = () => (
  <div style={styles.notFoundPage}>
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button href='/' type='primary'>
          Back Home
        </Button>
      }
    />
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout children={<Outlet />} />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'billers', element: <BillersPage /> },
      { path: 'companies', element: <CompaniesPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'projects', element: <ProjectsPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
])

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />
}

const styles: { [key: string]: CSSProperties } = {
  notFoundPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center'
  }
}

export default AppRoutes
