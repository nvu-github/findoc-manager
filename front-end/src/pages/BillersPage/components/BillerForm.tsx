import React from 'react'
import { Form, Input, Button, message } from 'antd'
import axios from '../../../services/api'
import { Biller } from '../../../types'

interface BillerFormProps {
  billerId?: number
  onSuccess: () => void
}

const BillerForm: React.FC<BillerFormProps> = ({ billerId, onSuccess }) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values: Biller) => {
    try {
      if (billerId) {
        await axios.put(`/api/billers/${billerId}`, values)
        message.success('Biller updated successfully')
      } else {
        await axios.post('/api/billers', values)
        message.success('Biller created successfully')
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving biller:', error)
      message.error('Failed to save biller')
    }
  }

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit}>
      <Form.Item name='name' label='Biller Name' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='address' label='Address'>
        <Input />
      </Form.Item>
      <Form.Item name='taxId' label='Tax ID'>
        <Input />
      </Form.Item>
      <Form.Item name='defaultCurrency' label='Default Currency'>
        <Input placeholder='e.g., USD' />
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {billerId ? 'Update Biller' : 'Create Biller'}
      </Button>
    </Form>
  )
}

export default BillerForm
