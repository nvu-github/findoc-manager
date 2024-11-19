import React, { useEffect, useCallback } from 'react'
import { Form, Input, Button, message, Select, DatePicker, InputNumber, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { addBookingAsync, updateBookingAsync, addBookingDocuments } from '../../../stores/slices'
import { Booking } from '../../../types'

interface BookingFormProps {
  isDrawerVisible: boolean
  booking?: Booking | undefined
  onSuccess: () => void
}

const rules = {
  companyId: [{ required: true, message: 'Please select a company' }],
  accountId: [{ required: true, message: 'Please select an account' }],
  billerId: [{ required: true, message: 'Please select a biller' }],
  date: [{ required: true, message: 'Please select a date' }],
  amount: [{ required: true, message: 'Please enter an amount' }],
  currencyId: [{ required: true, message: 'Please select a currency' }]
}

const BookingForm: React.FC<BookingFormProps> = ({ isDrawerVisible, booking, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.booking)
  const companies = useAppSelector((state) => state.company.companies)
  const accounts = useAppSelector((state) => state.account.accounts)
  const billers = useAppSelector((state) => state.biller.billers)
  const currencies = useAppSelector((state) => state.currency.currencies)

  const handleSubmit = async (values: any) => {
    try {
      let bookingId
      if (booking?.bookingId) {
        bookingId = booking.bookingId
        await dispatch(updateBookingAsync({ bookingId, updatedBooking: values }))
      } else {
        const response = await dispatch(addBookingAsync(values)).unwrap()
        bookingId = response
      }

      if (values.attachment && values.attachment.length > 0) {
        const formData = new FormData()
        values.attachment.forEach((file: any) => {
          if (file.originFileObj) {
            formData.append('files', file.originFileObj)
          }
        })

        await dispatch(addBookingDocuments({ bookingId, formData }))
      }
      message.success(`Booking ${booking?.bookingId ? 'updated' : 'created'} successfully`)
    } catch (error: any) {
      console.log('An error occurred', error)
      message.error(error || 'Failed to save booking')
    } finally {
      onSuccess()
    }
  }

  const handleSetDataEditBooking = useCallback(() => {
    if (booking) {
      form.setFieldsValue({
        ...booking,
        date: dayjs(booking.date),
        attachment: []
      })
    }
  }, [booking, form])

  useEffect(() => {
    handleSetDataEditBooking()
    if (!isDrawerVisible && !booking?.bookingId) form.resetFields()
  }, [isDrawerVisible, booking, form, handleSetDataEditBooking])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit} style={styles.form}>
      <Form.Item name='companyId' label='Company' rules={rules.companyId}>
        <Select placeholder='Select a company'>
          {companies.map((company) => (
            <Select.Option key={company.companyId} value={company.companyId}>
              {company.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='accountId' label='Account' rules={rules.accountId}>
        <Select placeholder='Select an account'>
          {accounts.map((account) => (
            <Select.Option key={account.accountId} value={account.accountId}>
              {account.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='billerId' label='Biller' rules={rules.billerId}>
        <Select placeholder='Select a biller'>
          {billers.map((biller) => (
            <Select.Option key={biller.billerId} value={biller.billerId}>
              {biller.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='date' label='Date' rules={rules.date}>
        <DatePicker style={styles.fullWidth} />
      </Form.Item>
      <Form.Item name='amount' label='Amount' rules={rules.amount}>
        <InputNumber style={styles.fullWidth} min={0} step={0.01} />
      </Form.Item>
      <Form.Item name='currencyId' label='Currency' rules={rules.currencyId}>
        <Select
          showSearch
          placeholder='Select a currency'
          optionFilterProp='children'
          filterOption={(input, option: any) => option?.children.toLowerCase().includes(input.toLowerCase())}
          allowClear
        >
          {currencies.map((currency) => (
            <Select.Option key={currency.currencyId} value={currency.currencyId}>
              {currency.currencyCode}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='description' label='Description'>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name='tax' label='Tax'>
        <InputNumber style={styles.fullWidth} min={0} step={0.01} />
      </Form.Item>
      <Form.Item name='taxRate' label='Tax Rate'>
        <InputNumber style={styles.fullWidth} min={0} step={0.01} />
      </Form.Item>
      <Form.Item name='tags' label='Tags'>
        <Input placeholder='e.g., Utilities, Office' />
      </Form.Item>
      <Form.Item
        label='Attachment'
        name='attachment'
        valuePropName='fileList'
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e
          }
          return e && e.fileList
        }}
      >
        <Upload name='file' listType='text' beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      <Button disabled={loading} type='primary' htmlType='submit' style={styles.submitButton}>
        {booking?.bookingId ? 'Update Booking' : 'Create Booking'}
      </Button>
    </Form>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  fullWidth: {
    width: '100%'
  },
  submitButton: {
    marginTop: '16px'
  }
}

export default BookingForm
