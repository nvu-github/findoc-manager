import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import * as _ from 'lodash'
import { RootState } from '../../stores/store'
import { useAppDispatch, useAppSelector } from '../../stores/hook'
import { getAllAccountsAsync, getAllBillersAsync, getAllBookingsAsync, getAllCompanyAsync } from '../../stores/slices'
import { Booking } from '../../types'
import RevenueCharts from './components/RevenueCharts'
import BookingsTable from './components/BookingsTable'
import Filters from './components/Filters'
import StatCards from './components/StatCards'

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { bookings, loading } = useAppSelector((state: RootState) => state.booking)
  const { companies } = useAppSelector((state: RootState) => state.company)
  const { accounts } = useAppSelector((state: RootState) => state.account)
  const { billers } = useAppSelector((state: RootState) => state.biller)

  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string[]>([])
  const [selectedBiller, setSelectedBiller] = useState<string[]>([])
  const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null)

  const initialPagination = { current: 1, pageSize: 10, total: 0 }
  const [pagination, setPagination] = useState(initialPagination)

  const columns = [
    { title: 'Company', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Account', dataIndex: 'accountName', key: 'accountName' },
    { title: 'Biller', dataIndex: 'billerName', key: 'billerName' },
    { title: 'Currency code', dataIndex: 'currencyCode', key: 'currencyCode' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount: number) => `$${amount}` },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date: string) => dayjs(date).format('MM/DD/YYYY') }
  ]

  const handleFilter = _.debounce((overridePagination = pagination) => {
    const filters: any = {}
    if (selectedCompany) filters.companyId = selectedCompany
    if (selectedAccount.length) filters.accountId = selectedAccount
    if (selectedBiller.length) filters.billerId = selectedBiller
    if (selectedDates) {
      filters.startDate = selectedDates[0].format('YYYY-MM-DD')
      filters.endDate = selectedDates[1].format('YYYY-MM-DD')
    }

    const { current, pageSize } = overridePagination

    dispatch(
      getAllBookingsAsync({
        filters,
        page: current,
        pageSize
      })
    ).then((response: any) => {
      if (response?.payload) {
        const { payload } = response
        setFilteredBookings(payload.data)
        setPagination({ ...overridePagination, total: payload.meta.total })
      }
    })
  }, 500)

  const handleTableChange = (newPagination: any) => {
    const updatedPagination = {
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }

    setPagination(updatedPagination)
    handleFilter(updatedPagination)
  }

  const handleResetFilters = () => {
    setSelectedCompany(null)
    setSelectedAccount([])
    setSelectedBiller([])
    setSelectedDates(null)
    setStartDate(null)
    handleFilter(initialPagination)
  }

  useEffect(() => {
    dispatch(getAllBookingsAsync({}))
    dispatch(getAllAccountsAsync({}))
    dispatch(getAllCompanyAsync({}))
    dispatch(getAllBillersAsync({}))
  }, [dispatch])

  useEffect(() => {
    if (bookings?.length > 0) {
      setFilteredBookings(bookings)
    }
  }, [bookings])

  const revenueData = companies.map((company) => {
    const totalRevenue = filteredBookings
      .filter((booking) => booking.companyId === company.companyId)
      .reduce((acc, curr) => acc + Number(curr.amount), 0)

    return {
      name: company.name,
      revenue: totalRevenue
    }
  })

  return (
    <div style={styles.dashboardPage}>
      <h1 style={styles.dashboardHeading}>Dashboard</h1>
      <StatCards companiesCount={companies.length} accountsCount={accounts.length} billersCount={billers.length} />
      <Filters
        companies={companies}
        accounts={accounts}
        billers={billers}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        selectedBiller={selectedBiller}
        setSelectedBiller={setSelectedBiller}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        startDate={startDate}
        setStartDate={setStartDate}
        handleResetFilters={handleResetFilters}
        handleFilter={() => handleFilter()}
      />
      <RevenueCharts revenueData={revenueData} />
      <BookingsTable
        columns={columns}
        dataSource={filteredBookings}
        pagination={pagination}
        loading={loading}
        handleTableChange={handleTableChange}
      />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  dashboardPage: {},
  dashboardHeading: {
    fontSize: '2em',
    marginBottom: '16px'
  }
}

export default DashboardPage
