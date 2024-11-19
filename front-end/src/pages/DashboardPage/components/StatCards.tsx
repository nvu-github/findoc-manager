import React from 'react'
import { Card, Row, Col } from 'antd'

interface StatCardsProps {
  companiesCount: number
  accountsCount: number
  billersCount: number
}

const StatCards: React.FC<StatCardsProps> = ({ companiesCount, accountsCount, billersCount }) => {
  return (
    <Row gutter={16} style={styles.statRow}>
      <Col span={8}>
        <Card title='Total Companies' bordered={false}>
          {companiesCount}
        </Card>
      </Col>
      <Col span={8}>
        <Card title='Total Accounts' bordered={false}>
          {accountsCount}
        </Card>
      </Col>
      <Col span={8}>
        <Card title='Total Billers' bordered={false}>
          {billersCount}
        </Card>
      </Col>
    </Row>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  statRow: {
    marginTop: '24px',
    marginBottom: '20px'
  }
}

export default StatCards
