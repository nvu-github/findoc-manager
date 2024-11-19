import moment from 'moment'

export interface IDocument {
  document_id?: string
  booking_id: string
  file_url: string
  uploaded_at: moment.Moment
  meta_data: JSON
  created_at: moment.Moment
}
