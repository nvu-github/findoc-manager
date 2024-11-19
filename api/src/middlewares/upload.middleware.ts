import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { StatusCodes } from 'http-status-codes'
import uploads3 from '~/config/uploads3'

const uploadDocumentsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  uploads3.array('files', 10)(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: `Multer error: ${err.message}`
        })
      } else {
        console.error('Upload Error:', err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: `Upload failed: ${err.message}`
        })
      }
    }
    next()
  })
}

export default uploadDocumentsMiddleware
