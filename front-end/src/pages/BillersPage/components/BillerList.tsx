import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteBillerAsync, getAllBillersAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { Biller } from '../../../types'
import { BILLER_TYPES } from '../../../constants'
import { getLableConstant } from '../../../utils'

interface BillerListProps {
  handleBillerEdit: (biller: Biller) => void
  handleDrawerVisible: (visible: boolean) => void
}

const BillerList: React.FC<BillerListProps> = ({ handleBillerEdit, handleDrawerVisible }) => {
  const dispatch = useAppDispatch()
  const { billers, loading } = useAppSelector((state) => state.biller)

  const handleEditBiller = (biller: Biller) => {
    handleBillerEdit(biller)
    handleDrawerVisible(true)
  }

  const deleteBiller = async (biller: Biller) => {
    try {
      const billerId = biller.billerId as number
      await dispatch(deleteBillerAsync(billerId))
      message.success('Biller deleted successfully')
      await dispatch(getAllBillersAsync({}))
    } catch (error) {
      console.error('Error deleting biller:', error)
      message.error('Failed to delete biller')
    }
  }


  const columns = [
    { title: 'Biller Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Biller Type',
      dataIndex: 'billerType',
      key: 'billerType',
      render: (billerType: string) => getLableConstant(BILLER_TYPES, billerType)
    },
    { title: 'Tax ID', dataIndex: 'taxId', key: 'taxId' },
    { title: 'Default Currency', dataIndex: 'defaultCurrency', key: 'defaultCurrency' },
    { title: 'Contact Info', dataIndex: 'contactInfo', key: 'contactInfo' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={billers}
      dataAction={{ titleConfirmDelete: 'Are you sure you want to delete this biller?' }}
      isLoading={loading}
      handleEditRecord={handleEditBiller}
      handleDeleteRecord={deleteBiller}
    />
  )
}

export default BillerList
