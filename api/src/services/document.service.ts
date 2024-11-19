import fs from 'fs/promises'
import { createWriteStream, createReadStream } from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import os from 'os'
import path from 'path'
import moment from 'moment'
import { Request, Response } from 'express'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { StatusCodes } from 'http-status-codes'

import db from '~/config/database'
import { TABLES } from '~/constants'
import { IDocument } from '~/interfaces'
import bookingService from './booking.service'

const AWS_REGION = process.env.AWS_REGION
const s3 = new S3Client({ region: AWS_REGION })

const PAPERLESS_API_URL = process.env.PAPERLESS_API_URL
const PAPERLESS_API_KEY = process.env.PAPERLESS_API_KEY

class DocumentService {
  async createDocuments(req: Request, res: Response): Promise<Response<IDocument[]>> {
    const { booking_id } = req.params
    if (!booking_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking id is required.' })
    }

    const bookingFound = await bookingService.findBookingById(Number(booking_id))
    if (!bookingFound) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking is not found.' })
    }

    if (!req.files || !(req.files instanceof Array)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No files uploaded.' })
    }

    await this.uploadDocumentFromS3ToPaperless(req.files[0])

    const documents = req.files.map((file: any) => ({
      booking_id,
      file_url: file.location,
      uploaded_at: moment().format('YYYY-MM-DD')
    }))

    const createdDocuments = await db(TABLES.DOCUMENT).insert(documents).returning('*')
    return res.status(StatusCodes.CREATED).json(createdDocuments)
  }

  private async uploadDocumentFromS3ToPaperless(s3Object: any) {
    const { bucket, key } = s3Object
    const tempFilePath = path.join(os.tmpdir(), key.split('/').pop() || 'tempfile')

    try {
      await this.downloadFileFromS3(bucket, key, tempFilePath)

      const formData = new FormData()
      formData.append('document', createReadStream(tempFilePath))

      const headers = {
        ...formData.getHeaders(),
        Authorization: `Token ${PAPERLESS_API_KEY}`
      }

      const response = await axios.post(`${PAPERLESS_API_URL}/api/documents/post_document/`, formData, {
        headers
      })

      console.log('Document uploaded to Paperless-ngx successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error uploading document to Paperless-ngx:', error.message)
      throw new Error('Failed to upload document to Paperless-ngx')
    } finally {
      await this.deleteTempFile(tempFilePath)
    }
  }

  private async downloadFileFromS3(bucket: string, key: string, tempFilePath: string) {
    try {
      const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key })
      const s3Response = await s3.send(getObjectCommand)

      if (!s3Response.Body) {
        throw new Error('No data returned from S3')
      }

      const fileStream = createWriteStream(tempFilePath)
      await new Promise<void>((resolve, reject) => {
        ;(s3Response.Body as any).pipe(fileStream).on('finish', resolve).on('error', reject)
      })
    } catch (error) {
      console.error('Error downloading file from S3:', error)
      throw new Error('Failed to download file from S3')
    }
  }

  private async deleteTempFile(filePath: string) {
    try {
      await fs.unlink(filePath)
      console.log('Temporary file deleted successfully:', filePath)
    } catch (error) {
      console.error('Error deleting temporary file:', filePath, error)
      throw error
    }
  }
}

export default new DocumentService()
