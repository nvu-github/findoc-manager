import React from 'react'
import { Form, Input, Button, message } from 'antd'
import axios from '../../../services/api'
import { Company } from '../../../types'

interface CompanyFormProps {
  companyId?: number
  onSuccess: () => void
}

const CompanyForm: React.FC<CompanyFormProps> = ({ companyId, onSuccess }) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values: Company) => {
    try {
      if (companyId) {
        await axios.put(`/api/companies/${companyId}`, values)
        message.success('Company updated successfully')
      } else {
        await axios.post('/api/companies', values)
        message.success('Company created successfully')
      }
      onSuccess()
    } catch (error) {
      console.log('An error occurred', error)
      message.error('Failed to save company')
    }
  }

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit}>
      <Form.Item name='name' label='Company Name' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='country' label='Country'>
        <Input />
      </Form.Item>
      <Form.Item name='defaultCurrency' label='Default Currency'>
        <Input placeholder='e.g., USD' />
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {companyId ? 'Update Company' : 'Create Company'}
      </Button>
    </Form>
  )
}

export default CompanyForm
