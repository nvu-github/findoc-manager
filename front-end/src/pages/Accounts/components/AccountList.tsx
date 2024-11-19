import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteAccountAsync, getAllAccountsAsync } from '../../../stores/slices'
import TableData from '../../../components/TableData'
import { Account } from '../../../types'

interface AccountListProps {
  handleAccountEdit: any
  handleDrawerVisible: any
}

const AccountList: React.FC<AccountListProps> = (props) => {
  const { handleAccountEdit, handleDrawerVisible } = props
  const dispatch = useAppDispatch()
  const { accounts, loading } = useAppSelector((state) => state.account)

  const handleEditAccount = (account: Account) => {
    handleAccountEdit(account)
    handleDrawerVisible(true)
  }

  const deleteAccount = async (account: Account) => {
    try {
      const accountId: any = account.accountId
      await dispatch(deleteAccountAsync(accountId))
      message.success('Account deleted successfully')
      await dispatch(getAllAccountsAsync({}))
    } catch (error) {
      console.log('Error deleting account', error)
      message.error('Failed to delete account')
    }
  }

  const columns = [
    { title: 'Account Name', dataIndex: 'name', key: 'name' },
    { title: 'Company name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={accounts}
      dataAction={{ titleConfirmDelete: 'Are you sure to delete this account?' }}
      isLoading={loading}
      handleEditRecord={handleEditAccount}
      handleDeleteRecord={deleteAccount}
    />
  )
}

export default AccountList
