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
    { title: 'Invoice Issuer', dataIndex: 'billerName', key: 'invoiceIssuerName' },
    { title: 'Invoice Recipient', dataIndex: 'companyName', key: 'invoiceRecipientName' },
    { title: 'Currency', dataIndex: 'currency', key: 'currency' },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount'
      // render: (amount: number) => amount.toFixed(2)
    },
    {
      title: 'Tax Amount',
      dataIndex: 'taxAmount',
      key: 'taxAmount'
      // render: (tax: number) => tax?.toFixed(2) || '0.00'
    },
    {
      title: 'Tax Rate',
      dataIndex: 'taxRate',
      key: 'taxRate'
      // render: (taxRate: number) => taxRate?.toFixed(5) || '0.00000'
    },
    { title: 'Expense Category', dataIndex: 'expenseCategory', key: 'expenseCategory' },
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus' },
    { title: 'Reference Number', dataIndex: 'referenceNumber', key: 'referenceNumber' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags' },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' }
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
