import express, { Request, Response, NextFunction } from 'express'

import accountRoute from './account.routes'
import companyRoute from './company.routes'

const router = express.Router()
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now())
  next()
}

router.use(timeLog)
router.use('/account', accountRoute)
router.use('/company', companyRoute)

export default router
