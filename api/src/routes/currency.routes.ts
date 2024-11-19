import express from 'express'
import currencyController from '~/controller/currency.controller'

const router = express.Router()

router.get('/', currencyController.getAllCurrencies)
router.get('/:currency_id', currencyController.getCurrencyById)
router.post('/', currencyController.createCurrency)
router.put('/:currency_id', currencyController.updateCurrency)
router.delete('/:currency_id', currencyController.deleteCurrency)

export default router
