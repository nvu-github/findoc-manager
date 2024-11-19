import { Dayjs } from 'dayjs'

export type Booking = {
  bookingId?: string | number
  companyId?: string | number
  accountId?: string | number
  billerId?: string | number | null
  currencyId?: string | number | null
  date: Dayjs
  amount: number
  exchangeRate?: number | null
  description?: string
  tax?: number | null
  taxRate?: number | null
  tags?: string | null
}
