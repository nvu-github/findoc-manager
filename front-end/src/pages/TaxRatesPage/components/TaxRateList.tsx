import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteTaxRateAsync, getAllTaxRatesAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { TaxRate } from '../../../types'

interface TaxRateListProps {
  handleTaxRateEdit: (taxRate: TaxRate) => void
  handleDrawerVisible: (visible: boolean) => void
  loading: boolean
}

const TaxRateList: React.FC<TaxRateListProps> = ({ handleTaxRateEdit, handleDrawerVisible, loading }) => {
  const dispatch = useAppDispatch()
  const { taxRates } = useAppSelector((state) => state.taxRate)

  const handleEditTaxRate = (taxRate: TaxRate) => {
    handleTaxRateEdit(taxRate)
    handleDrawerVisible(true)
  }

  const deleteTaxRate = async (taxRate: TaxRate) => {
    try {
      const taxRateId = taxRate.taxRateId as number
      await dispatch(deleteTaxRateAsync(taxRateId))
      message.success('Tax rate deleted successfully')
      await dispatch(getAllTaxRatesAsync({}))
    } catch (error) {
      console.error('Error deleting tax rate:', error)
      message.error('Failed to delete tax rate')
    }
  }

  const columns = [
    { title: 'Region', dataIndex: 'region', key: 'region' },
    { title: 'Rate', dataIndex: 'rate', key: 'rate', render: (text: number) => `${text}%` },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={taxRates}
      dataAction={{ titleConfirmDelete: 'Are you sure you want to delete this tax rate?' }}
      isLoading={loading}
      handleEditRecord={handleEditTaxRate}
      handleDeleteRecord={deleteTaxRate}
    />
  )
}

export default TaxRateList
