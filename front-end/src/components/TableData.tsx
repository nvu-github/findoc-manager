import React from 'react'

import { Button, Popconfirm, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface TableDataProps {
  columns: { title: string; dataIndex: string; key: string }[]
  dataSource: any[]
  isLoading: boolean
  dataAction: any
  handleShowRecordDetail?: (record: any) => Promise<void> | void
  handleEditRecord?: (record: any) => Promise<void> | void
  handleDeleteRecord?: (record: any) => Promise<void> | void
}

const TableData: React.FC<TableDataProps> = (props: any) => {
  const { dataSource, columns, isLoading, dataAction, handleEditRecord, handleDeleteRecord } = props
  const { titleConfirmDelete } = dataAction
  const formattedColumns = [
    ...columns,
    {
      title: 'Actions',
      render: (record: any) => (
        <>
          <Button type='link' onClick={() => handleEditRecord(record)}>
            <EditOutlined />
          </Button>
          <Popconfirm title={titleConfirmDelete} onConfirm={() => handleDeleteRecord(record)}>
            <Button type='link' danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </>
      )
    }
  ]
  return (
    <Table
      dataSource={dataSource}
      columns={formattedColumns}
      loading={isLoading}
      rowKey={(record: any) => record.id}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default TableData
