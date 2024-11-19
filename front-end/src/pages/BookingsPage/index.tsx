import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Row } from 'antd'

import { useAppDispatch } from '../../stores/hook'
import { getAllAccountsAsync, getAllBillersAsync, getAllBookingsAsync, getAllCompanyAsync } from '../../stores/slices'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import { Booking } from '../../types'
import { getAllCurrenciesAsync } from '../../stores/slices/currency.slice'

const BookingsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [bookingEdit, setBookingEdit] = useState<Booking | undefined>()

  const handleDrawerClose = (isOnSuccess?: boolean) => {
    setBookingEdit(undefined)
    setIsDrawerVisible(false)
    if (isOnSuccess) {
      dispatch(getAllBookingsAsync({}))
    }
  }

  useEffect(() => {
    dispatch(getAllBookingsAsync({}))
    dispatch(getAllAccountsAsync({}))
    dispatch(getAllCompanyAsync({}))
    dispatch(getAllBillersAsync({}))
    dispatch(getAllCurrenciesAsync())
  }, [dispatch])

  return (
    <div>
      <Row style={styles.fullWidth}>
        <Col span={24}>
          <h1>Manage Bookings</h1>
        </Col>
      </Row>
      <Row justify='end' style={styles.addButtonRow}>
        <Col>
          <Button type='primary' onClick={() => setIsDrawerVisible(true)}>
            Add Booking
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <BookingList handleBookingEdit={setBookingEdit} handleDrawerVisible={setIsDrawerVisible} />
        </Col>
      </Row>
      <Drawer
        title={bookingEdit ? 'Edit Booking' : 'Add Booking'}
        onClose={() => handleDrawerClose()}
        open={isDrawerVisible}
      >
        <BookingForm
          isDrawerVisible={isDrawerVisible}
          booking={bookingEdit}
          onSuccess={() => handleDrawerClose(true)}
        />
      </Drawer>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  fullWidth: {
    width: '100%'
  },
  addButtonRow: {
    marginBottom: '16px',
    width: '100%'
  }
}

export default BookingsPage
