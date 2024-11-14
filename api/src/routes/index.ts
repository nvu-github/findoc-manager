import express, {Request, Response, NextFunction} from 'express';

import productRoute from "./product";

const router = express.Router()

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)
router.use('/product', productRoute)

export default router