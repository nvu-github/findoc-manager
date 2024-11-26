import React, { useCallback, useEffect } from 'react'
import { Form, Input, Button, message, Select } from 'antd'

import { useAppDispatch } from '../../../stores/hook'
import { addCompanyAsync, updateCompanyAsync } from '../../../stores/slices'
import { Company } from '../../../types'

interface CompanyFormProps {
  isDrawerVisible: boolean
  company?: Company | undefined
  onSuccess: () => void
}

const rules = {
  company_name: [{ required: true, message: 'Please input company name' }],
  tax_id: [{ required: true, message: 'Please input tax ID' }],
  default_currency: [{ required: true, message: 'Please select a default currency' }]
}

const CompanyForm: React.FC<CompanyFormProps> = ({ isDrawerVisible, company, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const handleSubmit = async (values: Company) => {
    try {
      if (company?.companyId) {
        const companyId = company.companyId as number
        await dispatch(updateCompanyAsync({ companyId, updatedCompany: values }))
        message.success('Company updated successfully')
      } else {
        await dispatch(addCompanyAsync(values))
        message.success('Company created successfully')
      }
    } catch (error: any) {
      console.error('An error occurred:', error)
      message.error(error || 'Failed to save company')
    } finally {
      onSuccess()
    }
  }

  const handleSetDataEditCompany = useCallback(() => {
    form.setFieldsValue(company)
  }, [company, form])

  useEffect(() => {
    handleSetDataEditCompany()
    if (!isDrawerVisible && !company?.companyId) form.resetFields()
  }, [isDrawerVisible, company, form, handleSetDataEditCompany])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit}>
      <Form.Item name='companyName' label='Company Name' rules={rules.company_name}>
        <Input />
      </Form.Item>
      <Form.Item name='address' label='Address'>
        <Input />
      </Form.Item>
      <Form.Item name='taxId' label='Tax ID' rules={rules.tax_id}>
        <Input />
      </Form.Item>
      <Form.Item name='defaultCurrency' label='Default Currency' rules={rules.default_currency}>
        <Select placeholder='Select a currency'>
          <Select.Option value='USD'>USD</Select.Option>
          <Select.Option value='EUR'>EUR</Select.Option>
          <Select.Option value='JPY'>JPY</Select.Option>
        </Select>
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {company?.companyId ? 'Update Company' : 'Create Company'}
      </Button>
    </Form>
  )
}

export default CompanyForm
