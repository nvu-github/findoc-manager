export interface IBooking {
  booking_id?: string
  company_id?: string
  account_id?: string
  biller_id?: string
  date: string
  amount: number
  currency: string
  exchange_rate: number
  description: string
  taxt_amount: number
  tag: string
  invoice_date: string
  payment_date: string
  taxt_date: string
}
