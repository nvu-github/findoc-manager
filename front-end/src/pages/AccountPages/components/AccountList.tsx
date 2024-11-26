import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteAccountAsync, getAllAccountsAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { Account } from '../../../types'

interface AccountListProps {
  handleAccountEdit: (account: Account) => void
  handleDrawerVisible: (visible: boolean) => void
}

const AccountList: React.FC<AccountListProps> = ({ handleAccountEdit, handleDrawerVisible }) => {
  const dispatch = useAppDispatch()
  const { accounts, loading } = useAppSelector((state) => state.account)

  const handleEditAccount = (account: Account) => {
    handleAccountEdit(account)
    handleDrawerVisible(true)
  }

  const deleteAccount = async (account: Account) => {
    try {
      const accountId = account.accountId as number
      await dispatch(deleteAccountAsync(accountId))
      message.success('Account deleted successfully')
      await dispatch(getAllAccountsAsync({}))
    } catch (error) {
      console.error('Error deleting account:', error)
      message.error('Failed to delete account')
    }
  }

  const columns = [
    { title: 'Account Name', dataIndex: 'accountName', key: 'accountName' },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Account Number', dataIndex: 'accountNumber', key: 'accountNumber' },
    { title: 'Currency', dataIndex: 'currency', key: 'currency' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={accounts}
      dataAction={{ titleConfirmDelete: 'Are you sure you want to delete this account?' }}
      isLoading={loading}
      handleEditRecord={handleEditAccount}
      handleDeleteRecord={deleteAccount}
    />
  )
}

export default AccountList
