import express from 'express'
import taxrateController from '~/controller/taxrate.controller'

const router = express.Router()

router.get('/', taxrateController.getAllTaxRates)
router.get('/:tax_rate_id', taxrateController.getTaxRateById)
router.post('/', taxrateController.createTaxRate)
router.put('/:tax_rate_id', taxrateController.updateTaxRate)
router.delete('/:tax_rate_id', taxrateController.deleteTaxRate)

export default router
