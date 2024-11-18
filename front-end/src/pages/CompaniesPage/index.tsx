import React, { useState } from 'react'
import { Button, Modal } from 'antd'

import CompanyForm from './components/CompanyForm'

const CompaniesPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Manage Companies</h1>
      <Button type='primary' onClick={() => setIsModalVisible(true)}>
        Add Company
      </Button>
      <Modal title='Add Company' open={isModalVisible} onCancel={handleModalClose} footer={null}>
        <CompanyForm onSuccess={handleModalClose} />
      </Modal>
    </div>
  )
}

export default CompaniesPage
