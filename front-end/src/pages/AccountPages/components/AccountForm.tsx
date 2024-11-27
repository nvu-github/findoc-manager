import React, { useCallback, useEffect } from 'react'
import { Form, Input, Button, message, Select } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { addAccountAsync, updateAccountAsync, getAllCompanyAsync } from '../../../stores/slices'
import { Account, Company, Currency } from '../../../types'

interface AccountFormProps {
  isDrawerVisible: boolean
  account?: Account | undefined
  onSuccess: () => void
}

const rules = {
  companyId: [{ required: true, message: 'Please select a company' }],
  accountName: [{ required: true, message: 'Please input account name' }],
  accountNumber: [{ required: true, message: 'Please input account number' }],
  currency: [{ required: true, message: 'Please select a currency' }]
}

const AccountForm: React.FC<AccountFormProps> = ({ isDrawerVisible, account, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const companies = useAppSelector((state) => state.company.companies)
  const currencies = useAppSelector((state) => state.currency.currencies)

  const handleSubmit = async (values: Account) => {
    try {
      if (account?.accountId) {
        const accountId: any = account.accountId
        await dispatch(updateAccountAsync({ accountId, updatedAccount: values }))
        message.success('Account updated successfully')
      } else {
        await dispatch(addAccountAsync(values))
        message.success('Account created successfully')
      }
    } catch (error: any) {
      console.log('An error occurred', error)
      message.error(error || 'Failed to save account')
    } finally {
      onSuccess()
    }
  }

  const handleSetDataEditAccount = useCallback(() => {
    form.setFieldsValue(account)
  }, [account, form])

  useEffect(() => {
    handleSetDataEditAccount()
    if (!isDrawerVisible && !account?.accountId) form.resetFields()
  }, [isDrawerVisible, account, form, handleSetDataEditAccount])

  useEffect(() => {
    dispatch(getAllCompanyAsync({}))
  }, [dispatch])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit}>
      <Form.Item name='companyId' label='Company' rules={rules.companyId}>
        <Select placeholder='Select a company'>
          {companies.map((company: Company) => (
            <Select.Option key={company.companyId} value={company.companyId}>
              {company.companyName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='accountName' label='Account Name' rules={rules.accountName}>
        <Input />
      </Form.Item>
      <Form.Item name='accountNumber' label='Account Number' rules={rules.accountNumber}>
        <Input />
      </Form.Item>
      <Form.Item name='currency' label='Currency' rules={rules.currency}>
        <Select placeholder='Select a currency'>
          {currencies.length > 0 &&
            currencies.map((currency: Currency) => (
              <Select.Option value={currency.currencyCode}>{currency.currencyCode}</Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {account?.accountId ? 'Update Account' : 'Create Account'}
      </Button>
    </Form>
  )
}

export default AccountForm
