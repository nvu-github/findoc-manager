import React from 'react'
import { Card, Row, Col } from 'antd'

const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>DashboardPage</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card title='Total Bookings' bordered={false}>
            100
          </Card>
        </Col>
        <Col span={8}>
          <Card title='Total Companies' bordered={false}>
            4
          </Card>
        </Col>
        <Col span={8}>
          <Card title='Total Billers' bordered={false}>
            10
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
