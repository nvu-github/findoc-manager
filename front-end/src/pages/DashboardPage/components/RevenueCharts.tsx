import React from 'react'
import { Card, Col, Row } from 'antd'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface RevenueChartsProps {
  revenueData: { name: string; revenue: number }[]
}

const RevenueCharts: React.FC<RevenueChartsProps> = ({ revenueData }) => {
  return (
    <Row gutter={16} style={styles.chartRow}>
      <Col span={12}>
        <Card title='Revenue by Company' bordered={false} style={styles.chartCard}>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='revenue' fill='#8884d8' />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col span={12}>
        <Card title='Revenue Distribution' bordered={false} style={styles.chartCard}>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey='revenue'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={100}
                fill='#82ca9d'
                label
              >
                {revenueData.map((_, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  chartRow: {
    marginTop: '24px',
    marginBottom: '30px'
  },
  chartCard: {
    height: '100%'
  }
}

export default RevenueCharts
