import * as moment from 'moment'

export type Booking = {
  bookingId?: string
  companyId?: string
  accountId?: string
  billerId?: string
  date: moment.Moment
  amount: number
  currency: string
  exchangeRate?: number
  description: string
  taxAmount?: number
  tag?: string
  invoiceDate: moment.Moment
  paymentDate: moment.Moment
  taxDate: moment.Moment
}
