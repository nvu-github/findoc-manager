import { Request, Response, NextFunction } from 'express'
import { toSnakeCase } from '~/utils'

const snakeCaseRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = toSnakeCase(req.body)
  }
  if (req.query) {
    req.query = toSnakeCase(req.query)
  }
  if (req.params) {
    req.params = toSnakeCase(req.params)
  }
  next()
}

export default snakeCaseRequestMiddleware
