import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteCompanyAsync, getAllCompanyAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { Company } from '../../../types'

interface CompanyListProps {
  handleCompanyEdit: any
  handleDrawerVisible: any
}

const CompanyList: React.FC<CompanyListProps> = (props) => {
  const { handleCompanyEdit, handleDrawerVisible } = props
  const dispatch = useAppDispatch()
  const { companies, loading } = useAppSelector((state) => state.company)

  const handleEditCompany = (company: Company) => {
    handleCompanyEdit(company)
    handleDrawerVisible(true)
  }

  const deleteCompany = async (company: Company) => {
    try {
      const companyId: any = company.companyId
      await dispatch(deleteCompanyAsync(companyId))
      message.success('Booking deleted successfully')
      await dispatch(getAllCompanyAsync({}))
    } catch (error) {
      console.log('Error deleting booking', error)
      message.error('Failed to delete booking')
    }
  }

  const columns = [
    { title: 'Company Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={companies}
      dataAction={{ titleConfirmDelete: 'Are you sure to delete this company?' }}
      isLoading={loading}
      handleEditRecord={handleEditCompany}
      handleDeleteRecord={deleteCompany}
    />
  )
}

export default CompanyList
