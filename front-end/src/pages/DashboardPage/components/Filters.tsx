import React from 'react'
import { Row, Col, Select, DatePicker, Button } from 'antd'
import dayjs from 'dayjs'
import { Company, Account, Biller } from '../../../types'

const { Option } = Select
const { RangePicker } = DatePicker

interface FiltersProps {
  companies: Company[]
  accounts: Account[]
  billers: Biller[]
  selectedCompany: string | null
  setSelectedCompany: (value: string | null) => void
  selectedAccount: string | null
  setSelectedAccount: (value: string | null) => void
  selectedBiller: string | null
  setSelectedBiller: (value: string | null) => void
  selectedDates: [dayjs.Dayjs, dayjs.Dayjs] | null
  setSelectedDates: (value: [dayjs.Dayjs, dayjs.Dayjs] | null) => void
  startDate: dayjs.Dayjs | null
  setStartDate: (value: dayjs.Dayjs | null) => void
  handleResetFilters: () => void
  handleFilter: () => void
}

const Filters: React.FC<FiltersProps> = ({
  companies,
  accounts,
  billers,
  selectedCompany,
  setSelectedCompany,
  selectedAccount,
  setSelectedAccount,
  selectedBiller,
  setSelectedBiller,
  selectedDates,
  setSelectedDates,
  startDate,
  setStartDate,
  handleResetFilters,
  handleFilter
}) => {
  return (
    <Row gutter={[16, 16]} style={styles.filterRow}>
      <Col span={4}>
        <Select
          placeholder='Select Company'
          style={styles.filterSelect}
          onChange={(value) => setSelectedCompany(value)}
          value={selectedCompany}
          allowClear
        >
          {companies.map((company: Company) => (
            <Option key={company.companyId} value={company.companyId}>
              {company.companyName}
            </Option>
          ))}
        </Select>
      </Col>

      <Col span={4}>
        <Select
          placeholder='Select account'
          style={styles.filterSelect}
          onChange={(value) => setSelectedAccount(value)}
          value={selectedAccount}
          allowClear
        >
          {accounts.map((account: Account) => (
            <Option key={account.accountId} value={account.accountId}>
              {account.accountName}
            </Option>
          ))}
        </Select>
      </Col>

      <Col span={4}>
        <Select
          placeholder='Select biller'
          style={styles.filterSelect}
          onChange={(value) => setSelectedBiller(value)}
          value={selectedBiller}
          allowClear
        >
          {billers.map((biller: Biller) => (
            <Option key={biller.billerId} value={biller.billerId}>
              {biller.name}
            </Option>
          ))}
        </Select>
      </Col>

      <Col span={6}>
        <RangePicker
          style={styles.rangePicker}
          onChange={(dates) => {
            setSelectedDates(dates ? [dayjs(dates[0]), dayjs(dates[1])] : null)
          }}
          onCalendarChange={(dates) => {
            if (dates && dates[0]) {
              setStartDate(dayjs(dates[0]))
            }
          }}
          disabledDate={(currentDate) => {
            return !!(startDate && currentDate && currentDate.isBefore(startDate, 'day'))
          }}
          value={selectedDates}
        />
      </Col>

      <Col span={5}>
        <Button style={styles.buttonReset} htmlType='button' type='default' onClick={handleResetFilters}>
          Reset Filters
        </Button>
        <Button htmlType='button' type='primary' onClick={() => handleFilter()}>
          Apply Filters
        </Button>
      </Col>
    </Row>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  filterRow: {
    marginTop: '24px',
    marginBottom: '20px'
  },
  filterSelect: {
    width: '100%'
  },
  rangePicker: {
    width: '100%'
  },
  buttonReset: {
    marginRight: '20px'
  }
}

export default Filters
