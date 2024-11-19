export interface IBooking {
  booking_id?: string
  company_id: string
  account_id: string
  biller_id?: string | null
  currency_id?: string | null
  date: string
  amount: number
  tax?: number | null
  tax_rate?: number | null
  description?: string | null
  tags?: string | null
  created_at?: string
  updated_at?: string
}
