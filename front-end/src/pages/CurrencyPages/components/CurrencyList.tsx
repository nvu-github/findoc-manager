import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteCurrencyAsync, getAllCurrenciesAsync } from '../../../stores/slices/currency.slice'
import TableData from '../../../components/TableData'
import { Currency } from '../../../types'

interface CurrencyListProps {
  handleCurrencyEdit: any
  handleDrawerVisible: any
}

const CurrencyList: React.FC<CurrencyListProps> = (props) => {
  const { handleCurrencyEdit, handleDrawerVisible } = props
  const dispatch = useAppDispatch()
  const { currencies, loading } = useAppSelector((state) => state.currency)

  const handleEditCurrency = (currency: Currency) => {
    handleCurrencyEdit(currency)
    handleDrawerVisible(true)
  }

  const deleteCurrency = async (currency: Currency) => {
    try {
      const currencyId: any = currency.currencyId
      await dispatch(deleteCurrencyAsync(currencyId))
      message.success('Currency deleted successfully')
      await dispatch(getAllCurrenciesAsync())
    } catch (error) {
      console.log('Error deleting currency', error)
      message.error('Failed to delete currency')
    }
  }

  const columns = [
    { title: 'Currency Code', dataIndex: 'currencyCode', key: 'currencyCode' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date: string) => new Date(date).toLocaleDateString() },
    { title: 'Exchange Rate', dataIndex: 'exchangeRate', key: 'exchangeRate' }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={currencies}
      dataAction={{ titleConfirmDelete: 'Are you sure to delete this currency?' }}
      isLoading={loading}
      handleEditRecord={handleEditCurrency}
      handleDeleteRecord={deleteCurrency}
    />
  )
}

export default CurrencyList
