import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { getDocumentsByBookingId, deleteDocumentBooking } from '../../../stores/slices'
import { RootState } from '../../../stores/store'
import { Table, Button, message, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface BookingDocumentsProps {
  bookingId: number
}

const BookingDocuments: React.FC<BookingDocumentsProps> = ({ bookingId }) => {
  const dispatch = useAppDispatch()
  const { documents, loading } = useAppSelector((state: RootState) => state.booking)

  useEffect(() => {
    dispatch(getDocumentsByBookingId(bookingId))
  }, [bookingId, dispatch])

  const handleDelete = async (documentId: number) => {
    try {
      await dispatch(deleteDocumentBooking({ bookingId, documentId }))
      message.success('Document deleted successfully!')
    } catch (error: any) {
      console.log(error)
      message.error('Document delete failed!')
    }
  }

  const handleGetFileName = (fileUrl: string) => {
    if (!fileUrl) return ''
    const url = new URL(fileUrl)
    const path = url.pathname
    const fileName = path.split('/').pop()
    const cleanFileName = fileName?.replace(/^\d+-/, '')
    return decodeURIComponent(cleanFileName || '')
  }

  const columns = [
    {
      title: 'No.',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Document Name',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      render: (fileUrl: string) => handleGetFileName(fileUrl)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Popconfirm
          title='Are you sure to delete this document?'
          onConfirm={() => handleDelete(record.documentId)}
          okText='Yes'
          cancelText='No'
        >
          <Button type='primary' danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ]

  return (
    <div>
      {documents.length > 0 && (
        <Table
          dataSource={documents}
          columns={columns}
          rowKey='documentId'
          pagination={false}
          loading={loading}
          bordered
          size='small'
          style={{
            fontSize: '12px'
          }}
        />
      )}
    </div>
  )
}

export default BookingDocuments
