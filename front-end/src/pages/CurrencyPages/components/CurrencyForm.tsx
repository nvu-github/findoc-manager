import React, { useCallback, useEffect } from 'react'
import { Form, Input, Button, InputNumber, message, DatePicker } from 'antd'
import dayjs from 'dayjs'

import { useAppDispatch } from '../../../stores/hook'
import { addCurrencyAsync, updateCurrencyAsync } from '../../../stores/slices/currency.slice'
import { Currency } from '../../../types'

interface CurrencyFormProps {
  isDrawerVisible: boolean
  currency?: Currency | undefined
  onSuccess: () => void
}

const rules = {
  currencyCode: [{ required: true, message: 'Please input currency code' }],
  date: [{ required: true, message: 'Please select a date' }],
  exchangeRate: [{ required: true, message: 'Please input exchange rate' }]
}

const CurrencyForm: React.FC<CurrencyFormProps> = ({ isDrawerVisible, currency, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const handleSubmit = async (values: Currency) => {
    try {
      if (currency?.currencyId) {
        const currencyId: any = currency.currencyId
        await dispatch(updateCurrencyAsync({ currencyId, updatedCurrency: values }))
        message.success('Currency updated successfully')
      } else {
        await dispatch(addCurrencyAsync(values))
        message.success('Currency created successfully')
      }
    } catch (error: any) {
      console.log('An error occurred', error)
      message.error(error || 'Failed to save currency')
    } finally {
      onSuccess()
    }
  }

  const handleSetDataEditCurrency = useCallback(() => {
    if (currency) {
      form.setFieldsValue({
        ...currency,
        date: dayjs(currency.date)
      })
    }
  }, [currency, form])

  useEffect(() => {
    handleSetDataEditCurrency()
    if (!isDrawerVisible && !currency?.currencyId) form.resetFields()
  }, [isDrawerVisible, currency, form, handleSetDataEditCurrency])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit} style={styles.form}>
      <Form.Item name='currencyCode' label='Currency Code' rules={rules.currencyCode}>
        <Input placeholder='e.g., USD' />
      </Form.Item>
      <Form.Item name='date' label='Date' rules={rules.date}>
        <DatePicker style={styles.fullWidth} format='YYYY-MM-DD' />
      </Form.Item>
      <Form.Item name='exchangeRate' label='Exchange Rate' rules={rules.exchangeRate}>
        <InputNumber style={styles.fullWidth} min={0} step={0.00001} />
      </Form.Item>
      <Button type='primary' htmlType='submit' style={styles.submitButton}>
        {currency?.currencyId ? 'Update Currency' : 'Create Currency'}
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

export default CurrencyForm
