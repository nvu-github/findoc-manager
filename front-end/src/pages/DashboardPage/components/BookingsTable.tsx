import React from 'react'
import { Table } from 'antd'
import { Booking } from '../../../types'

interface BookingsTableProps {
  columns: any[]
  dataSource: Booking[]
  pagination: any
  loading: boolean
  handleTableChange: (newPagination: any) => void
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  columns,
  dataSource,
  pagination,
  loading,
  handleTableChange
}) => {
  return (
    <div style={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey='id'
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total
        }}
        onChange={handleTableChange}
      />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  tableContainer: {
    marginTop: '24px'
  }
}

export default BookingsTable
