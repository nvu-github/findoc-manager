import express from 'express'
import accountController from '~/controller/account.controller'

const router = express.Router()

router.get('/', accountController.getAllAccounts)
router.get('/:account_id', accountController.getAccountById)
router.post('/', accountController.createAccount)
router.put('/:account_id', accountController.updateAccount)
router.delete('/:account_id', accountController.deleteAccount)

export default router
