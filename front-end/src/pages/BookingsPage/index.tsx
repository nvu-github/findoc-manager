import React from 'react'
import { Button, Modal } from 'antd'

import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'

const BookingsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  return (
    <div>
      <Button type='primary' onClick={() => setIsModalVisible(true)}>
        Add Booking
      </Button>
      <BookingList />
      <Modal title='Add Booking' open={isModalVisible} onCancel={handleModalClose} footer={null}>
        <BookingForm onSuccess={handleModalClose} />
      </Modal>
    </div>
  )
}

export default BookingsPage
