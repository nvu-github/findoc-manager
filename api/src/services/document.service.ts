import fs from 'fs'
import { Request, Response } from 'express'
import axios from 'axios'
import FormData from 'form-data'
import path from 'path'
import os from 'os'
import moment from 'moment'

import { IBooking, IDocument } from '~/interfaces'
import db from '~/config/database'
import { TABLES } from '~/constants'
import bookingService from './booking.service'
import S3Service from './s3.service'

const PAPERLESS_API_URL = process.env.PAPERLESS_API_URL
const PAPERLESS_API_KEY = process.env.PAPERLESS_API_KEY

const headers = {
  Authorization: `Token ${PAPERLESS_API_KEY}`
}

class DocumentService {
  async createDocuments(req: Request, res: Response): Promise<Response<IDocument[]>> {
    const { booking_id } = req.params
    if (!booking_id) {
      return res.status(400).json({ message: 'Booking id is required.' })
    }

    const bookingFound = await bookingService.findBookingById(Number(booking_id))
    if (!bookingFound) {
      return res.status(400).json({ message: 'Booking not found.' })
    }

    if (!req.files || !(req.files instanceof Array)) {
      return res.status(400).json({ message: 'No files uploaded.' })
    }

    try {
      const documents = await this.formattedDocuments(req.files, bookingFound)
      const createdDocuments = await db(TABLES.DOCUMENT).insert(documents).returning('*')
      return res.status(201).json(createdDocuments)
    } catch (error: any) {
      console.error('Error in document creation:', error)
      return res.status(500).json({ message: error.message })
    }
  }

  async getDocumentsByBookingId(req: Request, res: Response): Promise<Response> {
    const { booking_id } = req.params
    const documents = await db(TABLES.DOCUMENT).where({ booking_id }).select()

    if (!documents.length) {
      return res.send([])
    }

    return res.json(documents)
  }

  async deleteDocument(req: Request, res: Response) {
    const { document_id } = req.body

    const documentFound = await db(TABLES.DOCUMENT).where({ document_id }).first()
    if (!documentFound) {
      return res.status(400).json({ message: 'Document not found.' })
    }

    try {
      await S3Service.deleteFile(documentFound.file_url)
      await db(TABLES.DOCUMENT).where({ document_id }).del()
      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting document from S3.' })
    }
  }

  private async formattedDocuments(files: any, booking: IBooking) {
    const documents = []
    for (const file of files) {
      try {
        await this.uploadDocumentFromS3ToPaperless(file, booking)
        const title = `${booking?.booking_id}-${booking.reference_number}`
        const document = await this.getDocumentByTitle(title)
        const metadata = await this.getMetadataDocumentFromPaperLess(document.id)

        documents.push({
          booking_id: booking.booking_id,
          file_url: file.location,
          uploaded_at: moment().format('YYYY-MM-DD'),
          metadata: JSON.stringify(metadata)
        })
      } catch (error: any) {
        console.error('Error processing file:', file.originalname, error)
        throw new Error(`Failed to process file: ${file.originalname}`)
      }
    }

    return documents
  }

  private async uploadDocumentFromS3ToPaperless(s3Object: any, booking: IBooking) {
    const { bucket, key } = s3Object
    const tempFilePath = path.join(os.tmpdir(), key.split('/').pop() || 'tempfile')

    try {
      await S3Service.downloadFile(bucket, key, tempFilePath)

      if (!fs.existsSync(tempFilePath)) {
        throw new Error(`Temporary file not found at ${tempFilePath}`)
      }

      const formData = new FormData()
      formData.append('document', fs.createReadStream(tempFilePath))
      formData.append('title', `${booking?.booking_id}-${booking.reference_number}`)

      await axios.post(`${PAPERLESS_API_URL}/api/documents/post_document/`, formData, {
        headers: {
          ...headers,
          ...formData.getHeaders()
        }
      })
    } catch (error: any) {
      console.error('Error uploading document to Paperless-ngx:', error.message)
      throw new Error('Failed to upload document to Paperless-ngx')
    } finally {
      await S3Service.deleteTempFile(tempFilePath)
    }
  }

  private async getDocumentByTitle(title: string, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await axios.get(`${PAPERLESS_API_URL}/api/search/?query=${title}`, { headers })
        const documents = response.data.documents
        if (documents.length > 0) {
          return documents[0]
        } else {
          console.log('Document not found, retrying...')
          if (attempt < retries - 1) await this.delay(5000)
        }
      } catch (error: any) {
        console.error('Error fetching document from Paperless-ngx:', error.message)
        throw new Error('Failed to get document by file name')
      }
    }
    throw new Error('Document not found after multiple attempts')
  }

  private async getMetadataDocumentFromPaperLess(documentId: number) {
    try {
      const response = await axios.get(`${PAPERLESS_API_URL}/api/documents/${documentId}/metadata/`, { headers })
      return response.data
    } catch (error: any) {
      console.error('Error fetching document metadata from Paperless-ngx:', error.message)
      throw new Error('Failed to get metadata from Paperless-ngx')
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export default new DocumentService()
