import React, { useEffect, useState } from 'react'
import { Table, Button, message, Popconfirm } from 'antd'
import axios from '../../../services/api'

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/bookings')
      setBookings(response.data.data)
    } catch (error) {
      console.log('Error fetching bookings', error)
      message.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const deleteBooking = async (id: number) => {
    try {
      await axios.delete(`/api/bookings/${id}`)
      message.success('Booking deleted successfully')
      fetchBookings()
    } catch (error) {
      console.log('Error deleting booking', error)
      message.error('Failed to delete booking')
    }
  }

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      render: (record: any) => (
        <>
          <Button type='link'>Edit</Button>
          <Popconfirm title='Are you sure to delete this booking?' onConfirm={() => deleteBooking(record.bookingId)}>
            <Button type='link' danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      )
    }
  ]

  return <Table dataSource={bookings} columns={columns} loading={loading} rowKey={(record: any) => record.id} />
}

export default BookingList
