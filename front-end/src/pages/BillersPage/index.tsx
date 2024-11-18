import React, { useState } from 'react'
import { Button, Modal } from 'antd'

import BillerForm from './components/BillerForm'

const BillersPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Manage Billers</h1>
      <Button type='primary' onClick={() => setIsModalVisible(true)}>
        Add Biller
      </Button>
      <Modal title='Add Biller' open={isModalVisible} onCancel={handleModalClose} footer={null}>
        <BillerForm onSuccess={handleModalClose} />
      </Modal>
    </div>
  )
}

export default BillersPage
