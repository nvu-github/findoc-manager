import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3'
import { createWriteStream } from 'fs'
import fsPromise from 'fs/promises'

const AWS_REGION = process.env.AWS_REGION
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

class S3Service {
  async deleteFile(key: string): Promise<void> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    })

    try {
      await s3.send(deleteCommand)
      console.log(`File ${key} deleted successfully from ${S3_BUCKET_NAME}`)
    } catch (error) {
      console.error('Error deleting file from S3:', error)
      throw new Error('Failed to delete file from S3')
    }
  }

  async downloadFile(bucket: string, key: string, tempFilePath: string): Promise<void> {
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

  async deleteFolder(folderPrefix: string): Promise<void> {
    try {
      const listParams = {
        Bucket: S3_BUCKET_NAME,
        Prefix: folderPrefix
      }

      const listResponse = await s3.send(new ListObjectsV2Command(listParams))

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        const deleteParams = {
          Bucket: S3_BUCKET_NAME,
          Delete: {
            Objects: listResponse.Contents.map((object) => ({
              Key: object.Key!
            }))
          }
        }

        await s3.send(new DeleteObjectsCommand(deleteParams))
        console.log(`Folder ${folderPrefix} deleted successfully`)
      }
    } catch (error) {
      console.error('Error deleting folder from S3:', error)
      throw new Error('Failed to delete folder from S3')
    }
  }

  async deleteTempFile(filePath: string): Promise<void> {
    try {
      await fsPromise.unlink(filePath)
      console.log('Temporary file deleted successfully:', filePath)
    } catch (error) {
      console.error('Error deleting temporary file:', filePath, error)
      throw error
    }
  }
}

export default new S3Service()
