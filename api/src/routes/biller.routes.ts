import express from 'express'
import billerController from '~/controller/biller.controller'

const router = express.Router()

router.get('/', billerController.getAllBillers)
router.get('/:biller_id', billerController.getBillerById)
router.post('/', billerController.createBiller)
router.put('/:biller_id', billerController.updateBiller)
router.delete('/:biller_id', billerController.deleteBiller)

export default router
