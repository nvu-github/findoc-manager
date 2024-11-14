import express, { Request, Response, NextFunction } from 'express';

import productController from '../controller/product.controller';

const router = express.Router()
router.get('/', productController.getProducts)

router.get('/about', (req: Request, res: Response) => {
  console.log(123);
  res.send('About product')
})

export default router;