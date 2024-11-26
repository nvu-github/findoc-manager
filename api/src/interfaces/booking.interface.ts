export interface IBooking {
  booking_id?: number
  company_id: number
  account_id: number
  invoice_issuer_id?: number | null
  invoice_recipient_id?: number | null
  tax_rate_id?: number | null
  entry_date: string
  invoice_date: string
  invoice_received_date?: string | null
  total_amount: string
  tax_amount: string
  tax_rate: string
  expense_category: string
  tags?: string | null
  currency: string
  due_date: string
  payment_status: 'unpaid' | 'partially_paid' | 'fully_paid'
  reference_number: string
  project_cost_center?: number | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}
