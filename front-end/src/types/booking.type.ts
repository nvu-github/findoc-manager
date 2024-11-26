import { Dayjs } from 'dayjs'

export type Booking = {
  bookingId?: number | string
  companyId?: number | string
  accountId?: number | string
  invoiceIssuerId?: number | null
  invoiceRecipientId?: number | null
  taxRateId?: number | null
  entryDate: Dayjs
  invoiceDate: Dayjs
  invoiceReceivedDate?: Dayjs | null
  totalAmount: number
  taxAmount: number
  taxRate: number
  expenseCategory: string
  tags?: string | null
  currency: string
  dueDate: Dayjs
  paymentStatus: 'unpaid' | 'partially_paid' | 'fully_paid'
  referenceNumber: string
  projectCostCenter?: number | null
  notes?: string | null
  createdAt?: Dayjs
  updatedAt?: Dayjs
}
