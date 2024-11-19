import { Request, Response, NextFunction } from 'express'
import { toCamelCase } from '~/utils'

const camelCaseResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json

  res.json = function (data: any) {
    const camelCaseData = toCamelCase(data)
    return originalJson.call(this, camelCaseData)
  }

  next()
}

export default camelCaseResponseMiddleware
