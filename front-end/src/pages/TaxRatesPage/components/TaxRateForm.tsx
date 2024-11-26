import React, { useCallback, useEffect } from 'react'
import { Form, Input, Button, message, Select } from 'antd'

import { useAppDispatch } from '../../../stores/hook'
import { addTaxRateAsync, updateTaxRateAsync } from '../../../stores/slices'
import { TaxRate } from '../../../types'

interface TaxRateFormProps {
  isDrawerVisible: boolean
  taxRate?: TaxRate | undefined
  onSuccess: () => void
}

const rules = {
  region: [{ required: true, message: 'Please select a region' }],
  rate: [{ required: true, message: 'Please input the tax rate' }]
}

const TaxRateForm: React.FC<TaxRateFormProps> = ({ isDrawerVisible, taxRate, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const handleSubmit = async (values: TaxRate) => {
    try {
      if (taxRate?.taxRateId) {
        const taxRateId: any = taxRate.taxRateId
        await dispatch(updateTaxRateAsync({ taxRateId, updatedTaxRate: values }))
        message.success('Tax rate updated successfully')
      } else {
        await dispatch(addTaxRateAsync(values))
        message.success('Tax rate created successfully')
      }
    } catch (error: any) {
      console.log('An error occurred', error)
      message.error(error || 'Failed to save tax rate')
    } finally {
      onSuccess()
    }
  }

  const handleSetDataEditTaxRate = useCallback(() => {
    form.setFieldsValue(taxRate)
  }, [taxRate, form])

  useEffect(() => {
    handleSetDataEditTaxRate()
    if (!isDrawerVisible && !taxRate?.taxRateId) form.resetFields()
  }, [isDrawerVisible, taxRate, form, handleSetDataEditTaxRate])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit}>
      <Form.Item name='region' label='Region' rules={rules.region}>
        <Select placeholder='Select a region'>
          <Select.Option value='North America'>North America</Select.Option>
          <Select.Option value='Europe'>Europe</Select.Option>
          <Select.Option value='Asia'>Asia</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name='rate' label='Tax Rate' rules={rules.rate}>
        <Input type='number' step='0.01' min={0} />
      </Form.Item>
      <Form.Item name='description' label='Description'>
        <Input.TextArea rows={4} />
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {taxRate?.taxRateId ? 'Update Tax Rate' : 'Create Tax Rate'}
      </Button>
    </Form>
  )
}

export default TaxRateForm
