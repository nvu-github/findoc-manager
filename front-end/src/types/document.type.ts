import { Dayjs } from 'dayjs'

export type Document = {
  documentId?: string
  bookingId?: string
  fileUrl?: string
  uploadedAt?: Dayjs
  metaData?: object
}
