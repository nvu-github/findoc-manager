import React, { useState, useEffect } from 'react'
import { Form, Input, InputNumber, DatePicker, Select, Button, message } from 'antd'
import axios from '../../../services/api'

import { Account, Booking, Company } from '../../../types'

const { Option } = Select

interface BookingFormProps {
  bookingId?: number
  onSuccess: () => void
}

const BookingForm: React.FC<BookingFormProps> = ({ bookingId, onSuccess }) => {
  const [form] = Form.useForm()
  const [companies, setCompanies] = useState([])
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    const fetchCompaniesAndAccounts = async () => {
      try {
        const [companiesRes, accountsRes] = await Promise.all([axios.get('/api/companies'), axios.get('/api/accounts')])
        setCompanies(companiesRes.data.data)
        setAccounts(accountsRes.data.data)
      } catch (err) {
        console.error('Error fetching companies and accounts: ', err)
        message.error('Failed to fetch data')
      }
    }
    fetchCompaniesAndAccounts()
  }, [])

  const handleSubmit = async (values: Booking) => {
    try {
      if (bookingId) {
        await axios.put(`/api/bookings/${bookingId}`, values)
        message.success('Booking updated successfully')
      } else {
        await axios.post('/api/bookings', values)
        message.success('Booking created successfully')
      }
      onSuccess()
    } catch (err) {
      console.error('Error saving booking: ', err)
      message.error('Failed to save booking')
    }
  }

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ currency: 'USD', conversionRate: 1 }}>
      <Form.Item name='date' label='Date' rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item name='amount' label='Amount' rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name='description' label='Description' rules={[{ required: true }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name='tax' label='Tax'>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name='tags' label='Tags'>
        <Input />
      </Form.Item>
      <Form.Item name='companyId' label='Company' rules={[{ required: true }]}>
        <Select placeholder='Select a company'>
          {companies.map((company: Company) => (
            <Option key={company.companyId} value={company.companyId}>
              {company.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='accountId' label='Account' rules={[{ required: true }]}>
        <Select placeholder='Select an account'>
          {accounts.map((account: Account) => (
            <Option key={account.acocuntId} value={account.acocuntId}>
              {account.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='currency' label='Currency'>
        <Select>
          <Option value='USD'>USD</Option>
          <Option value='EUR'>EUR</Option>
          <Option value='GBP'>GBP</Option>
        </Select>
      </Form.Item>
      <Form.Item name='conversionRate' label='Conversion Rate'>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {bookingId ? 'Update Booking' : 'Create Booking'}
      </Button>
    </Form>
  )
}

export default BookingForm
