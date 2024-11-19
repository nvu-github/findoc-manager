import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteBillerAsync, getAllBillersAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { Biller } from '../../../types'

interface BillerListProps {
  handleBillerEdit: any
  handleDrawerVisible: any
}

const BillerList: React.FC<BillerListProps> = (props) => {
  const { handleBillerEdit, handleDrawerVisible } = props
  const dispatch = useAppDispatch()
  const { billers, loading } = useAppSelector((state) => state.biller)

  const handleEditBiller = (biller: Biller) => {
    handleBillerEdit(biller)
    handleDrawerVisible(true)
  }

  const deleteBiller = async (biller: Biller) => {
    try {
      const billerId: any = biller.billerId
      await dispatch(deleteBillerAsync(billerId))
      message.success('Biller deleted successfully')
      await dispatch(getAllBillersAsync({}))
    } catch (error) {
      console.log('Error deleting biller', error)
      message.error('Failed to delete biller')
    }
  }

  const columns = [
    { title: 'Biller Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Biller type', dataIndex: 'billerType', key: 'taxId' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={billers}
      dataAction={{ titleConfirmDelete: 'Are you sure to delete this biller?' }}
      isLoading={loading}
      handleEditRecord={handleEditBiller}
      handleDeleteRecord={deleteBiller}
    />
  )
}

export default BillerList
