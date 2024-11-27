import React, { useEffect, useCallback } from 'react'
import { Form, Input, Button, message, Select, DatePicker, InputNumber, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import {
  addBookingAsync,
  updateBookingAsync,
  addBookingDocuments,
  getDocumentsByBookingId
} from '../../../stores/slices'
import { Booking } from '../../../types'
import { BILLER_TYPES, PAYMENT_STATUSES } from '../../../constants'
import { getLableConstant } from '../../../utils'
import BookingDocuments from './DocumentList'

interface BookingFormProps {
  isDrawerVisible: boolean
  booking?: Booking
  onSuccess: () => void
}

const rules = {
  accountId: [{ required: true, message: 'Please select an account' }],
  invoiceIssuerId: [{ required: true, message: 'Please select an invoice issuer' }],
  invoiceRecipientId: [{ required: true, message: 'Please select an invoice recipient' }],
  entryDate: [{ required: true, message: 'Please select an entry date' }],
  invoiceDate: [{ required: true, message: 'Please select an invoice date' }],
  totalAmount: [{ required: true, message: 'Please enter the total amount' }],
  taxAmount: [{ required: true, message: 'Please enter the tax amount' }],
  taxRate: [{ required: true, message: 'Please enter the tax rate' }],
  expenseCategory: [{ required: true, message: 'Please enter the expense category' }],
  currency: [{ required: true, message: 'Please select a currency' }],
  paymentStatus: [{ required: true, message: 'Please select a payment status' }],
  referenceNumber: [{ required: true, message: 'Please enter a reference number' }]
}

const BookingForm: React.FC<BookingFormProps> = ({ isDrawerVisible, booking, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.booking)
  const companies = useAppSelector((state) => state.company.companies)
  const accounts = useAppSelector((state) => state.account.accounts)
  const billers = useAppSelector((state) => state.biller.billers)
  const currencies = useAppSelector((state) => state.currency.currencies)
  const taxRates = useAppSelector((state) => state.taxRate.taxRates)

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
    form.setFieldsValue({
      ...booking,
      entryDate: dayjs(booking?.entryDate),
      invoiceDate: dayjs(booking?.invoiceDate),
      invoiceReceivedDate: booking?.invoiceReceivedDate && dayjs(booking?.invoiceReceivedDate),
      dueDate: dayjs(booking?.dueDate),
      attachment: []
    })
    dispatch(getDocumentsByBookingId(Number(booking?.bookingId)))
  }, [booking, form, dispatch])

  const handleChangeRateRegion = (taxRateId: number) => {
    const taxRateRegion = taxRates.find((taxRate) => taxRate.taxRateId === taxRateId)
    form.setFieldsValue({ taxRate: taxRateRegion?.rate })
  }

  useEffect(() => {
    if (isDrawerVisible && booking) {
      handleSetDataEditBooking()
    }
    if (!isDrawerVisible && !booking?.bookingId) form.resetFields()
  }, [isDrawerVisible, booking, form, handleSetDataEditBooking])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit} style={styles.form}>
      <Form.Item name='accountId' label='Account' rules={rules.accountId}>
        <Select placeholder='Select an account'>
          {accounts.map((account) => (
            <Select.Option key={account.accountId} value={account.accountId}>
              {account.accountName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='invoiceIssuerId' label='Invoice Issuer' rules={rules.invoiceIssuerId}>
        <Select placeholder='Select an invoice issuer'>
          {billers.map((biller) => (
            <Select.Option key={biller.billerId} value={biller.billerId}>
              {biller.name} - {getLableConstant(BILLER_TYPES, biller.billerType)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='invoiceRecipientId' label='Invoice Recipient' rules={rules.invoiceRecipientId}>
        <Select placeholder='Select an invoice recipient'>
          {companies.map((company) => (
            <Select.Option key={company.companyId} value={company.companyId}>
              {company.companyName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='entryDate' label='Entry Date' rules={rules.entryDate}>
        <DatePicker style={styles.fullWidth} />
      </Form.Item>
      <Form.Item name='invoiceDate' label='Invoice Date' rules={rules.invoiceDate}>
        <DatePicker style={styles.fullWidth} />
      </Form.Item>
      <Form.Item name='invoiceReceivedDate' label='Invoice Received Date'>
        <DatePicker style={styles.fullWidth} />
      </Form.Item>
      <Form.Item name='totalAmount' label='Total Amount' rules={rules.totalAmount}>
        <InputNumber style={styles.fullWidth} min={0} step={0.01} />
      </Form.Item>
      <Form.Item name='taxAmount' label='Tax Amount' rules={rules.taxAmount}>
        <InputNumber style={styles.fullWidth} min={0} step={0.01} />
      </Form.Item>
      <Form.Item name='taxRateId' label='Tax Region'>
        <Select placeholder='Select Tax Rate' onChange={(e) => handleChangeRateRegion(e)}>
          {taxRates.map((taxRate) => (
            <Select.Option key={taxRate.taxRateId} value={taxRate.taxRateId}>
              {taxRate.region} - {Number(taxRate?.rate).toFixed(2)}%
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='taxRate' label='Tax Rate' rules={rules.taxRate}>
        <InputNumber style={styles.fullWidth} min={0} step={0.01} />
      </Form.Item>
      <Form.Item name='expenseCategory' label='Expense Category' rules={rules.expenseCategory}>
        <Input placeholder='e.g., Office Supplies' />
      </Form.Item>
      <Form.Item name='paymentStatus' label='Payment Status' rules={rules.paymentStatus}>
        <Select placeholder='Select Payment Status'>
          {PAYMENT_STATUSES.map((status) => (
            <Select.Option key={status.value} value={status.value}>
              {status.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='referenceNumber' label='Reference Number' rules={rules.referenceNumber}>
        <Input />
      </Form.Item>
      <Form.Item name='tags' label='Tags'>
        <Input placeholder='e.g., Utilities, Office' />
      </Form.Item>
      <Form.Item name='currency' label='Currency' rules={rules.currency}>
        <Select showSearch placeholder='Select a currency' optionFilterProp='children'>
          {currencies.map((currency) => (
            <Select.Option key={currency.currencyCode} value={currency.currencyCode}>
              {currency.currencyCode}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='dueDate' label='Due Date'>
        <DatePicker style={styles.fullWidth} />
      </Form.Item>
      <Form.Item name='notes' label='Notes'>
        <Input.TextArea />
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
      {booking?.bookingId && <BookingDocuments bookingId={Number(booking?.bookingId)} />}
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
