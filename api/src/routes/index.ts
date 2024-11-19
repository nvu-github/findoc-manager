import express, { Request, Response, NextFunction } from 'express'

import accountRoute from './account.routes'
import companyRoute from './company.routes'
import billerRoute from './biller.routes'
import bookingRoute from './booking.routes'
import currencyRoute from './currency.routes'

const router = express.Router()
// const timeLog = (req: Request, res: Response, next: NextFunction) => {
//   console.log('Time: ', Date.now())
//   next()
// }

// router.use(timeLog)
router.use('/account', accountRoute)
router.use('/company', companyRoute)
router.use('/biller', billerRoute)
router.use('/booking', bookingRoute)
router.use('/currency', currencyRoute)

export default router
