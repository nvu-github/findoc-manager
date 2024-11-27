import express from 'express'
import currencyController from '~/controller/currency.controller'

const router = express.Router()

router.get('/', currencyController.getAllCurrencies)

export default router
