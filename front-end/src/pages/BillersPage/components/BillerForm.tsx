import React, { useCallback, useEffect } from 'react'
import { Form, Input, Button, Select, message } from 'antd'

import { useAppDispatch } from '../../../stores/hook'
import { addBillerAsync, updateBillerAsync } from '../../../stores/slices'
import { Biller } from '../../../types'
import { BILLER_TYPES } from '../../../constants'

interface BillerFormProps {
  isDrawerVisible: boolean
  biller?: Biller | undefined
  onSuccess: () => void
}

const { Option } = Select

const rules = {
  name: [{ required: true, message: 'Please input the biller name' }],
  address: [{ required: false, message: 'Please input the address' }],
  billerType: [{ required: true, message: 'Please select the biller type' }]
}

const BillerForm: React.FC<BillerFormProps> = ({ isDrawerVisible, biller, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const handleSubmit = async (values: any) => {
    try {
      if (biller?.billerId) {
        const billerId: any = biller.billerId
        await dispatch(updateBillerAsync({ billerId, updatedBiller: values }))
        message.success('Biller updated successfully')
      } else {
        await dispatch(addBillerAsync(values))
        message.success('Biller created successfully')
      }
    } catch (error: any) {
      console.log('An error occurred', error)
      message.error(error || 'Failed to save biller')
    } finally {
      onSuccess()
    }
  }

  const handleSetDataEditBiller = useCallback(() => {
    if (biller) {
      form.setFieldsValue({
        ...biller,
        billerType: biller.billerType || undefined
      })
    }
  }, [biller, form])

  useEffect(() => {
    handleSetDataEditBiller()
    if (!isDrawerVisible && !biller?.billerId) form.resetFields()
  }, [isDrawerVisible, biller, form, handleSetDataEditBiller])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit} style={styles.form}>
      <Form.Item name='name' label='Biller Name' rules={rules.name}>
        <Input />
      </Form.Item>
      <Form.Item name='address' label='Address' rules={rules.address}>
        <Input />
      </Form.Item>
      <Form.Item name='billerType' label='Biller Type' rules={rules.billerType}>
        <Select placeholder='Select a biller type'>
          {BILLER_TYPES.map((type) => {
            return (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
      <Button type='primary' htmlType='submit' style={styles.submitButton}>
        {biller?.billerId ? 'Update Biller' : 'Create Biller'}
      </Button>
    </Form>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  submitButton: {
    marginTop: '16px'
  }
}

export default BillerForm
