export interface IBiller {
  biller_id?: number
  name: string
  address: string
  tax_id: string
  default_currency: string
  contact_info: string
  biller_type: 'biller' | 'payer' | 'recipient'
  created_at?: Date
  updated_at?: Date
}
