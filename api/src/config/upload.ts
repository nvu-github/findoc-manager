import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv'

dotenv.config()
const s3: any = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME!,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now().toString()}-${file.originalname}`)
    }
  })
})

export default upload
