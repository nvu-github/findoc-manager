import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteCompanyAsync, getAllCompanyAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { Company } from '../../../types'

interface CompanyListProps {
  handleCompanyEdit: (company: Company) => void
  handleDrawerVisible: (visible: boolean) => void
}

const CompanyList: React.FC<CompanyListProps> = ({ handleCompanyEdit, handleDrawerVisible }) => {
  const dispatch = useAppDispatch()
  const { companies, loading } = useAppSelector((state) => state.company)

  const handleEditCompany = (company: Company) => {
    handleCompanyEdit(company)
    handleDrawerVisible(true)
  }

  const deleteCompany = async (company: Company) => {
    try {
      const companyId = company.companyId as number
      await dispatch(deleteCompanyAsync(companyId))
      message.success('Company deleted successfully')
      await dispatch(getAllCompanyAsync({}))
    } catch (error) {
      console.error('Error deleting company', error)
      message.error('Failed to delete company')
    }
  }

  const columns = [
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Tax ID', dataIndex: 'taxId', key: 'taxId' },
    { title: 'Default Currency', dataIndex: 'defaultCurrency', key: 'defaultCurrency' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={companies}
      dataAction={{ titleConfirmDelete: 'Are you sure you want to delete this company?' }}
      isLoading={loading}
      handleEditRecord={handleEditCompany}
      handleDeleteRecord={deleteCompany}
    />
  )
}

export default CompanyList
