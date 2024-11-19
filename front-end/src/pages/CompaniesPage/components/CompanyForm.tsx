import React, { useCallback, useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'

import { useAppDispatch } from '../../../stores/hook'
import { addCompanyAsync, updateCompanyAsync } from '../../../stores/slices'
import { Company } from '../../../types'

interface CompanyFormProps {
  isDrawerVisible: boolean
  company?: Company | undefined
  onSuccess: () => void
}

const rules = {
  name: [{ required: true, message: 'Please input company name' }]
}

const CompanyForm: React.FC<CompanyFormProps> = ({ isDrawerVisible, company, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const handleSubmit = async (values: Company) => {
    try {
      if (company?.companyId) {
        const companyId: any = company.companyId
        await dispatch(updateCompanyAsync({ companyId, updatedCompany: values }))
        message.success('Company updated successfully')
      } else {
        await dispatch(addCompanyAsync(values))
        message.success('Company created successfully')
      }
    } catch (error: any) {
      console.log('An error occurred', error)
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
      <Form.Item name='name' label='Company Name' rules={rules.name}>
        <Input />
      </Form.Item>
      <Form.Item name='address' label='Address'>
        <Input />
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {company?.companyId ? 'Update Company' : 'Create Company'}
      </Button>
    </Form>
  )
}

export default CompanyForm
