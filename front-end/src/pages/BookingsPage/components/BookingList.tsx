import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteBookingAsync, getAllBookingsAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { Booking } from '../../../types'

interface BookingListProps {
  handleBookingEdit: (booking: Booking) => void
  handleDrawerVisible: (visible: boolean) => void
}

const BookingList: React.FC<BookingListProps> = ({ handleBookingEdit, handleDrawerVisible }) => {
  const dispatch = useAppDispatch()
  const { bookings, loading } = useAppSelector((state) => state.booking)

  const handleEditBooking = (booking: Booking) => {
    handleBookingEdit(booking)
    handleDrawerVisible(true)
  }

  const deleteBooking = async (booking: Booking) => {
    try {
      const bookingId: any = booking.bookingId
      await dispatch(deleteBookingAsync(bookingId))
      message.success('Booking deleted successfully')
      await dispatch(getAllBookingsAsync({}))
    } catch (error) {
      console.log('Error deleting booking', error)
      message.error('Failed to delete booking')
    }
  }

  const columns = [
    { title: 'Company', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Account', dataIndex: 'accountName', key: 'accountName' },
    { title: 'Biller', dataIndex: 'billerName', key: 'billerName' },
    { title: 'Currency code', dataIndex: 'currencyCode', key: 'currencyCode' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date: string) => new Date(date).toLocaleDateString() },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Tag', dataIndex: 'tags', key: 'tags' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={bookings}
      dataAction={{ titleConfirmDelete: 'Are you sure to delete this booking?' }}
      isLoading={loading}
      handleEditRecord={handleEditBooking}
      handleDeleteRecord={deleteBooking}
    />
  )
}

export default BookingList
